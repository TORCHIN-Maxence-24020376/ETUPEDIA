/**
 * Générateur automatique du menu latéral (themes-list)
 * Utilise les fonctions exposées par pages-index.js
 */

document.addEventListener('DOMContentLoaded', () => {
    const boot = () => {
        generateSidebar();
        initSidebarInteractions();
    };

    // Si l’index est déjà prêt
    if (Array.isArray(window.PAGES_INDEX) && window.PAGES_INDEX.length > 0) {
        boot();
    } else {
        // Sinon, on attend le signal envoyé par pages-index.js
        window.addEventListener('pagesIndexLoaded', boot, { once: true });
    }
});

/** Construit une URL absolue depuis la racine du site (évite /pages//pages/...) */
function resolveFromRoot(url) {
    const root = (typeof window.getSiteRoot === 'function') ? window.getSiteRoot() : '/';
    return root + String(url).replace(/^\/+/, ''); // nettoie les / en tête
}

function generateSidebar() {
    const sidebar = document.getElementById('themes-list');
    if (!sidebar) return;

    const getTree = window.getPagesTree;
    if (typeof getTree !== 'function') {
        console.warn('[Sidebar] getPagesTree introuvable.');
        return;
    }

    const tree = getTree();
    sidebar.innerHTML = ''; // reset

    // Générer les catégories à partir de l'arborescence
    Object.keys(tree).forEach(folderPath => {
        const folder = tree[folderPath];

        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'theme-category';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'theme-title';
        titleDiv.innerHTML = `
      ${folder.name.charAt(0).toUpperCase() + folder.name.slice(1)}
      <span class="theme-arrow">▶</span>
    `;

        const linksDiv = document.createElement('div');
        linksDiv.className = 'theme-links';

        // Ajouter les pages
        folder.pages.forEach(page => {
            const link = document.createElement('a');
            link.href = resolveFromRoot(page.url); // <- clé : toujours depuis la racine
            link.textContent = page.title;
            link.title = page.description || page.title;
            linksDiv.appendChild(link);
        });

        categoryDiv.appendChild(titleDiv);
        categoryDiv.appendChild(linksDiv);
        sidebar.appendChild(categoryDiv);
    });
}

function initSidebarInteractions() {
    const themeCategories = document.querySelectorAll('.theme-category');
    themeCategories.forEach(category => {
        const title = category.querySelector('.theme-title');
        if (!title) return;
        title.addEventListener('click', () => category.classList.toggle('open'));
    });
}
