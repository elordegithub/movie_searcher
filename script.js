document.addEventListener('DOMContentLoaded', () => {
    displayUpcomingMovies();
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

  async function displayUpcomingMovies() {
    const moviesContainer = document.getElementById('moviesContainer');
    const data = await fetchAPI('/movie/upcoming', { language: 'en-US', page: 1 });
  
    moviesContainer.innerHTML = '<h2>Upcoming Movies</h2>';
    if (data.results.length > 0) {
      data.results.forEach(movie => {
        moviesContainer.innerHTML += createMovieCard(movie);
      });
    } else {
      moviesContainer.innerHTML += '<p>No upcoming movies available.</p>';
    }
  }

  function createMovieCard(movie) {
    return `<div class="movie-card" onclick="displayMovieDetails(${movie.id})">
      <img src="${imageUrl}${movie.poster_path}" alt="${movie.title}">
      <p>${movie.title}</p>
    </div>`;
  }

  async function searchMovies() {
    const searchInput = document.getElementById('searchInput').value;
    const moviesContainer = document.getElementById('moviesContainer');
    const backButton = document.getElementById('backButton');
  
    if (searchInput.trim() !== '') {
      const data = await searchMovie(searchInput);
  
      moviesContainer.innerHTML = '<h2>Search Results</h2>';
      if (data.results.length > 0) {
        data.results.forEach(movie => {
          moviesContainer.innerHTML += createMovieCard(movie);
        });
        // Show the back button after searching
        backButton.style.display = 'inline-block';
      } else {
        moviesContainer.innerHTML += '<p>No results found.</p>';
        backButton.style.display = 'none';
      }
    } else {
      moviesContainer.innerHTML = '';
      backButton.style.display = 'none';
    }
  }

    // Function to search a movie based on name
    async function searchMovie(query) {
      const endpoint = '/search/movie';
      const queryParams = { query };
      return fetchAPI(endpoint, queryParams);
    }