let PAGES_INDEX = [];

/** Trouve la racine du site (utile quand on est dans /pages/...) */
function getSiteRoot() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        const root = path.split('/pages/')[0];
        return root.endsWith('/') ? root : root + '/';
    }
    // on est déjà à la racine
    return '/';
}

/** Charge dynamiquement le fichier JSON des pages */
async function loadPagesIndex() {
    try {
        const root = getSiteRoot();
        const response = await fetch(`${root}assets/js/routes.json`);
        if (!response.ok) throw new Error("Erreur lors du chargement de l'index");
        PAGES_INDEX = await response.json();
    } catch (err) {
        console.error("[Wiki] Impossible de charger l'index :", err);
        PAGES_INDEX = [];
    } finally {
        // avertit les autres scripts que l'index est prêt (même en cas d'échec)
        window.dispatchEvent(new Event('pagesIndexLoaded'));
    }
}

/** Construit l’arborescence des dossiers et fichiers */
function getPagesTree() {
    const tree = {};

    PAGES_INDEX.forEach(page => {
        const pathParts = String(page.url).replace(/^\/?pages\//, '').split('/');
        // retire le fichier
        pathParts.pop();
        const folderPath = pathParts.join('/') || 'root';

        if (!tree[folderPath]) {
            tree[folderPath] = {
                name: pathParts[pathParts.length - 1] || 'Pages',
                pages: []
            };
        }

        tree[folderPath].pages.push({
            title: page.title,
            url: page.url,
            tags: page.tags,
            description: page.description
        });
    });

    return tree;
}

/** Recherche dans l’index des pages */
function searchInPages(query) {
    if (!query || query.length < 2) return [];

    const q = query.toLowerCase();
    const results = [];

    PAGES_INDEX.forEach(page => {
        let score = 0;
        const matchedIn = [];

        if (page.title?.toLowerCase().includes(q)) {
            score += 10; matchedIn.push('title');
        }
        if (page.category?.toLowerCase().includes(q)) {
            score += 5; matchedIn.push('category');
        }
        if (page.description?.toLowerCase().includes(q)) {
            score += 3; matchedIn.push('description');
        }
        if (Array.isArray(page.tags)) {
            page.tags.forEach(tag => {
                if (String(tag).toLowerCase().includes(q)) {
                    score += 7; matchedIn.push('tags');
                }
            });
        }

        if (score > 0) {
            results.push({ ...page, score, matchedIn: [...new Set(matchedIn)] });
        }
    });

    results.sort((a, b) => b.score - a.score);
    return results;
}

/* Expose en global (utilisé par d’autres scripts) */
window.PAGES_INDEX    = PAGES_INDEX;
window.getPagesTree   = getPagesTree;
window.searchInPages  = searchInPages;
window.loadPagesIndex = loadPagesIndex;
window.getSiteRoot    = getSiteRoot;

/* Lance le chargement automatiquement */
window.pagesIndexReady = loadPagesIndex();
