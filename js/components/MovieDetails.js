import { getMovieById } from "../api.js";
import { isFavorite, toggleFavorite } from "../store.js";

export async function renderMovieDetailsView(container, id) {
  container.innerHTML = `<p>Loading movie details...</p>`;

  const movie = await getMovieById(id);
  if (!movie) {
    container.innerHTML = `<p>Movie not found.</p>`;
    return;
  }

  const favorite = isFavorite(movie.imdbID);

  container.innerHTML = `
    <section class="movie-details">
      <button id="back-btn">← Back</button>

      <div class="details-content">
        <img src="${
          movie.Poster !== "N/A" ? movie.Poster : "./assets/no-image.jpg"
        }" alt="${movie.Title}">
        
        <div class="info">
          <h2>${movie.Title} (${movie.Year})</h2>
          <p><strong>Genre:</strong> ${movie.Genre}</p>
          <p><strong>Runtime:</strong> ${movie.Runtime}</p>
          <p><strong>Director:</strong> ${movie.Director}</p>
          <p><strong>Actors:</strong> ${movie.Actors}</p>
          <p><strong>Plot:</strong> ${movie.Plot}</p>

          <button id="fav-toggle" class="fav-btn ${favorite ? "active" : ""}">
            ❤️ ${favorite ? "Remove from Favorites" : "Add to Favorites"}
          </button>
        </div>
      </div>
    </section>
  `;

  document.getElementById("back-btn").addEventListener("click", () => {
    history.back();
  });

  document.getElementById("fav-toggle").addEventListener("click", (e) => {
    toggleFavorite(movie);
    renderMovieDetailsView(container, id);
  });
}
