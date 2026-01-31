/**
 * Categories page functionality
 * Handles category display and post counts
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeCategories();
});

/**
 * Initialize categories page
 */
async function initializeCategories() {
    // Add click handlers to category cards
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        card.addEventListener('click', () => {
            window.location.href = `/blog/?category=${encodeURIComponent(category)}`;
        });

        // Make card keyboard accessible
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'link');
        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = `/blog/?category=${encodeURIComponent(category)}`;
            }
        });
    });

    // Load post counts
    await loadCategoryCounts();
}

/**
 * Load and display category post counts
 */
async function loadCategoryCounts() {
    try {
        const response = await API.getCategoryCounts();
        const counts = response.counts || {};

        // Update each category's post count
        CONFIG.CATEGORIES.forEach(category => {
            const countElement = document.querySelector(`[data-category="${category}"] .post-count`);
            if (countElement) {
                const count = counts[category] || 0;
                countElement.textContent = `${count} ${count === 1 ? 'post' : 'posts'}`;
            }
        });
    } catch (error) {
        console.error('Error loading category counts:', error);
        // Show default message on error
        document.querySelectorAll('.post-count').forEach(el => {
            el.textContent = 'View posts';
        });
    }
}
