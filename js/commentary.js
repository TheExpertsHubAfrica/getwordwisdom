/**
 * Commentary page functionality
 * Handles Bible commentary display with book filtering
 */

let currentBook = null;
let allCommentaries = {};

document.addEventListener('DOMContentLoaded', () => {
    // Check if book parameter is provided in URL
    const urlParams = new URLSearchParams(window.location.search);
    currentBook = urlParams.get('book');
    
    loadCommentary();
});

/**
 * Load and display commentary
 */
async function loadCommentary() {
    const container = document.getElementById('commentary-container');
    const errorDiv = document.getElementById('commentary-error');
    const noCommentaryDiv = document.getElementById('no-commentary');

    try {
        // Show loading state
        container.innerHTML = `
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
        `;

        // Fetch commentaries
        let response;
        if (currentBook) {
            // Fetch commentaries for specific book
            response = await API.getCommentariesByBook(currentBook);
            allCommentaries[currentBook] = response.commentaries || [];
        } else {
            // Fetch all commentaries grouped by book
            response = await API.getAllCommentaries();
            allCommentaries = response.commentaries || {};
        }

        // Hide error messages
        errorDiv.style.display = 'none';
        noCommentaryDiv.style.display = 'none';

        // Check if we have any commentaries
        const totalCommentaries = currentBook 
            ? allCommentaries[currentBook]?.length || 0
            : Object.values(allCommentaries).reduce((sum, arr) => sum + arr.length, 0);

        if (totalCommentaries === 0) {
            noCommentaryDiv.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        // Render commentaries
        if (currentBook) {
            renderBookCommentaries(currentBook);
        } else {
            renderAllCommentaries();
        }

    } catch (error) {
        console.error('Error loading commentary:', error);
        errorDiv.style.display = 'block';
        container.innerHTML = '';
    }
}

/**
 * Render commentaries for a specific book
 */
function renderBookCommentaries(book) {
    const container = document.getElementById('commentary-container');
    const commentaries = allCommentaries[book] || [];
    
    if (commentaries.length === 0) {
        container.innerHTML = '<p class="no-commentaries">No commentaries available for this book yet.</p>';
        return;
    }

    // Add book title
    const bookDisplay = book.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const bookTitleHTML = `<div class="commentary-book-header"><h2>${bookDisplay}</h2></div>`;
    
    // Render commentary cards
    const commentariesHTML = commentaries.map(commentary => createCommentaryCard(commentary)).join('');
    
    container.innerHTML = bookTitleHTML + `<div class="commentary-grid">${commentariesHTML}</div>`;
}

/**
 * Render all commentaries grouped by book
 */
function renderAllCommentaries() {
    const container = document.getElementById('commentary-container');
    
    const booksHTML = Object.keys(allCommentaries)
        .sort()
        .map(book => {
            const commentaries = allCommentaries[book];
            const bookDisplay = book.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            return `
                <div class="commentary-book-section">
                    <h2 class="commentary-book-title">${bookDisplay}</h2>
                    <div class="commentary-grid">
                        ${commentaries.map(commentary => createCommentaryCard(commentary)).join('')}
                    </div>
                </div>
            `;
        }).join('');
    
    container.innerHTML = booksHTML;
}

/**
 * Create a commentary card HTML
 * @param {object} commentary - Commentary data
 * @returns {string} - HTML string
 */
function createCommentaryCard(commentary) {
    const date = Utils.formatDate(commentary.dateWritten);
    const preview = commentary.content.substring(0, 200) + (commentary.content.length > 200 ? '...' : '');
    
    // Format chapter and verse display
    let reference = '';
    if (commentary.chapter) {
        reference = `Chapter ${commentary.chapter}`;
        if (commentary.verse) {
            reference += `:${commentary.verse}`;
        }
    } else if (commentary.verse) {
        reference = `Verse ${commentary.verse}`;
    } else {
        reference = 'Introduction';
    }

    return `
        <article class="commentary-card">
            <div class="commentary-card-header">
                <div class="commentary-reference">${Utils.escapeHtml(reference)}</div>
                <div class="commentary-date">${date}</div>
            </div>
            <div class="commentary-card-content">
                <p class="commentary-text">${Utils.escapeHtml(preview)}</p>
                <button class="btn-read-more" onclick="showCommentaryModal('${commentary.id}')">Read Full Commentary</button>
            </div>
        </article>
    `;
}

/**
 * Show full commentary in modal
 */
function showCommentaryModal(commentaryId) {
    // Find the commentary
    let commentary = null;
    for (const book in allCommentaries) {
        const found = allCommentaries[book].find(c => c.id === commentaryId);
        if (found) {
            commentary = found;
            break;
        }
    }

    if (!commentary) return;

    // Create and show modal
    const modal = document.createElement('div');
    modal.className = 'commentary-modal active';
    modal.innerHTML = `
        <div class="commentary-modal-content">
            <button class="commentary-modal-close" onclick="this.closest('.commentary-modal').remove()">&times;</button>
            <div class="commentary-modal-header">
                <h3>${commentary.book.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <p class="commentary-modal-reference">
                    ${commentary.chapter ? `Chapter ${commentary.chapter}` : ''}
                    ${commentary.verse ? `:${commentary.verse}` : ''}
                </p>
                <p class="commentary-modal-date">${Utils.formatDate(commentary.dateWritten)}</p>
            </div>
            <div class="commentary-modal-body">
                <div class="commentary-full-text">${Utils.escapeHtml(commentary.content).replace(/\n/g, '<br><br>')}</div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

/**
 * Render pagination controls (kept for compatibility, but may not be needed)
 *
 * @param {number} totalPages - Total number of pages
 */
function renderPagination(totalPages) {
    const paginationDiv = document.getElementById('pagination');
    
    if (totalPages <= 1) {
        paginationDiv.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
        <button 
            class="pagination-btn" 
            ${currentPage === 1 ? 'disabled' : ''}
            onclick="changePage(${currentPage - 1})"
        >
            Previous
        </button>
    `;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (
            i === 1 || 
            i === totalPages || 
            (i >= currentPage - 1 && i <= currentPage + 1)
        ) {
            paginationHTML += `
                <button 
                    class="pagination-btn ${i === currentPage ? 'active' : ''}"
                    onclick="changePage(${i})"
                >
                    ${i}
                </button>
            `;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            paginationHTML += '<span class="pagination-info">...</span>';
        }
    }

    // Next button
    paginationHTML += `
        <button 
            class="pagination-btn"
            ${currentPage === totalPages ? 'disabled' : ''}
            onclick="changePage(${currentPage + 1})"
        >
            Next
        </button>
    `;

    paginationDiv.innerHTML = paginationHTML;
}

/**
 * Change page
 * @param {number} page - Page number
 */
function changePage(page) {
    currentPage = page;
    loadCommentary();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Make changePage available globally
window.changePage = changePage;
