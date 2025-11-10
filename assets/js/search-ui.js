document.addEventListener('DOMContentLoaded', initSearchUI);

function initSearchUI() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    if (!searchInput || !searchResults) return;

    let searchTimeout;

    // Recherche avec délai (debounce)
    searchInput.addEventListener('input', function () {
        clearTimeout(searchTimeout);
        const query = this.value.trim();

        if (query.length < 2) {
            searchResults.classList.remove('show');
            return;
        }

        searchTimeout = setTimeout(() => {
            performGlobalSearch(query);
        }, 300);
    });

    // Fermer si clic ailleurs
    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });

    // Rouvrir si on refocus l’input
    searchInput.addEventListener('focus', function () {
        if (this.value.trim().length >= 2 && searchResults.children.length > 0) {
            searchResults.classList.add('show');
        }
    });

    // Navigation clavier
    searchInput.addEventListener('keydown', function (e) {
        const items = searchResults.querySelectorAll('.search-result-item, .global-result-item');
        const activeItem = Array.from(items).find(i => i.classList.contains('active'));
        let currentIndex = activeItem ? Array.from(items).indexOf(activeItem) : -1;

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
            activeItem.click();
        }
    });
}

/* Lance la recherche */
function performGlobalSearch(query) {
    const localResults = searchInCurrentPage(query);
    const globalResults = searchInPages(query);
    displayCombinedResults(localResults, globalResults, query);
}

/* Affiche les résultats */
function displayCombinedResults(localResults, globalResults, query) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    let hasResults = false;

    // Résultats locaux
    if (localResults.length > 0) {
        hasResults = true;
        const localSection = document.createElement('div');
        localSection.className = 'search-section';
        localSection.innerHTML = '<div class="search-section-title">🔍 Sur cette page</div>';

        localResults.slice(0, 5).forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            if (index === 0) resultItem.classList.add('active');

            resultItem.innerHTML = `
                <div class="search-result-title">${result.title}</div>
                <div class="search-result-preview">${highlightText(result.preview, query)}</div>
            `;

            resultItem.addEventListener('click', () => {
                scrollToElement(result.element);
                searchResults.classList.remove('show');
                document.getElementById('search-input').blur();
            });

            localSection.appendChild(resultItem);
        });

        searchResults.appendChild(localSection);
    }

    // Résultats globaux
    if (globalResults.length > 0) {
        hasResults = true;
        const globalSection = document.createElement('div');
        globalSection.className = 'search-section';
        globalSection.innerHTML = '<div class="search-section-title">📚 Autres pages</div>';

        globalResults.slice(0, 5).forEach((result, index) => {
            const resultItem = document.createElement('a');
            resultItem.className = 'global-result-item';
            if (localResults.length === 0 && index === 0) resultItem.classList.add('active');

            // ✅ URL propre depuis la racine
            resultItem.href = resolveFromRoot(result.url);

            resultItem.innerHTML = `
                <div class="search-result-title">${highlightText(result.title, query)}</div>
                <div class="search-result-preview">${highlightText(result.description || '', query)}</div>
            `;

            // ✅ Réécriture de l'URL visible + redirection
            resultItem.addEventListener('click', (e) => {
                e.preventDefault();
                const newUrl = resolveFromRoot(result.url);
                window.history.pushState({}, '', newUrl); // modifie la barre d’adresse
                window.location.href = newUrl;             // redirige réellement
            });

            globalSection.appendChild(resultItem);
        });

        searchResults.appendChild(globalSection);
    }

    if (!hasResults) {
        searchResults.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
    }

    searchResults.classList.add('show');
}

/* Surligne le texte trouvé */
function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ✅ Corrigé : renvoie un chemin absolu depuis la racine */
function resolveFromRoot(url) {
    const root = (typeof window.getSiteRoot === 'function') ? window.getSiteRoot() : '/';
    return root + String(url).replace(/^\/+/, '');
}
