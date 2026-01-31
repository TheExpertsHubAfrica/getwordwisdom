/**
 * Single post page functionality
 * Handles post display and sharing
 */

document.addEventListener('DOMContentLoaded', () => {
    loadPost();
    initializeShareButtons();
});

/**
 * Load and display single post
 */
async function loadPost() {
    const slug = Utils.getUrlParameter('slug');
    
    if (!slug) {
        showError();
        return;
    }

    const loadingDiv = document.getElementById('post-loading');
    const errorDiv = document.getElementById('post-error');
    const contentDiv = document.getElementById('post-content');

    try {
        // Show loading state
        loadingDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        contentDiv.style.display = 'none';

        // Fetch post
        const response = await API.getPostBySlug(slug);
        const post = response.post;

        if (!post) {
            showError();
            return;
        }

        // Update meta tags
        updateMetaTags(post);

        // Populate post content
        document.getElementById('post-category').textContent = post.category;
        document.getElementById('post-date').textContent = Utils.formatDate(post.createdDate);
        document.getElementById('post-title').textContent = post.title;
        document.getElementById('post-author').textContent = `By ${post.author}`;
        document.getElementById('post-body-content').innerHTML = post.content;

        // Handle featured image
        if (post.featuredImage) {
            const imageContainer = document.getElementById('post-image-container');
            const imageElement = document.getElementById('post-image');
            imageElement.src = post.featuredImage;
            imageElement.alt = post.title;
            imageContainer.style.display = 'block';
        }

        // Show content
        loadingDiv.style.display = 'none';
        contentDiv.style.display = 'block';

    } catch (error) {
        console.error('Error loading post:', error);
        showError();
    }
}

/**
 * Show error message
 */
function showError() {
    document.getElementById('post-loading').style.display = 'none';
    document.getElementById('post-error').style.display = 'block';
    document.getElementById('post-content').style.display = 'none';
}

/**
 * Update meta tags for SEO and social sharing
 * @param {object} post - Post data
 */
function updateMetaTags(post) {
    document.title = `${post.title} - GetWordWisdom`;
    
    const excerpt = Utils.generateExcerpt(post.content, 160);
    
    // Update description meta tag
    let descMeta = document.querySelector('meta[name="description"]');
    if (descMeta) {
        descMeta.content = excerpt;
    }

    // Update Open Graph meta tags
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
        ogTitle.content = post.title;
    }

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
        ogDesc.content = excerpt;
    }

    if (post.featuredImage) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.content = post.featuredImage;
        }
    }
}

/**
 * Initialize share buttons
 */
function initializeShareButtons() {
    const shareButtons = {
        twitter: document.getElementById('share-twitter'),
        facebook: document.getElementById('share-facebook'),
        linkedin: document.getElementById('share-linkedin'),
        copy: document.getElementById('share-copy')
    };

    const currentUrl = window.location.href;
    const title = document.getElementById('post-title')?.textContent || 'GetWordWisdom';

    if (shareButtons.twitter) {
        shareButtons.twitter.addEventListener('click', () => {
            const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(title)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        });
    }

    if (shareButtons.facebook) {
        shareButtons.facebook.addEventListener('click', () => {
            const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
            window.open(facebookUrl, '_blank', 'width=600,height=400');
        });
    }

    if (shareButtons.linkedin) {
        shareButtons.linkedin.addEventListener('click', () => {
            const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;
            window.open(linkedinUrl, '_blank', 'width=600,height=400');
        });
    }

    if (shareButtons.copy) {
        shareButtons.copy.addEventListener('click', async () => {
            const success = await Utils.copyToClipboard(currentUrl);
            if (success) {
                const originalText = shareButtons.copy.querySelector('span').textContent;
                shareButtons.copy.querySelector('span').textContent = 'Copied!';
                setTimeout(() => {
                    shareButtons.copy.querySelector('span').textContent = originalText;
                }, 2000);
            }
        });
    }
}
