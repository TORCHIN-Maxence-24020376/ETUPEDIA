/**
 * Interface utilisateur de la recherche globale
 * Combine la recherche dans la page actuelle et dans toutes les pages
 */

document.addEventListener('DOMContentLoaded', function() {
    initSearchUI();
});

function initSearchUI() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (!searchInput || !searchResults) return;

    let searchTimeout;

    // Recherche avec debounce
    searchInput.addEventListener('input', function() {
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

    // Fermer les résultats si on clique en dehors
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.remove('show');
        }
    });

    // Rouvrir les résultats si on refocus l'input avec du contenu
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2 && searchResults.children.length > 0) {
            searchResults.classList.add('show');
        }
    });

    // Navigation au clavier
    searchInput.addEventListener('keydown', function(e) {
        const items = searchResults.querySelectorAll('.search-result-item, .global-result-item');
        const activeItem = Array.from(items).find(item => item.classList.contains('active'));
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

function performGlobalSearch(query) {
    // Recherche locale dans la page actuelle
    const localResults = searchInCurrentPage(query);

    // Recherche globale dans toutes les pages
    const globalResults = searchInPages(query);

    displayCombinedResults(localResults, globalResults, query);
}

function displayCombinedResults(localResults, globalResults, query) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';

    let hasResults = false;

    // Afficher les résultats locaux
    if (localResults.length > 0) {
        hasResults = true;
        const localSection = document.createElement('div');
        localSection.className = 'search-section';
        localSection.innerHTML = '<div class="search-section-title">🔍 Sur cette page</div>';

        localResults.slice(0, 5).forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            if (index === 0) resultItem.classList.add('active');

            const resultTitle = document.createElement('div');
            resultTitle.className = 'search-result-title';
            resultTitle.textContent = result.title;

            const resultPreview = document.createElement('div');
            resultPreview.className = 'search-result-preview';
            resultPreview.innerHTML = highlightText(result.preview, query);

            resultItem.appendChild(resultTitle);
            resultItem.appendChild(resultPreview);

            resultItem.addEventListener('click', function() {
                scrollToElement(result.element);
                searchResults.classList.remove('show');
                document.getElementById('search-input').blur();
            });

            localSection.appendChild(resultItem);
        });

        searchResults.appendChild(localSection);
    }

    // Afficher les résultats globaux
    if (globalResults.length > 0) {
        hasResults = true;
        const globalSection = document.createElement('div');
        globalSection.className = 'search-section';
        globalSection.innerHTML = '<div class="search-section-title">📚 Autres pages</div>';

        globalResults.slice(0, 5).forEach((result, index) => {
            const resultItem = document.createElement('a');
            resultItem.className = 'global-result-item';
            resultItem.href = getRootRelativePath(result.url);
            if (localResults.length === 0 && index === 0) {
                resultItem.classList.add('active');
            }

            const resultCategory = document.createElement('div');
            resultCategory.className = 'global-result-category';
            resultCategory.textContent = result.category || result.folder;

            const resultTitle = document.createElement('div');
            resultTitle.className = 'search-result-title';
            resultTitle.innerHTML = highlightText(result.title, query);

            const resultDescription = document.createElement('div');
            resultDescription.className = 'search-result-preview';
            resultDescription.innerHTML = highlightText(result.description || '', query);

            resultItem.appendChild(resultCategory);
            resultItem.appendChild(resultTitle);
            resultItem.appendChild(resultDescription);

            globalSection.appendChild(resultItem);
        });

        searchResults.appendChild(globalSection);
    }

    if (!hasResults) {
        searchResults.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
    }

    searchResults.classList.add('show');
}

function highlightText(text, query) {
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getRootRelativePath(url) {
    const currentPath = window.location.pathname;

    if (currentPath.includes('/pages/')) {
        const pagesDepth = currentPath.split('/pages/')[1].split('/').length - 1;
        const prefix = '../'.repeat(pagesDepth);
        return prefix + url;
    }

    return url;
}