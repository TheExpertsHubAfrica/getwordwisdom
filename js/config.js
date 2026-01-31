/**
 * Configuration file for GetWordWisdom
 * This file contains all configuration settings for the application
 */

const CONFIG = {
    // Google Apps Script Web App URL
    // Replace this with your actual deployed Google Apps Script web app URL
    API_URL: 'https://script.google.com/macros/s/AKfycby9mjiSLArdzb5E7_am0nrXAlyruZ2RVYK9fgDCWDlUbARaNZdkjdRyfUFBSDL9KWYamQ/exec',
    
    // Pagination settings
    POSTS_PER_PAGE: 9,
    
    // Featured posts limit
    FEATURED_POSTS_LIMIT: 5,
    
    // Image settings
    DEFAULT_IMAGE: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=400&fit=crop',
    
    // Categories
    CATEGORIES: [
        'Faith',
        'Devotionals',
        'Christian Living',
        'Teachings',
        'Wisdom'
    ],
    
    // Cache duration (in milliseconds)
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
    
    // Session storage keys
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_admin_token',
        ADMIN_EMAIL: 'gww_admin_email'
    }
};

// Freeze the config object to prevent modifications
Object.freeze(CONFIG);
