/**
 * Générateur automatique du sommaire (table of contents)
 * Génère le sommaire à partir des titres h2, h3 et h4 présents dans le <main>
 */

document.addEventListener('DOMContentLoaded', function() {
    generateTableOfContents();
    initMobileTocModal();
});

function generateTableOfContents() {
    
    const tocContainer = document.querySelector('#table-of-contents ul');
    const mainContent = document.querySelector('main');

    if (!tocContainer) {
        console.error('❌ TOC Container (#table-of-contents ul) NOT FOUND!');
        return;
    }
    
    if (!mainContent) {
        console.error('❌ Main Content (main) NOT FOUND!');
        return;
    }

    const headings = mainContent.querySelectorAll('h2, h3, h4');

    if (headings.length === 0) {
        document.getElementById('table-of-contents').style.display = 'none';
        return;
    }

    tocContainer.innerHTML = '';

    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;

        const li = document.createElement('li');
        li.className = `toc-${heading.tagName.toLowerCase()}`;

        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;

        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Fermer le modal d'abord
            if (window.innerWidth <= 1024) {
                closeMobileTocModal();
                
                // Attendre que le modal se ferme avant de scroller
                setTimeout(() => {
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });

        li.appendChild(link);
        tocContainer.appendChild(li);
    });
}

/**
 * Initialise le modal mobile pour le sommaire
 */
function initMobileTocModal() {
    
    const tocToggle = document.querySelector('.toc-toggle');
    const toc = document.getElementById('table-of-contents');

    if (!tocToggle || !toc) {
        console.warn('⚠️ Toggle button or TOC not found');
        return;
    }

    // Créer le bouton de fermeture
    const closeButton = document.createElement('button');
    closeButton.className = 'toc-close';
    closeButton.innerHTML = '✕';
    closeButton.setAttribute('aria-label', 'Fermer le menu');
    toc.insertBefore(closeButton, toc.firstChild);

    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'toc-overlay';
    document.body.appendChild(overlay);

    // Déplacer le sommaire dans l'overlay pour le modal en mode mobile
    if (window.innerWidth <= 1024) {
        overlay.appendChild(toc);
    }

    // Ouvrir le modal
    tocToggle.addEventListener('click', function() {
        
        overlay.classList.add('active');
        toc.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        console.log('✅ Modal opened');
    });

    // Fermer le modal
    closeButton.addEventListener('click', function() {
        closeMobileTocModal();
    });
    
    // Fermer en cliquant sur l'overlay (mais pas sur le modal lui-même)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            closeMobileTocModal();
        }
    });

    // Fermer avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeMobileTocModal();
        }
    });

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && overlay.classList.contains('active')) {
            closeMobileTocModal();
        }
    });

    console.log('✅ Mobile TOC modal initialized');
}

function closeMobileTocModal() {
    
    const toc = document.getElementById('table-of-contents');
    const overlay = document.querySelector('.toc-overlay');
    
    if (toc) {
        toc.classList.remove('open');
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
    document.body.style.overflow = '';
    console.log('✅ Modal closed');
}