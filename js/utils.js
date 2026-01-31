/**
 * Utility functions for GetWordWisdom
 */

const Utils = {
    /**
     * Format date to readable string
     * @param {string} dateString - Date string
     * @returns {string} - Formatted date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    /**
     * Create a URL-friendly slug from text
     * @param {string} text - Text to slugify
     * @returns {string} - Slug
     */
    slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    /**
     * Generate excerpt from content
     * @param {string} content - Full content
     * @param {number} maxLength - Maximum length
     * @returns {string} - Excerpt
     */
    generateExcerpt(content, maxLength = 150) {
        // Strip HTML tags
        const text = content.replace(/<[^>]*>/g, '');
        
        if (text.length <= maxLength) {
            return text;
        }
        
        return text.substr(0, maxLength).trim() + '...';
    },

    /**
     * Validate email address
     * @param {string} email - Email address
     * @returns {boolean} - Is valid
     */
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    /**
     * Show/hide element
     * @param {string} elementId - Element ID
     * @param {boolean} show - Show or hide
     */
    toggleElement(elementId, show) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = show ? 'block' : 'none';
        }
    },

    /**
     * Show error message
     * @param {string} elementId - Element ID
     * @param {string} message - Error message
     */
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    /**
     * Hide error message
     * @param {string} elementId - Element ID
     */
    hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    /**
     * Debounce function
     * @param {function} func - Function to debounce
     * @param {number} wait - Wait time in ms
     * @returns {function} - Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Get URL parameter
     * @param {string} param - Parameter name
     * @returns {string|null} - Parameter value
     */
    getUrlParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Convert file to base64
     * @param {File} file - File object
     * @returns {Promise<string>} - Base64 string
     */
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    },

    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<void>}
     */
    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Failed to copy:', err);
            return false;
        }
    },

    /**
     * Escape HTML to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Set current year in footer
     */
    setCurrentYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    },

    /**
     * Initialize mobile menu toggle
     */
    initMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.querySelector('.nav-menu');
        
        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.remove('active');
                }
            });
        }
    },

    /**
     * Smooth scroll to element
     * @param {string} elementId - Element ID
     */
    scrollToElement(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },

    /**
     * Show loading state on button
     * @param {string} buttonId - Button ID
     * @param {boolean} loading - Loading state
     */
    setButtonLoading(buttonId, loading) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        const textSpan = button.querySelector('[id$="-text"]');
        const loadingSpan = button.querySelector('[id$="-loading"]');

        if (textSpan && loadingSpan) {
            if (loading) {
                button.disabled = true;
                textSpan.style.display = 'none';
                loadingSpan.style.display = 'inline-block';
            } else {
                button.disabled = false;
                textSpan.style.display = 'inline';
                loadingSpan.style.display = 'none';
            }
        }
    }
};

// Initialize common utilities on page load
document.addEventListener('DOMContentLoaded', () => {
    Utils.setCurrentYear();
    Utils.initMobileMenu();
});
