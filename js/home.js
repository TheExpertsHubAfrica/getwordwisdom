/**
 * Home page functionality
 * Handles featured posts display
 */

document.addEventListener('DOMContentLoaded', async () => {
    await loadFeaturedPosts();
});

/**
 * Load and display featured posts
 */
async function loadFeaturedPosts() {
    const container = document.getElementById('featured-posts-container');
    const errorDiv = document.getElementById('featured-error');
    const noFeaturedDiv = document.getElementById('no-featured');

    try {
        // Show loading state
        container.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;

        // Fetch featured posts
        const response = await API.getFeaturedPosts();
        const posts = response.posts || [];

        // Hide error messages
        errorDiv.style.display = 'none';
        noFeaturedDiv.style.display = 'none';

        if (posts.length === 0) {
            noFeaturedDiv.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        // Render featured posts
        container.innerHTML = posts.map(post => createFeaturedCard(post)).join('');

        // Add click handlers
        posts.forEach((post, index) => {
            const card = container.children[index];
            if (card) {
                card.addEventListener('click', () => {
                    window.location.href = `/blog/post.html?slug=${post.slug}`;
                });
                
                // Make card keyboard accessible
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'article');
                card.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        window.location.href = `/blog/post.html?slug=${post.slug}`;
                    }
                });
            }
        });

    } catch (error) {
        console.error('Error loading featured posts:', error);
        errorDiv.querySelector('p').textContent = 'We encountered an issue while loading featured articles. Please try refreshing the page.';
        errorDiv.style.display = 'block';
        container.innerHTML = '';
    }
}

/**
 * Create a featured post card HTML
 * @param {object} post - Post data
 * @returns {string} - HTML string
 */
function createFeaturedCard(post) {
    const imageUrl = post.featuredImage || CONFIG.DEFAULT_IMAGE;
    const excerpt = Utils.generateExcerpt(post.content, 120);
    const date = Utils.formatDate(post.createdDate);

    return `
        <article class="featured-card">
            <img 
                src="${imageUrl}" 
                alt="${Utils.escapeHtml(post.title)}"
                class="featured-card-image"
                onerror="this.src='${CONFIG.DEFAULT_IMAGE}'"
            >
            <div class="featured-card-content">
                <div class="featured-card-meta">
                    <span class="featured-card-category">${Utils.escapeHtml(post.category)}</span>
                    <span class="featured-card-date">${date}</span>
                </div>
                <h3 class="featured-card-title">${Utils.escapeHtml(post.title)}</h3>
                <p class="featured-card-excerpt">${Utils.escapeHtml(excerpt)}</p>
            </div>
        </article>
    `;
}
