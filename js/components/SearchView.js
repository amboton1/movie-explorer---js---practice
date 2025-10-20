import { searchMovies } from "../api.js";
import { store, subscribe, toggleFavorite, isFavorite } from "../store.js";

export function renderSearchView(container) {
  container.innerHTML = `
    <section class="search-section">
      <form id="search-form">
        <input 
          type="text" 
          id="search-input" 
          placeholder="Search for a movie..." 
          autocomplete="off"
        />
        <button type="submit">Search</button>
      </form>
      <div id="results" class="movie-grid"></div>
    </section>
  `;

  const form = container.querySelector("#search-form");
  const input = container.querySelector("#search-input");
  const resultsContainer = container.querySelector("#results");

  function render() {
    const { results, query } = store;

    if (!query) {
      resultsContainer.innerHTML = `<p>Type something to start searching 🎬</p>`;
      return;
    }

    if (results.length === 0) {
      resultsContainer.innerHTML = `<p>No movies found for "${query}".</p>`;
      return;
    }

    resultsContainer.innerHTML = results
      .map(
        (movie) => `
        <div class="movie-card" data-id="${movie.imdbID}">
          <img src="${
            movie.Poster !== "N/A" ? movie.Poster : "./assets/no-image.jpg"
          }" alt="${movie.Title}">
          <h3>${movie.Title}</h3>
          <p>${movie.Year}</p>
          <button class="fav-btn ${isFavorite(movie.imdbID) ? "active" : ""}">
            ${isFavorite(movie.imdbID) ? "❤️" : "🤍"}
          </button>
        </div>
      `
      )
      .join("");

    resultsContainer
      .querySelectorAll(".movie-card img, .movie-card h3")
      .forEach((el) => {
        el.addEventListener("click", (e) => {
          const card = e.target.closest(".movie-card");
          const imdbID = card.dataset.id;
          location.hash = `#/movie/${imdbID}`;
        });
      });

    resultsContainer.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card");
        const id = card.dataset.id;
        const movie = store.results.find((m) => m.imdbID === id);
        toggleFavorite(movie);
      });
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    resultsContainer.innerHTML = `<p>Loading...</p>`;

    const movies = await searchMovies(query);
    store.query = query;
    store.results = movies;
  });

  const unsubscribe = subscribe(render);

  render();

  window.addEventListener("hashchange", () => unsubscribe(), { once: true });
}
