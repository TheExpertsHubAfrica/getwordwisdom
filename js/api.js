/**
 * API module for GetWordWisdom
 * Handles all communication with Google Apps Script backend
 */

const API = {
    /**
     * Make a request to the Google Apps Script backend
     * @param {string} endpoint - The endpoint to call
     * @param {object} data - The data to send
     * @param {string} method - HTTP method (GET or POST)
     * @returns {Promise<object>} - The response data
     */
    async request(endpoint, data = {}, method = 'GET') {
        try {
            // Build URL with query parameters for GET requests
            const params = new URLSearchParams({
                action: endpoint,
                origin: window.location.origin,
                ...data
            });
            
            const url = `${CONFIG.API_URL}?${params.toString()}`;

            // GET requests don't need headers - keep it simple to avoid CORS preflight
            const options = {
                method: 'GET'
            };

            const response = await fetch(url, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    /**
     * Make a POST request (for admin operations and form submissions)
     */
    async postRequest(endpoint, data = {}) {
        try {
            // Remove Content-Type header to avoid CORS preflight
            // Google Apps Script will handle the JSON parsing
            const options = {
                method: 'POST',
                body: JSON.stringify({
                    action: endpoint,
                    origin: window.location.origin,
                    ...data
                })
            };

            const response = await fetch(CONFIG.API_URL, options);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.error) {
                throw new Error(result.error);
            }

            return result;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },

    /**
     * Get all published posts
     * @param {number} page - Page number
     * @param {string} category - Category filter (optional)
     * @returns {Promise<object>} - Posts and pagination data
     */
    async getPosts(page = 1, category = '') {
        return this.request('getPosts', { page, category, perPage: CONFIG.POSTS_PER_PAGE });
    },

    /**
     * Get featured posts
     * @returns {Promise<array>} - Array of featured posts
     */
    async getFeaturedPosts() {
        return this.request('getFeaturedPosts', { limit: CONFIG.FEATURED_POSTS_LIMIT });
    },

    /**
     * Get a single post by slug
     * @param {string} slug - Post slug
     * @returns {Promise<object>} - Post data
     */
    async getPostBySlug(slug) {
        return this.request('getPostBySlug', { slug });
    },

    /**
     * Get posts by category
     * @param {string} category - Category name
     * @param {number} page - Page number
     * @returns {Promise<object>} - Posts and pagination data
     */
    async getPostsByCategory(category, page = 1) {
        return this.request('getPostsByCategory', { category, page, perPage: CONFIG.POSTS_PER_PAGE });
    },

    /**
     * Get post count by category
     * @returns {Promise<object>} - Category counts
     */
    async getCategoryCounts() {
        return this.request('getCategoryCounts');
    },

    /**
     * Subscribe to newsletter
     * @param {string} email - Subscriber email
     * @returns {Promise<object>} - Success message
     */
    async subscribe(email) {
        return this.postRequest('subscribe', { email });
    },

    /**
     * Submit contact form
     * @param {object} formData - Form data {name, email, subject, message}
     * @returns {Promise<object>} - Success message
     */
    async submitContact(formData) {
        return this.postRequest('submitContact', formData);
    },

    /**
     * Admin login
     * @param {string} email - Admin email
     * @param {string} password - Admin password
     * @returns {Promise<object>} - Auth token and user data
     */
    async adminLogin(email, password) {
        return this.postRequest('adminLogin', { email, password });
    },

    /**
     * Verify admin session
     * @param {string} token - Auth token
     * @returns {Promise<object>} - User data
     */
    async verifyAdminSession(token) {
        return this.postRequest('verifyAdminSession', { token });
    },

    /**
     * Get all posts (admin)
     * @param {string} token - Auth token
     * @returns {Promise<array>} - All posts
     */
    async adminGetAllPosts(token) {
        return this.postRequest('adminGetAllPosts', { token });
    },

    /**
     * Create or update a post (admin)
     * @param {string} token - Auth token
     * @param {object} postData - Post data
     * @returns {Promise<object>} - Success message
     */
    async adminSavePost(token, postData) {
        return this.postRequest('adminSavePost', { token, postData });
    },

    /**
     * Delete a post (admin)
     * @param {string} token - Auth token
     * @param {string} postId - Post ID
     * @returns {Promise<object>} - Success message
     */
    async adminDeletePost(token, postId) {
        return this.postRequest('adminDeletePost', { token, postId });
    },

    /**
     * Upload image to Google Drive (admin)
     * @param {string} token - Auth token
     * @param {string} base64Data - Base64 encoded image
     * @param {string} filename - File name
     * @returns {Promise<object>} - Image URL
     */
    async adminUploadImage(token, base64Data, filename) {
        return this.postRequest('adminUploadImage', { token, base64Data, filename });
    },

    /**
     * Get all subscribers (admin)
     * @param {string} token - Auth token
     * @returns {Promise<array>} - All subscribers
     */
    async adminGetSubscribers(token) {
        return this.postRequest('adminGetSubscribers', { token });
    },

    /**
     * Toggle subscriber status (admin)
     * @param {string} token - Auth token
     * @param {string} subscriberId - Subscriber ID
     * @param {string} status - New status (active/inactive)
     * @returns {Promise<object>} - Success message
     */
    async adminToggleSubscriber(token, subscriberId, status) {
        return this.postRequest('adminToggleSubscriber', { token, subscriberId, status });
    },

    /**
     * Get all commentaries (admin)
     * @param {string} token - Auth token
     * @returns {Promise<object>} - All commentaries
     */
    async adminGetAllCommentaries(token) {
        return this.postRequest('adminGetAllCommentaries', { token });
    },

    /**
     * Create or update a commentary (admin)
     * @param {string} token - Auth token
     * @param {object} commentaryData - Commentary data
     * @returns {Promise<object>} - Success message
     */
    async adminSaveCommentary(token, commentaryData) {
        return this.postRequest('adminSaveCommentary', { token, commentaryData });
    },

    /**
     * Delete a commentary (admin)
     * @param {string} token - Auth token
     * @param {string} commentaryId - Commentary ID
     * @returns {Promise<object>} - Success message
     */
    async adminDeleteCommentary(token, commentaryId) {
        return this.postRequest('adminDeleteCommentary', { token, commentaryId });
    },

    /**
     * Get commentaries by book (public)
     * @param {string} book - Bible book slug
     * @returns {Promise<array>} - Commentaries for the book
     */
    async getCommentariesByBook(book) {
        return this.request('getCommentariesByBook', { book });
    },

    /**
     * Get all commentaries grouped by book (public)
     * @returns {Promise<object>} - All commentaries grouped
     */
    async getAllCommentaries() {
        return this.request('getAllCommentaries');
    }
};
