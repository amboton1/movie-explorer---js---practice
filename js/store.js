const FAVORITES_KEY = "movie_explorer_favorites";
const subscribers = new Set();

function loadFavorites() {
  const data = localStorage.getItem(FAVORITES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveFavorites(favs) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
}

const state = {
  favorites: loadFavorites(),
  results: [],
  query: "",
};

export const store = new Proxy(state, {
  set(target, key, value) {
    target[key] = value;

    if (key === "favorites") {
      saveFavorites(value);
    }

    subscribers.forEach((fn) => fn(target));
    return true;
  },
});

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function toggleFavorite(movie) {
  const exists = store.favorites.some((f) => f.imdbID === movie.imdbID);
  if (exists) {
    store.favorites = store.favorites.filter((f) => f.imdbID !== movie.imdbID);
  } else {
    store.favorites = [...store.favorites, movie];
  }
}

export function isFavorite(imdbID) {
  return store.favorites.some((f) => f.imdbID === imdbID);
}
