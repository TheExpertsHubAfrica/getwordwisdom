/**
 * Admin dashboard functionality
 * Handles post and subscriber management
 */

let adminToken = null;
let currentSection = 'posts';
let allPosts = [];
let allSubscribers = [];
let currentEditingPost = null;
let deleteTarget = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeAdmin();
});

/**
 * Initialize admin dashboard
 */
async function initializeAdmin() {
    // Check authentication
    adminToken = sessionStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
    
    if (!adminToken) {
        window.location.href = '/admin/login.html';
        return;
    }

    try {
        // Verify session
        const response = await API.verifyAdminSession(adminToken);
        document.getElementById('admin-email').textContent = response.email;
    } catch (error) {
        console.error('Session verification failed:', error);
        logout();
        return;
    }

    // Initialize UI
    initializeSidebarNavigation();
    initializeLogout();
    initializePostEditor();
    initializeDeleteModal();

    // Load initial data
    await loadPosts();
}

/**
 * Initialize sidebar navigation
 */
function initializeSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            if (section) {
                switchSection(section);
            }
        });
    });
}

/**
 * Switch between sections
 * @param {string} section - Section name
 */
async function switchSection(section) {
    if (!section) return;
    
    currentSection = section;

    // Update navigation
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === section) {
            link.classList.add('active');
        }
    });

    // Update sections
    document.querySelectorAll('.admin-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const sectionElement = document.getElementById(`${section}-section`);
    if (sectionElement) {
        sectionElement.classList.add('active');
    }

    // Update page title
    const titles = {
        'posts': 'Posts Management',
        'subscribers': 'Subscribers Management'
    };
    const pageTitleElement = document.getElementById('page-title');
    if (pageTitleElement) {
        pageTitleElement.textContent = titles[section] || section;
    }

    // Load section data
    if (section === 'posts') {
        await loadPosts();
    } else if (section === 'subscribers') {
        await loadSubscribers();
    }
}

/**
 * Initialize logout
 */
function initializeLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
}

/**
 * Logout admin
 */
function logout() {
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_TOKEN);
    sessionStorage.removeItem(CONFIG.STORAGE_KEYS.ADMIN_EMAIL);
    window.location.href = '/admin/login.html';
}

/**
 * Load all posts
 */
async function loadPosts() {
    const tbody = document.getElementById('posts-table-body');
    
    try {
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Loading posts...</td></tr>';

        const response = await API.adminGetAllPosts(adminToken);
        allPosts = response.posts || [];

        if (allPosts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading-row">No posts yet. Create your first post!</td></tr>';
            return;
        }

        // Render posts
        tbody.innerHTML = allPosts.map(post => createPostRow(post)).join('');

        // Add event listeners
        addPostRowListeners();

    } catch (error) {
        console.error('Error loading posts:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="loading-row">Error loading posts. Please refresh.</td></tr>';
    }
}

/**
 * Create post table row HTML
 * @param {object} post - Post data
 * @returns {string} - HTML string
 */
function createPostRow(post) {
    const date = Utils.formatDate(post.createdDate);
    const statusClass = post.status === 'published' ? 'published' : 'draft';
    const featuredIcon = post.isFeatured ? `
        <span class="featured-badge" title="Featured">
            <svg viewBox="0 0 24 24" fill="currentColor">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
        </span>
    ` : '';

    return `
        <tr data-post-id="${post.id}">
            <td>${Utils.escapeHtml(post.title)}</td>
            <td>${Utils.escapeHtml(post.category)}</td>
            <td>${Utils.escapeHtml(post.author)}</td>
            <td><span class="status-badge ${statusClass}">${post.status}</span></td>
            <td>${featuredIcon}</td>
            <td>${date}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon edit" data-action="edit" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="btn-icon delete" data-action="delete" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Add event listeners to post row buttons
 */
function addPostRowListeners() {
    document.querySelectorAll('[data-action="edit"]').forEach(btn => {
        btn.addEventListener('click', handleEditPost);
    });

    document.querySelectorAll('[data-action="delete"]').forEach(btn => {
        btn.addEventListener('click', handleDeletePost);
    });
}

/**
 * Handle edit post
 * @param {Event} event - Click event
 */
function handleEditPost(event) {
    const postId = event.currentTarget.closest('tr').getAttribute('data-post-id');
    const post = allPosts.find(p => p.id === postId);
    
    if (post) {
        openPostEditor(post);
    }
}

/**
 * Handle delete post
 * @param {Event} event - Click event
 */
function handleDeletePost(event) {
    const postId = event.currentTarget.closest('tr').getAttribute('data-post-id');
    const post = allPosts.find(p => p.id === postId);
    
    if (post) {
        deleteTarget = { type: 'post', id: postId, name: post.title };
        openDeleteModal();
    }
}

/**
 * Load all subscribers
 */
async function loadSubscribers() {
    const tbody = document.getElementById('subscribers-table-body');
    
    try {
        tbody.innerHTML = '<tr><td colspan="4" class="loading-row">Loading subscribers...</td></tr>';

        const response = await API.adminGetSubscribers(adminToken);
        allSubscribers = response.subscribers || [];

        // Update stats
        const total = allSubscribers.length;
        const active = allSubscribers.filter(s => s.status === 'active').length;
        document.getElementById('total-subscribers').textContent = total;
        document.getElementById('active-subscribers').textContent = active;

        if (allSubscribers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="loading-row">No subscribers yet.</td></tr>';
            return;
        }

        // Render subscribers
        tbody.innerHTML = allSubscribers.map(subscriber => createSubscriberRow(subscriber)).join('');

        // Add event listeners
        addSubscriberRowListeners();

    } catch (error) {
        console.error('Error loading subscribers:', error);
        tbody.innerHTML = '<tr><td colspan="4" class="loading-row">Error loading subscribers. Please refresh.</td></tr>';
    }
}

/**
 * Create subscriber table row HTML
 * @param {object} subscriber - Subscriber data
 * @returns {string} - HTML string
 */
function createSubscriberRow(subscriber) {
    const date = Utils.formatDate(subscriber.dateSubscribed);
    const statusClass = subscriber.status === 'active' ? 'active' : 'inactive';
    const actionText = subscriber.status === 'active' ? 'Deactivate' : 'Activate';

    return `
        <tr data-subscriber-id="${subscriber.id}">
            <td>${Utils.escapeHtml(subscriber.email)}</td>
            <td><span class="status-badge ${statusClass}">${subscriber.status}</span></td>
            <td>${date}</td>
            <td>
                <button class="btn btn-secondary btn-sm" data-action="toggle-status">
                    ${actionText}
                </button>
            </td>
        </tr>
    `;
}

/**
 * Add event listeners to subscriber row buttons
 */
function addSubscriberRowListeners() {
    document.querySelectorAll('[data-action="toggle-status"]').forEach(btn => {
        btn.addEventListener('click', handleToggleSubscriber);
    });
}

/**
 * Handle toggle subscriber status
 * @param {Event} event - Click event
 */
async function handleToggleSubscriber(event) {
    const btn = event.currentTarget;
    const subscriberId = btn.closest('tr').getAttribute('data-subscriber-id');
    const subscriber = allSubscribers.find(s => s.id === subscriberId);
    
    if (!subscriber) return;

    const newStatus = subscriber.status === 'active' ? 'inactive' : 'active';
    
    try {
        btn.disabled = true;
        await API.adminToggleSubscriber(adminToken, subscriberId, newStatus);
        await loadSubscribers();
    } catch (error) {
        console.error('Error toggling subscriber:', error);
        alert('Failed to update subscriber status');
    } finally {
        btn.disabled = false;
    }
}

/**
 * Initialize post editor
 */
function initializePostEditor() {
    const createBtn = document.getElementById('create-post-btn');
    const closeBtn = document.getElementById('close-editor');
    const cancelBtn = document.getElementById('cancel-editor');
    const form = document.getElementById('post-editor-form');
    const titleInput = document.getElementById('post-title');
    const slugInput = document.getElementById('post-slug');

    if (createBtn) {
        createBtn.addEventListener('click', () => openPostEditor());
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closePostEditor);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closePostEditor);
    }

    if (form) {
        form.addEventListener('submit', handleSavePost);
    }

    // Auto-generate slug from title
    if (titleInput && slugInput) {
        titleInput.addEventListener('input', Utils.debounce(() => {
            if (!currentEditingPost) {
                slugInput.value = Utils.slugify(titleInput.value);
            }
        }, 300));
    }

    // Handle image upload
    const imageInput = document.getElementById('post-image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageSelect);
    }
}

/**
 * Open post editor modal
 * @param {object} post - Post data for editing (null for new post)
 */
function openPostEditor(post = null) {
    const modal = document.getElementById('post-editor-modal');
    const form = document.getElementById('post-editor-form');
    const title = document.getElementById('editor-title');

    currentEditingPost = post;

    // Reset form
    form.reset();
    document.getElementById('editor-error').style.display = 'none';
    document.getElementById('current-image').style.display = 'none';

    if (post) {
        // Edit mode
        title.textContent = 'Edit Post';
        document.getElementById('post-id').value = post.id;
        document.getElementById('post-title').value = post.title;
        document.getElementById('post-slug').value = post.slug;
        document.getElementById('post-category').value = post.category;
        document.getElementById('post-author').value = post.author;
        document.getElementById('post-content').value = post.content;
        document.getElementById('post-status').value = post.status;
        document.getElementById('post-featured').checked = post.isFeatured === 'TRUE';

        // Show current image if exists
        if (post.featuredImage) {
            document.getElementById('current-image').style.display = 'block';
            document.getElementById('current-image-name').textContent = 'Current image';
            document.getElementById('current-image-preview').src = post.featuredImage;
        }
    } else {
        // Create mode
        title.textContent = 'Create New Post';
        document.getElementById('post-id').value = ''; // Ensure ID is empty for new posts
        // Set default author from session storage or use 'Admin'
        const adminEmail = sessionStorage.getItem(CONFIG.STORAGE_KEYS.ADMIN_EMAIL) || 'Admin';
        document.getElementById('post-author').value = adminEmail;
    }

    modal.classList.add('active');
}

/**
 * Close post editor modal
 */
function closePostEditor() {
    const modal = document.getElementById('post-editor-modal');
    modal.classList.remove('active');
    currentEditingPost = null;
}

/**
 * Handle image selection
 * @param {Event} event - Change event
 */
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('current-image').style.display = 'block';
            document.getElementById('current-image-name').textContent = file.name;
            document.getElementById('current-image-preview').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

/**
 * Handle save post
 * @param {Event} event - Submit event
 */
async function handleSavePost(event) {
    event.preventDefault();

    const errorDiv = document.getElementById('editor-error');
    const errorText = document.getElementById('editor-error-text');

    errorDiv.style.display = 'none';

    // Get form data
    const postData = {
        id: document.getElementById('post-id').value.trim() || '', // Trim and default to empty string
        title: document.getElementById('post-title').value.trim(),
        slug: document.getElementById('post-slug').value.trim(),
        category: document.getElementById('post-category').value,
        author: document.getElementById('post-author').value.trim(),
        content: document.getElementById('post-content').value.trim(),
        status: document.getElementById('post-status').value,
        isFeatured: document.getElementById('post-featured').checked ? 'TRUE' : 'FALSE',
        featuredImage: currentEditingPost?.featuredImage || ''
    };
    
    // If id is empty, set to null so backend creates new post
    if (!postData.id) {
        postData.id = null;
    }

    // Validate required fields
    if (!postData.title || !postData.slug || !postData.category || !postData.author || !postData.content) {
        errorText.textContent = 'Please fill in all required fields';
        errorDiv.style.display = 'block';
        return;
    }

    // Show loading state
    Utils.setButtonLoading('save-post-btn', true);

    try {
        // Handle image upload if new image selected
        const imageInput = document.getElementById('post-image');
        if (imageInput.files.length > 0) {
            const file = imageInput.files[0];
            
            // Show upload progress
            document.getElementById('image-upload-progress').style.display = 'block';
            
            const base64Data = await Utils.fileToBase64(file);
            const uploadResponse = await API.adminUploadImage(adminToken, base64Data, file.name);
            postData.featuredImage = uploadResponse.imageUrl;
            
            document.getElementById('image-upload-progress').style.display = 'none';
        }

        // Save post
        await API.adminSavePost(adminToken, postData);

        // Close modal and reload posts
        closePostEditor();
        await loadPosts();

    } catch (error) {
        console.error('Error saving post:', error);
        errorText.textContent = error.message || 'Failed to save post';
        errorDiv.style.display = 'block';
    } finally {
        Utils.setButtonLoading('save-post-btn', false);
    }
}

/**
 * Initialize delete modal
 */
function initializeDeleteModal() {
    const closeBtn = document.getElementById('close-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');

    if (closeBtn) {
        closeBtn.addEventListener('click', closeDeleteModal);
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeDeleteModal);
    }

    if (confirmBtn) {
        confirmBtn.addEventListener('click', handleConfirmDelete);
    }
}

/**
 * Open delete confirmation modal
 */
function openDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const message = document.getElementById('delete-message');

    if (deleteTarget) {
        message.textContent = `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`;
    }

    modal.classList.add('active');
}

/**
 * Close delete modal
 */
function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    modal.classList.remove('active');
    deleteTarget = null;
}

/**
 * Handle confirm delete
 */
async function handleConfirmDelete() {
    if (!deleteTarget) return;

    Utils.setButtonLoading('confirm-delete', true);

    try {
        if (deleteTarget.type === 'post') {
            await API.adminDeletePost(adminToken, deleteTarget.id);
            await loadPosts();
        }

        closeDeleteModal();

    } catch (error) {
        console.error('Error deleting:', error);
        alert('Failed to delete. Please try again.');
    } finally {
        Utils.setButtonLoading('confirm-delete', false);
    }
}
