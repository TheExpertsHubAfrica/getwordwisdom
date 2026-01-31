/**
 * Subscribe page functionality
 * Handles newsletter subscription form
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeSubscribeForm();
});

/**
 * Initialize subscribe form
 */
function initializeSubscribeForm() {
    const form = document.getElementById('subscribe-form');
    
    if (form) {
        form.addEventListener('submit', handleSubscribeSubmit);
    }

    // Real-time email validation
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmailInput);
    }
}

/**
 * Validate email input
 */
function validateEmailInput() {
    const emailInput = document.getElementById('email');
    const errorSpan = document.getElementById('email-error');
    
    if (!emailInput.value) {
        errorSpan.textContent = '';
        return true;
    }

    if (!Utils.validateEmail(emailInput.value)) {
        errorSpan.textContent = 'Please enter a valid email address';
        return false;
    }

    errorSpan.textContent = '';
    return true;
}

/**
 * Handle subscribe form submission
 * @param {Event} event - Submit event
 */
async function handleSubscribeSubmit(event) {
    event.preventDefault();

    const emailInput = document.getElementById('email');
    const errorDiv = document.getElementById('form-error');
    const successDiv = document.getElementById('form-success');
    const errorText = document.getElementById('error-text');

    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Validate email
    if (!validateEmailInput()) {
        return;
    }

    const email = emailInput.value.trim();

    // Validate required field
    if (!email) {
        errorText.textContent = 'Please enter your email address';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loading state
    Utils.setButtonLoading('submit-btn', true);

    try {
        // Submit subscription
        await API.subscribe(email);

        // Show success message
        successDiv.style.display = 'flex';
        emailInput.value = '';

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('Subscription error:', error);
        errorText.textContent = error.message || 'Failed to subscribe. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        Utils.setButtonLoading('submit-btn', false);
    }
}
