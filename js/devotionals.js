/**
 * Devotionals page functionality
 * Handles devotionals display with pagination
 */

let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    loadDevotionals();
});

/**
 * Load and display devotionals
 */
async function loadDevotionals() {
    const container = document.getElementById('devotionals-container');
    const errorDiv = document.getElementById('devotionals-error');
    const noDevotionalsDiv = document.getElementById('no-devotionals');
    const paginationDiv = document.getElementById('pagination');

    try {
        // Show loading state
        container.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;

        // Fetch devotionals (posts in Devotionals category)
        const response = await API.getPostsByCategory('Devotionals', currentPage);
        const posts = response.posts || [];
        const totalPages = response.totalPages || 1;

        // Hide error messages
        errorDiv.style.display = 'none';
        noDevotionalsDiv.style.display = 'none';

        if (posts.length === 0) {
            noDevotionalsDiv.style.display = 'block';
            container.innerHTML = '';
            paginationDiv.innerHTML = '';
            return;
        }

        // Render devotionals
        container.innerHTML = posts.map(post => createDevotionalCard(post)).join('');

        // Add click handlers
        posts.forEach((post, index) => {
            const card = container.children[index];
            if (card) {
                card.addEventListener('click', () => {
                    window.location.href = `/blog/post.html?slug=${post.slug}`;
                });
            }
        });

        // Render pagination
        renderPagination(totalPages);

    } catch (error) {
        console.error('Error loading devotionals:', error);
        errorDiv.style.display = 'block';
        container.innerHTML = '';
        paginationDiv.innerHTML = '';
    }
}

/**
 * Create a devotional card HTML
 * @param {object} post - Post data
 * @returns {string} - HTML string
 */
function createDevotionalCard(post) {
    const imageUrl = post.featuredImage || CONFIG.DEFAULT_IMAGE;
    const excerpt = Utils.generateExcerpt(post.content, 120);
    const date = Utils.formatDate(post.createdDate);

    return `
        <article class="devotional-card">
            <img 
                src="${imageUrl}" 
                alt="${Utils.escapeHtml(post.title)}"
                class="devotional-card-image"
                onerror="this.src='${CONFIG.DEFAULT_IMAGE}'"
            >
            <div class="devotional-card-content">
                <div class="devotional-card-date">${date}</div>
                <h3 class="devotional-card-title">${Utils.escapeHtml(post.title)}</h3>
                <p class="devotional-card-excerpt">${Utils.escapeHtml(excerpt)}</p>
            </div>
        </article>
    `;
}

/**
 * Render pagination controls
 * @param {number} totalPages - Total number of pages
 */
function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button 
            class="pagination-btn" 
            ${currentPage === 1 ? 'disabled' : ''}
            onclick="changePage(${currentPage - 1})"
        >
            Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `
                <button 
                    class="pagination-btn ${i === currentPage ? 'active' : ''}"
                    onclick="changePage(${i})"
                >
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-info">...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button 
            class="pagination-btn"
            ${currentPage === totalPages ? 'disabled' : ''}
            onclick="changePage(${currentPage + 1})"
        >
            Next
        </button>
    `;

    paginationDiv.innerHTML = paginationHTML;
}

/**
 * Change page
 * @param {number} page - Page number
 */
function changePage(page) {
    currentPage = page;
    loadDevotionals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make changePage available globally
window.changePage = changePage;
