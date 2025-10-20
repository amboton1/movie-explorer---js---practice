import { store, subscribe, toggleFavorite } from "../store.js";

export function renderFavoritesView(container) {
  container.innerHTML = `
    <section>
      <h2>Your Favorites ❤️</h2>
      <div id="fav-list" class="movie-grid"></div>
    </section>
  `;

  const list = container.querySelector("#fav-list");

  function render() {
    const favorites = store.favorites;

    if (favorites.length === 0) {
      list.innerHTML = `<p>You haven't added any favorite movies yet.</p>`;
      return;
    }

    list.innerHTML = favorites
      .map(
        (movie) => `
          <div class="movie-card" data-id="${movie.imdbID}">
            <img src="${
              movie.Poster !== "N/A" ? movie.Poster : "./assets/no-image.jpg"
            }" alt="${movie.Title}">
            <h3>${movie.Title}</h3>
            <p>${movie.Year}</p>
            <button class="fav-btn active">❤️</button>
          </div>
        `
      )
      .join("");

    list.querySelectorAll(".fav-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card");
        const id = card.dataset.id;
        const movie = favorites.find((m) => m.imdbID === id);
        toggleFavorite(movie);
      });
    });

    list.querySelectorAll(".movie-card img, .movie-card h3").forEach((el) => {
      el.addEventListener("click", (e) => {
        const card = e.target.closest(".movie-card");
        const imdbID = card.dataset.id;
        location.hash = `#/movie/${imdbID}`;
      });
    });
  }

  const unsubscribe = subscribe(render);

  render();

  window.addEventListener("hashchange", () => unsubscribe(), { once: true });
}
