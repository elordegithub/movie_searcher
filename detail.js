document.addEventListener('DOMContentLoaded', () => {
    // Get the movie ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
  
    // Display detailed information about the selected movie and its similar movies
    displayMovieAndSimilarMovies(movieId);
  });

const apiKey = '1bfdbff05c2698dc917dd28c08d41096';
const baseUrl = 'https://api.themoviedb.org/3';
const imageUrl = 'http://image.tmdb.org/t/p/w500';

async function fetchAPI(endpoint, queryParams = {}) {
  const url = new URL(`${baseUrl}${endpoint}`);
  url.searchParams.append('api_key', apiKey);
  Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

async function displayMovieAndSimilarMovies(movieId) {
    const selectedMovieContainer = document.getElementById('selectedMovie');
    const movieDetails = await fetchAPI(`/movie/${movieId}`, { language: 'en-US' });
  
  selectedMovieContainer.innerHTML = `
    <div id="selectedMovie">
      <img src="${imageUrl}${movieDetails.poster_path}" alt="${movieDetails.title}">
      <div id="selectedMovieDetails">
        <h1>${movieDetails.title}</h1>
        <p><span style="color:blue;font-weight:bold">Story:</span> ${movieDetails.overview}</p>
        <p><span style="color:blue;font-weight:bold">Release Date:</span> ${movieDetails.release_date}</p>
        <p><span style="color:blue;font-weight:bold">Director:</span> ${await getMovieCrew(movieId, 'Director')}</p>
        <p><span style="color:blue;font-weight:bold">Stars/Actors:</span> ${await getActorsInfo(movieId)}</p>
        <p><span style="color:blue;font-weight:bold">Genre:</span> ${getGenres(movieDetails.genres)}</p>
        <p><span style="color:blue;font-weight:bold">Ratings:</span> ${getRatings(movieDetails)}</p>
      </div>
    </div>`;
  
    const similarMovies = await fetchAPI(`/movie/${movieId}/similar`, { language: 'en-US', page: 1 });
  
    // Process and display similar movies on the UI
    if (similarMovies.results.length > 0) {
      similarMoviesContainer.innerHTML = '<h2>Similar Movies</h2>';
      similarMoviesContainer.innerHTML += '<div class="similar-movies-grid">';
      similarMovies.results.forEach(movie => {
        similarMoviesContainer.innerHTML += `<div class="similar-movie" onclick="displayMovieAndSimilarMovies(${movie.id})">
          <img src="${imageUrl}${movie.poster_path}" alt="${movie.title}">
          <p>${movie.title}</p>
        </div>`;
      });
      similarMoviesContainer.innerHTML += '</div>';
    }
  }

  async function getActorsInfo(movieId) {
    const credits = await fetchAPI(`/movie/${movieId}/credits`);
  
    // Get information about the first 5 actors for brevity
    const actors = credits.cast.slice(0, 5);
  
    // Check if there are any actors in the cast
    if (actors.length === 0) {
      return 'N/A';
    }
  
    // Format actor information (name and character played)
    const actorsInfo = actors.map(actor => `${actor.name} as ${actor.character || 'N/A'}`);
  
    return actorsInfo.join(', ');
  }
  
  async function getMovieCrew(movieId, job) {
    const credits = await fetchAPI(`/movie/${movieId}/credits`);
  
    const crew = credits.crew.find(member => member.job === job);
  
    return crew ? crew.name : 'N/A';
  }
  
  function getGenres(genres) {
    return genres.map(genre => genre.name).join(', ');
  }
  
  function getRatings(data) {
    const ratings = data.vote_average;
    const maxRating = 10; 
    return `${ratings}/${maxRating}`;
  }
  
  function goBack() {
    // Navigate back to the index page
    window.history.back();
  }