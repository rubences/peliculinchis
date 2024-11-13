// Reemplaza con tu clave de API de TMDb
const API_KEY = '7f5a7dd038579b195e6518f6c23385d7';

function searchContr(query) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.results && data.results.length > 0) {
                resultsView(data.results);
            } else {
                document.getElementById('search-results').innerHTML = 'No se encontraron resultados.';
            }
        })
        .catch(error => console.error('Error en la solicitud a TMDb:', error));
}

function resultsView(resultados) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = ''; // Limpiar resultados anteriores

    resultados.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.className = 'movie';

        movieElement.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <button onclick="addFromAPIContr(${movie.id})">Añadir</button>
        `;
        
        resultsContainer.appendChild(movieElement);
    });
}

function addFromAPIContr(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {
            let movies = JSON.parse(localStorage.getItem('movies')) || [];
            
            if (!movies.some(m => m.id === movie.id)) {
                movies.push({
                    id: movie.id,
                    title: movie.title,
                    poster_path: movie.poster_path,
                    release_date: movie.release_date,
                    overview: movie.overview
                });
                localStorage.setItem('movies', JSON.stringify(movies));
                alert(`${movie.title} ha sido añadido a tu colección.`);
            } else {
                alert('La película ya está en tu colección.');
            }
        })
        .catch(error => console.error('Error al agregar la película:', error));
}

document.getElementById('movie-search-btn').addEventListener('click', () => {
    const query = document.getElementById('movie-search-input').value.trim();
    if (query) {
        searchContr(query);
    } else {
        alert('Por favor, ingresa un término de búsqueda.');
    }
});
