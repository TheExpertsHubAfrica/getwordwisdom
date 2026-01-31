/**
 * Admin login functionality
 * Handles admin authentication
 */

document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    checkExistingSession();
    
    // Initialize login form
    initializeLoginForm();
});

/**
 * Check for existing admin session
 */
async function checkExistingSession() {
    const token = sessionStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
    
    if (token) {
        try {
            await API.verifyAdminSession(token);
            // Redirect to dashboard if valid
            window.location.href = '/admin/';
        } catch (error) {
            // Clear invalid session
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
            sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_EMAIL);
        }
    }
}

/**
 * Initialize login form
 */
function initializeLoginForm() {
    const form = document.getElementById('login-form');
    
    if (form) {
        form.addEventListener('submit', handleLoginSubmit);
    }
}

/**
 * Handle login form submission
 * @param {Event} event - Submit event
 */
async function handleLoginSubmit(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorDiv = document.getElementById('form-error');
    const errorText = document.getElementById('error-text');

    // Hide previous errors
    errorDiv.style.display = 'none';

    // Clear field errors
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');

    // Get form data
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate required fields
    let hasError = false;

    if (!email) {
        document.getElementById('email-error').textContent = 'Email is required';
        hasError = true;
    } else if (!Utils.validateEmail(email)) {
        document.getElementById('email-error').textContent = 'Invalid email format';
        hasError = true;
    }

    if (!password) {
        document.getElementById('password-error').textContent = 'Password is required';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Show loading state
    Utils.setButtonLoading('submit-btn', true);

    try {
        // Attempt login
        const response = await API.adminLogin(email, password);

        // Store session
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN, response.token);
        sessionStorage.setItem(CONFIG.STORAGE_KEYS.ADMIN_EMAIL, response.email);

        // Redirect to dashboard
        window.location.href = '/admin/';

    } catch (error) {
        console.error('Login error:', error);
        const errorMsg = error.message === 'Invalid credentials' 
            ? 'The email or password you entered is incorrect. Please try again.' 
            : 'We couldn\'t log you in right now. Please check your connection and try again.';
        errorText.textContent = errorMsg;
        errorDiv.style.display = 'block';
    } finally {
        Utils.setButtonLoading('submit-btn', false);
    }
}
