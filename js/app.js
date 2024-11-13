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

// Inicialización de películas predeterminadas
function initializeMovies() {
    if (!localStorage.getItem('mis_peliculas')) {
        const initialMovies = [
            { titulo: "Inception", director: "Christopher Nolan", miniatura: "files/inception.png" },
            { titulo: "The Matrix", director: "Lana Wachowski, Lilly Wachowski", miniatura: "files/matrix.png" }
        ];
        localStorage.setItem('mis_peliculas', JSON.stringify(initialMovies));
    }
}
initializeMovies();

// Funciones para manejar localStorage
function getMovies() {
    return JSON.parse(localStorage.getItem('mis_peliculas')) || [];
}

function saveMovies(movies) {
    localStorage.setItem('mis_peliculas', JSON.stringify(movies));
}

// Vistas
function indexView(peliculas) {
    const main = document.getElementById('main');
    main.innerHTML = `<h1>Mis Películas</h1>
                      <button onclick="searchView()">Buscar Película</button>
                      <button onclick="newContr()">Añadir Película</button>
                      <button onclick="resetContr()">Resetear Lista</button>`;
    peliculas.forEach((pelicula, i) => {
        main.innerHTML += `
            <div class="movie">
                <img src="${pelicula.miniatura}" alt="${pelicula.titulo}">
                <h3>${pelicula.titulo}</h3>
                <p>${pelicula.director}</p>
                <button onclick="showContr(${i})">Ver</button>
                <button onclick="editContr(${i})">Editar</button>
                <button onclick="deleteContr(${i})">Borrar</button>
            </div>
        `;
    });
}

function editView(i, pelicula) {
    const main = document.getElementById('main');
    main.innerHTML = `
        <h2>Editar Película</h2>
        <input type="text" id="edit-titulo" value="${pelicula.titulo}">
        <input type="text" id="edit-director" value="${pelicula.director}">
        <input type="text" id="edit-miniatura" value="${pelicula.miniatura}">
        <button onclick="updateContr(${i})">Actualizar</button>
        <button onclick="indexContr()">Volver</button>
    `;
}

function showView(pelicula) {
    const main = document.getElementById('main');
    main.innerHTML = `
        <h2>${pelicula.titulo}</h2>
        <p>Director: ${pelicula.director}</p>
        <img src="${pelicula.miniatura}" alt="${pelicula.titulo}">
        <button onclick="indexContr()">Volver</button>
    `;
}

function newView() {
    const main = document.getElementById('main');
    main.innerHTML = `
        <h2>Añadir Nueva Película</h2>
        <input type="text" id="new-titulo" placeholder="Título">
        <input type="text" id="new-director" placeholder="Director">
        <input type="text" id="new-miniatura" placeholder="URL de la Miniatura">
        <button onclick="createContr()">Crear</button>
        <button onclick="indexContr()">Volver</button>
    `;
}

function searchView() {
    const main = document.getElementById('main');
    main.innerHTML = `
        <h2>Buscar Películas</h2>
        <div id="search-container">
            <input type="text" id="movie-search-input" placeholder="Buscar película...">
            <button id="movie-search-btn">Buscar</button>
        </div>
        <div id="search-results"></div>
    `;
    
    document.getElementById('movie-search-btn').addEventListener('click', () => {
        const query = document.getElementById('movie-search-input').value.trim();
        if (query) {
            searchContr(query);
        } else {
            alert('Por favor, ingresa un término de búsqueda.');
        }
    });
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
            <p>Fecha de lanzamiento: ${movie.release_date || 'Desconocido'}</p>
            <button class="add-from-api" data-movie-id="${movie.id}">Añadir</button>
        `;
        
        resultsContainer.appendChild(movieElement);
    });

    document.querySelectorAll('.add-from-api').forEach(button => {
        button.addEventListener('click', (event) => {
            const movieId = event.target.getAttribute('data-movie-id');
            addFromAPIContr(movieId);
            event.target.disabled = true;
        });
    });
}

// Controladores
function indexContr() {
    const peliculas = getMovies();
    indexView(peliculas);
}

function editContr(i) {
    const peliculas = getMovies();
    const pelicula = peliculas[i];
    editView(i, pelicula);
}

function updateContr(i) {
    const peliculas = getMovies();
    peliculas[i] = {
        titulo: document.getElementById('edit-titulo').value,
        director: document.getElementById('edit-director').value,
        miniatura: document.getElementById('edit-miniatura').value
    };
    saveMovies(peliculas);
    indexContr();
}

function showContr(i) {
    const peliculas = getMovies();
    const pelicula = peliculas[i];
    showView(pelicula);
}

function newContr() {
    newView();
}

function createContr() {
    const peliculas = getMovies();
    const nuevaPelicula = {
        titulo: document.getElementById('new-titulo').value,
        director: document.getElementById('new-director').value,
        miniatura: document.getElementById('new-miniatura').value
    };
    peliculas.push(nuevaPelicula);
    saveMovies(peliculas);
    indexContr();
}

function deleteContr(i) {
    if (confirm("¿Estás seguro de que quieres eliminar esta película?")) {
        const peliculas = getMovies();
        peliculas.splice(i, 1);
        saveMovies(peliculas);
        indexContr();
    }
}

function resetContr() {
    localStorage.removeItem('mis_peliculas');
    initializeMovies();
    indexContr();
}

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

function addFromAPIContr(movieId) {
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;

    fetch(url)
        .then(response => response.json())
        .then(movie => {
            let peliculas = getMovies();

            if (peliculas.some(m => m.titulo === movie.title)) {
                alert('La película ya está en tu colección.');
            } else {
                const nuevaPelicula = {
                    titulo: movie.title,
                    director: movie.director || 'Desconocido',
                    miniatura: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : 'files/placeholder.png'
                };
                peliculas.push(nuevaPelicula);
                saveMovies(peliculas);
                alert(`${movie.title} ha sido añadido a tu colección.`);
            }
        })
        .catch(error => console.error('Error al agregar la película:', error));
}

document.addEventListener('DOMContentLoaded', () => {
    indexContr();
});

