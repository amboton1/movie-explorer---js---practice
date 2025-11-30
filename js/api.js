const API_KEY = "17b4e5ea";
const BASE_URL = "https://www.omdbapi.com/";

async function fetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

export async function searchMovies(query) {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
      query
    )}&type=movie`;
    const data = await fetchData(url);
    if (data.Response === "True") {
      return data.Search;
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export async function getMovieById(id) {
  try {
    const url = `${BASE_URL}?apikey=${API_KEY}&i=${id}&plot=full`;
    const data = await fetchData(url);
    return data.Response === "True" ? data : null;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}
