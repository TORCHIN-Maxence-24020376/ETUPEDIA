document.addEventListener('DOMContentLoaded', function() {
    initLandingSearch();
});

function initLandingSearch() {
    const searchForm = document.querySelector('.search-bar');
    const searchInput = document.getElementById('site-search');

    if (!searchForm || !searchInput) return;

    // Créer le conteneur de résultats
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'landing-search-results';
    resultsContainer.id = 'landing-search-results';
    searchForm.appendChild(resultsContainer);

    let searchTimeout;

    // Recherche en temps réel
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);

        const query = this.value.trim();

        if (query.length < 2) {
            resultsContainer.classList.remove('show');
            return;
        }

        searchTimeout = setTimeout(() => {
            performLandingSearch(query);
        }, 300);
    });

    // Empêcher la soumission du formulaire par défaut
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const query = searchInput.value.trim();
        if (query.length >= 2) {
            const results = searchInPages(query);
            if (results.length > 0) {
                window.location.href = results[0].url;
            }
        }
    });

    // Fermer les résultats si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!searchForm.contains(e.target)) {
            resultsContainer.classList.remove('show');
        }
    });

    // Navigation au clavier
    searchInput.addEventListener('keydown', function(e) {
        const items = resultsContainer.querySelectorAll('.landing-result-item');
        const activeItem = resultsContainer.querySelector('.landing-result-item.active');
        let currentIndex = -1;

        if (activeItem) {
            currentIndex = Array.from(items).indexOf(activeItem);
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < items.length - 1) {
                if (activeItem) activeItem.classList.remove('active');
                items[currentIndex + 1].classList.add('active');
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                activeItem.classList.remove('active');
                items[currentIndex - 1].classList.add('active');
            }
        } else if (e.key === 'Enter' && activeItem) {
            e.preventDefault();
            const url = activeItem.getAttribute('data-url');
            if (url) window.location.href = url;
        }
    });
}

function performLandingSearch(query) {
    const resultsContainer = document.getElementById('landing-search-results');
    if (!resultsContainer) return;

    const results = searchInPages(query);
    displayLandingResults(results, query);
}

function displayLandingResults(results, query) {
    const resultsContainer = document.getElementById('landing-search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="landing-no-results">Aucune page trouvée</div>';
        resultsContainer.classList.add('show');
        return;
    }

    const limitedResults = results.slice(0, 8);

    limitedResults.forEach((result, index) => {
        const resultItem = document.createElement('a');
        resultItem.className = 'landing-result-item';
        resultItem.href = result.url;
        resultItem.setAttribute('data-url', result.url);

        if (index === 0) {
            resultItem.classList.add('active');
        }

        const resultCategory = document.createElement('div');
        resultCategory.className = 'landing-result-category';
        resultCategory.textContent = result.category || result.folder;

        const resultTitle = document.createElement('div');
        resultTitle.className = 'landing-result-title';
        resultTitle.innerHTML = highlightText(result.title, query);

        const resultDescription = document.createElement('div');
        resultDescription.className = 'landing-result-description';
        resultDescription.innerHTML = highlightText(result.description || '', query);

        resultItem.appendChild(resultCategory);
        resultItem.appendChild(resultTitle);
        resultItem.appendChild(resultDescription);

        resultsContainer.appendChild(resultItem);
    });

    resultsContainer.classList.add('show');
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}