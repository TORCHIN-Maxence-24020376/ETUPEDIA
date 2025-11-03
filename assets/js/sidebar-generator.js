/**
 * Générateur automatique du menu latéral (themes-list)
 * Génère l'arborescence des dossiers et pages à partir de pages-index.js
 */

document.addEventListener('DOMContentLoaded', function() {
    generateSidebar();
    initSidebarInteractions();
});

function generateSidebar() {
    const sidebar = document.getElementById('themes-list');
    if (!sidebar) return;

    const tree = getPagesTree();
    sidebar.innerHTML = ''; // Vider le contenu existant

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
            link.href = getRootRelativePath(page.url);
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

        title.addEventListener('click', function() {
            category.classList.toggle('open');
        });
    });
}

/**
 * Calcule le chemin relatif à la racine en fonction de la page actuelle
 */
function getRootRelativePath(url) {
    const currentPath = window.location.pathname;
    const depth = (currentPath.match(/\//g) || []).length - 1;

    if (currentPath.includes('/pages/')) {
        const pagesDepth = currentPath.split('/pages/')[1].split('/').length - 1;
        const prefix = '../'.repeat(pagesDepth);
        return prefix + url;
    }

    return url;
}