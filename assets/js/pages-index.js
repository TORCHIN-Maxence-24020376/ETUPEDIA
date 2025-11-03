/**
 * Index automatique des pages du wiki
 * Ce fichier sera généré automatiquement en scannant le dossier pages/
 * 
 * Structure attendue dans chaque page HTML :
 * <meta name="wiki-tags" content="tag1, tag2, tag3">
 * <meta name="wiki-category" content="Catégorie">
 * <meta name="wiki-description" content="Description de la page">
 */

const PAGES_INDEX = [
    // Exemple de structure - à remplir automatiquement ou manuellement
    {
        title: "Template",
        url: "pages/template/template.html",
        category: "Template",
        folder: "template",
        tags: ["exemple", "template"],
        description: "Page template pour créer de nouvelles pages"
    }
];

/**
 * Fonction pour obtenir l'arborescence des dossiers et fichiers
 */
function getPagesTree() {
    const tree = {};
    
    PAGES_INDEX.forEach(page => {
        const pathParts = page.url.replace('pages/', '').split('/');
        const fileName = pathParts.pop();
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

/**
 * Fonction pour rechercher dans l'index des pages
 */
function searchInPages(query) {
    if (!query || query.length < 2) return [];
    
    const queryLower = query.toLowerCase();
    const results = [];
    
    PAGES_INDEX.forEach(page => {
        let score = 0;
        let matchedIn = [];
        
        // Recherche dans le titre (poids: 10)
        if (page.title.toLowerCase().includes(queryLower)) {
            score += 10;
            matchedIn.push('title');
        }
        
        // Recherche dans la catégorie (poids: 5)
        if (page.category && page.category.toLowerCase().includes(queryLower)) {
            score += 5;
            matchedIn.push('category');
        }
        
        // Recherche dans la description (poids: 3)
        if (page.description && page.description.toLowerCase().includes(queryLower)) {
            score += 3;
            matchedIn.push('description');
        }
        
        // Recherche dans les tags (poids: 7)
        if (page.tags) {
            page.tags.forEach(tag => {
                if (tag.toLowerCase().includes(queryLower)) {
                    score += 7;
                    matchedIn.push('tags');
                }
            });
        }
        
        if (score > 0) {
            results.push({
                ...page,
                score: score,
                matchedIn: [...new Set(matchedIn)]
            });
        }
    });
    
    // Trier par score décroissant
    results.sort((a, b) => b.score - a.score);
    
    return results;
}
