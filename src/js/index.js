const moodTextArea = document.getElementById('mood-input');
const searchButton = document.getElementById('search-button');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    moodTextArea.addEventListener('keypress', (event) => {
        if(event.key === 'Enter') {
            event.preventDefault();
            handleSearch();
        }
    });

    searchButton.addEventListener('click', handleSearch);
}

async function handleSearch() {
    const mood = moodTextArea.value.trim();

    if(!mood) {
        alert('Please enter your mood to find the perfect movies!');
        return;
    }

    const response = await fetch('https://fzilli.app.n8n.cloud/webhook/bootflix', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({userPrompt: mood})
    });

    const text = await response.text();

    if (!text) {
        console.warn('Empty response from n8n');
        return;
    }

    const data = JSON.parse(text);
    console.log('Raw response from n8n:', text);
    console.log('Data:', data);

    if (data && data.results && data.results.length > 0) {
        const movie = data.results[0];
        const posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

        const resultsDiv = document.getElementById('results');
        const moviesGrid = document.getElementById('movies-grid');

        if (resultsDiv && moviesGrid) {
            resultsDiv.style.display = 'block';
            moviesGrid.innerHTML = `
                <div class="movie-card">
                    <div class="movie-poster">
                        ${posterUrl ? `<img src="${posterUrl}" alt="${movie.title}">` : '<div class="no-poster">No image available</div>'}
                    </div>
                    <div class="movie-info">
                        <h4 class="movie-title">${movie.title}</h4>
                        <p class="movie-overview">${movie.overview || 'No description available.'}</p>
                        <p class="movie-rating">⭐ ${typeof movie.vote_average === 'number' ? movie.vote_average.toFixed(1) : 'N/A'} / 10</p>
                    </div>
                </div>
            `;
        }
    }
}
