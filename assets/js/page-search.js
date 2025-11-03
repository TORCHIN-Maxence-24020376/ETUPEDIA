
/**
 * Recherche dans le contenu de la page actuelle
 */

function searchInCurrentPage(query) {
    const main = document.querySelector('main');
    if (!main) return [];

    const results = [];
    const queryLower = query.toLowerCase();

    // Rechercher dans les titres
    const headings = main.querySelectorAll('h2, h3, h4');
    headings.forEach(heading => {
        const text = heading.textContent;
        if (text.toLowerCase().includes(queryLower)) {
            results.push({
                type: 'heading',
                title: text,
                element: heading,
                preview: text
            });
        }
    });

    // Rechercher dans les paragraphes
    const paragraphs = main.querySelectorAll('p');
    paragraphs.forEach(paragraph => {
        const text = paragraph.textContent;
        const textLower = text.toLowerCase();

        if (textLower.includes(queryLower)) {
            let parentHeading = findClosestHeading(paragraph);
            let title = parentHeading ? parentHeading.textContent : 'Contenu';

            const index = textLower.indexOf(queryLower);
            const start = Math.max(0, index - 50);
            const end = Math.min(text.length, index + query.length + 50);
            let preview = text.substring(start, end);

            if (start > 0) preview = '...' + preview;
            if (end < text.length) preview = preview + '...';

            results.push({
                type: 'paragraph',
                title: title,
                element: paragraph,
                preview: preview
            });
        }
    });

    // Rechercher dans le code
    const codeBlocks = main.querySelectorAll('code');
    codeBlocks.forEach(code => {
        const text = code.textContent;
        if (text.toLowerCase().includes(queryLower)) {
            let parentHeading = findClosestHeading(code);
            let title = parentHeading ? parentHeading.textContent : 'Code';

            results.push({
                type: 'code',
                title: title,
                element: code,
                preview: text.substring(0, 100) + (text.length > 100 ? '...' : '')
            });
        }
    });

    return results;
}

function findClosestHeading(element) {
    let current = element.previousElementSibling;

    while (current) {
        if (current.matches('h2, h3, h4')) {
            return current;
        }
        current = current.previousElementSibling;
    }

    return null;
}

function scrollToElement(element) {
    let targetElement = element;

    if (element.tagName === 'P' || element.tagName === 'CODE') {
        const heading = findClosestHeading(element);
        if (heading) {
            targetElement = heading;
        }
    }

    targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });

    targetElement.style.transition = 'background-color 0.3s ease';
    const originalBg = targetElement.style.backgroundColor;
    targetElement.style.backgroundColor = 'var(--item-hover-bg)';

    setTimeout(() => {
        targetElement.style.backgroundColor = originalBg;
    }, 2000);
}