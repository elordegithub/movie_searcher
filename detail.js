document.addEventListener('DOMContentLoaded', () => {
    // Get the movie ID from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
  
    // Display detailed information about the selected movie and its similar movies
    displayMovieAndSimilarMovies(movieId);
  });