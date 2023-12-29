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