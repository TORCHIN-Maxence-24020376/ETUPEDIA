/**
 * Générateur automatique du sommaire (table of contents)
 * Génère le sommaire à partir des titres h2, h3 et h4 présents dans le <main>
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TOC Generator - DOM Loaded');
    console.log('Window width:', window.innerWidth);
    generateTableOfContents();
    initMobileTocModal();
});

function generateTableOfContents() {
    console.log('📝 generateTableOfContents - Start');
    
    const tocContainer = document.querySelector('#table-of-contents ul');
    const mainContent = document.querySelector('main');

    console.log('TOC Container:', tocContainer);
    console.log('Main Content:', mainContent);

    if (!tocContainer) {
        console.error('❌ TOC Container (#table-of-contents ul) NOT FOUND!');
        return;
    }
    
    if (!mainContent) {
        console.error('❌ Main Content (main) NOT FOUND!');
        return;
    }

    const headings = mainContent.querySelectorAll('h2, h3, h4');
    console.log(`📚 Found ${headings.length} headings:`, headings);

    if (headings.length === 0) {
        console.warn('⚠️ No headings found, hiding TOC');
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

        console.log(`➕ Adding TOC item: ${heading.textContent} (${heading.tagName})`);

        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(`🔗 Clicked on: ${heading.textContent}`);
            
            // Fermer le modal d'abord
            if (window.innerWidth <= 1024) {
                console.log('📱 Mobile mode - closing modal');
                closeMobileTocModal();
                
                // Attendre que le modal se ferme avant de scroller
                setTimeout(() => {
                    console.log('📜 Scrolling to heading');
                    heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            } else {
                console.log('💻 Desktop mode - scrolling directly');
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
    console.log('📱 initMobileTocModal - Start');
    
    const tocToggle = document.querySelector('.toc-toggle');
    const toc = document.getElementById('table-of-contents');
    
    console.log('Toggle button:', tocToggle);
    console.log('TOC element:', toc);

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
    console.log('✅ Close button created');

    // Créer l'overlay
    const overlay = document.createElement('div');
    overlay.className = 'toc-overlay';
    document.body.appendChild(overlay);
    console.log('✅ Overlay created');

    // Déplacer le sommaire dans l'overlay pour le modal en mode mobile
    if (window.innerWidth <= 1024) {
        console.log('📱 Mobile detected - moving TOC to overlay');
        overlay.appendChild(toc);
        console.log('TOC moved to overlay. Overlay children:', overlay.children);
    }

    // Ouvrir le modal
    tocToggle.addEventListener('click', function() {
        console.log('🔘 Toggle button clicked');
        console.log('TOC before open:', {
            display: window.getComputedStyle(toc).display,
            visibility: window.getComputedStyle(toc).visibility,
            opacity: window.getComputedStyle(toc).opacity,
            transform: window.getComputedStyle(toc).transform,
            zIndex: window.getComputedStyle(toc).zIndex
        });
        
        overlay.classList.add('active');
        toc.classList.add('open');
        document.body.style.overflow = 'hidden';
        
        console.log('TOC classes:', toc.classList);
        console.log('Overlay classes:', overlay.classList);
        
        console.log('TOC after open:', {
            display: window.getComputedStyle(toc).display,
            visibility: window.getComputedStyle(toc).visibility,
            opacity: window.getComputedStyle(toc).opacity,
            transform: window.getComputedStyle(toc).transform,
            zIndex: window.getComputedStyle(toc).zIndex,
            backgroundColor: window.getComputedStyle(toc).backgroundColor
        });
        
        console.log('✅ Modal opened');
    });

    // Fermer le modal
    closeButton.addEventListener('click', function() {
        console.log('❌ Close button clicked');
        closeMobileTocModal();
    });
    
    // Fermer en cliquant sur l'overlay (mais pas sur le modal lui-même)
    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) {
            console.log('❌ Clicked on overlay background');
            closeMobileTocModal();
        }
    });

    // Fermer avec la touche Echap
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            console.log('❌ Escape key pressed');
            closeMobileTocModal();
        }
    });

    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', function() {
        if (window.innerWidth > 1024 && overlay.classList.contains('active')) {
            console.log('💻 Resized to desktop - closing modal');
            closeMobileTocModal();
        }
    });

    console.log('✅ Mobile TOC modal initialized');
}

function closeMobileTocModal() {
    console.log('🔒 closeMobileTocModal - Start');
    
    const toc = document.getElementById('table-of-contents');
    const overlay = document.querySelector('.toc-overlay');
    
    if (toc) {
        toc.classList.remove('open');
        console.log('✅ Removed "open" class from TOC');
    }
    if (overlay) {
        overlay.classList.remove('active');
        console.log('✅ Removed "active" class from overlay');
    }
    document.body.style.overflow = '';
    console.log('✅ Modal closed');
}