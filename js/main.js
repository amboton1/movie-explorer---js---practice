import { renderSearchView } from "./components/SearchView.js";
import { renderFavoritesView } from "./components/FavoritesView.js";
import { renderMovieDetailsView } from "./components/MovieDetails.js";

const app = document.getElementById("app");

async function loadView() {
  if (document.startViewTransition) {
    document.startViewTransition(async () => {
      await renderCurrentView();
    });
  } else {
    await renderCurrentView();
  }
}

async function renderCurrentView() {
  const hash = location.hash || "#/search";
  const movieMatch = hash.match(/^#\/movie\/(.+)/);

  if (hash === "#/search") {
    renderSearchView(app);
  } else if (hash === "#/favorites") {
    renderFavoritesView(app);
  } else if (movieMatch) {
    const movieId = movieMatch[1];
    await renderMovieDetailsView(app, movieId);
  } else {
    app.innerHTML = "<h2>Page not found.</h2>";
  }
}

window.addEventListener("hashchange", loadView);
loadView();
