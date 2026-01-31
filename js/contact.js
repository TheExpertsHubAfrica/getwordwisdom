/**
 * Contact page functionality
 * Handles contact form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeContactForm();
});

/**
 * Initialize contact form
 */
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    
    if (form) {
        form.addEventListener('submit', handleContactSubmit);
    }

    // Real-time validation
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
 * Handle contact form submission
 * @param {Event} event - Submit event
 */
async function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const subjectInput = document.getElementById('subject');
    const messageInput = document.getElementById('message');
    const errorDiv = document.getElementById('form-error');
    const successDiv = document.getElementById('form-success');
    const errorText = document.getElementById('error-text');

    // Hide previous messages
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Clear all error messages
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');

    // Validate email
    if (!validateEmailInput()) {
        return;
    }

    // Get form data
    const formData = {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim()
    };

    // Validate required fields
    let hasError = false;

    if (!formData.name) {
        document.getElementById('name-error').textContent = 'Name is required';
        hasError = true;
    }

    if (!formData.email) {
        document.getElementById('email-error').textContent = 'Email is required';
        hasError = true;
    }

    if (!formData.subject) {
        document.getElementById('subject-error').textContent = 'Subject is required';
        hasError = true;
    }

    if (!formData.message) {
        document.getElementById('message-error').textContent = 'Message is required';
        hasError = true;
    }

    if (hasError) {
        return;
    }

    // Show loading state
    Utils.setButtonLoading('submit-btn', true);

    try {
        // Submit contact form
        await API.submitContact(formData);

        // Show success message
        successDiv.style.display = 'flex';
        form.reset();

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (error) {
        console.error('Contact form error:', error);
        errorText.textContent = error.message || 'Failed to send message. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        Utils.setButtonLoading('submit-btn', false);
    }
}
