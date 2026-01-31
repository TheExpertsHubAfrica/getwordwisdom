/**
 * Blog page functionality
 * Handles post listing, filtering, and pagination
 */

let currentPage = 1;
let currentCategory = '';

document.addEventListener('DOMContentLoaded', () => {
    initializeBlogPage();
});

/**
 * Initialize blog page
 */
function initializeBlogPage() {
    // Set up category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', handleCategoryChange);
    }

    // Check for category in URL
    const urlCategory = Utils.getUrlParameter('category');
    if (urlCategory) {
        currentCategory = urlCategory;
        if (categoryFilter) {
            categoryFilter.value = urlCategory;
        }
    }

    // Load posts
    loadPosts();
}

/**
 * Handle category filter change
 * @param {Event} event - Change event
 */
function handleCategoryChange(event) {
    currentCategory = event.target.value;
    currentPage = 1;
    loadPosts();
}

/**
 * Load and display posts
 */
async function loadPosts() {
    const container = document.getElementById('posts-container');
    const errorDiv = document.getElementById('posts-error');
    const noPostsDiv = document.getElementById('no-posts');
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

        // Fetch posts
        const response = await API.getPosts(currentPage, currentCategory);
        const posts = response.posts || [];
        const totalPages = response.totalPages || 1;

        // Hide error messages
        errorDiv.style.display = 'none';
        noPostsDiv.style.display = 'none';

        if (posts.length === 0) {
            noPostsDiv.style.display = 'block';
            container.innerHTML = '';
            paginationDiv.innerHTML = '';
            return;
        }

        // Render posts
        container.innerHTML = posts.map(post => createPostCard(post)).join('');

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
        console.error('Error loading posts:', error);
        errorDiv.querySelector('p').textContent = "We're experiencing difficulty loading articles at the moment. Please refresh the page or try again shortly.";
        errorDiv.style.display = 'block';
        container.innerHTML = '';
        paginationDiv.innerHTML = '';
    }
}

/**
 * Create a post card HTML
 * @param {object} post - Post data
 * @returns {string} - HTML string
 */
function createPostCard(post) {
    const imageUrl = post.featuredImage || CONFIG.DEFAULT_IMAGE;
    const excerpt = Utils.generateExcerpt(post.content, 150);
    const date = Utils.formatDate(post.createdDate);

    return `
        <article class="post-card">
            <img 
                src="${imageUrl}" 
                alt="${Utils.escapeHtml(post.title)}"
                class="post-card-image"
                onerror="this.src='${CONFIG.DEFAULT_IMAGE}'"
            >
            <div class="post-card-content">
                <div class="post-card-meta">
                    <span class="post-card-category">${Utils.escapeHtml(post.category)}</span>
                    <span class="post-card-date">${date}</span>
                </div>
                <h3 class="post-card-title">${Utils.escapeHtml(post.title)}</h3>
                <p class="post-card-excerpt">${Utils.escapeHtml(excerpt)}</p>
                <p class="post-card-author">By ${Utils.escapeHtml(post.author)}</p>
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
    loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make changePage available globally
window.changePage = changePage;
