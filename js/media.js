// Media Gallery JavaScript

// Configuration
const YOUTUBE_HANDLE = '@thehenryquartey';
const TIKTOK_USERNAME = 'thehenryquartey';

// Static YouTube video list (update this list with new videos)
const YOUTUBE_VIDEOS = [
    {
        id: 'SQ4CMZrbuz0',
        title: 'Latest Video',
        description: 'Watch our latest content from @thehenryquartey',
        publishedAt: '2026-02-01T00:00:00Z'
    },
    {
        id: 'OVH60BZDi7I',
        title: 'Featured Content',
        description: 'Inspiring message from @thehenryquartey',
        publishedAt: '2026-01-28T00:00:00Z'
    },
    {
        id: '5CYmBlyeaQk',
        title: 'Weekly Message',
        description: 'Weekly inspiration from @thehenryquartey',
        publishedAt: '2026-01-25T00:00:00Z'
    },
    {
        id: 'yNv2h2YXph4',
        title: 'Special Teaching',
        description: 'Special teaching from @thehenryquartey',
        publishedAt: '2026-01-20T00:00:00Z'
    },
    {
        id: 'V5aFA6IMvYs',
        title: 'Recent Upload',
        description: 'Recent content from @thehenryquartey',
        publishedAt: '2026-01-15T00:00:00Z'
    }
];

// State
let currentFilter = 'all';
let allMedia = [];
let displayedCount = 0;
const ITEMS_PER_PAGE = 12;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFilters();
    initializeModal();
    loadMediaContent();
    
    // Set current year in footer
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});

// Navigation Toggle
function initializeNavigation() {
    const navToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Filter Tabs
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Update active state
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Get filter value
            currentFilter = tab.getAttribute('data-filter');
            
            // Filter media
            filterMedia();
        });
    });
}

// Video Modal
function initializeModal() {
    const modal = document.getElementById('videoModal');
    const backdrop = document.getElementById('videoModalBackdrop');
    const closeBtn = document.getElementById('videoModalClose');
    
    // Close modal function
    const closeModal = () => {
        modal.classList.remove('active');
        // Stop video by clearing iframe
        const player = document.getElementById('videoModalPlayer');
        player.innerHTML = '';
    };
    
    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// Load Media Content
async function loadMediaContent() {
    const mediaGrid = document.getElementById('mediaGrid');
    const loadingState = mediaGrid.querySelector('.loading-state');
    const emptyState = document.querySelector('.empty-state');
    
    try {
        // Fetch YouTube videos
        const youtubeVideos = await fetchYouTubeVideos();
        
        // Create TikTok placeholder items (TikTok API requires authentication)
        const tiktokItems = createTikTokPlaceholders();
        
        // Combine all media
        allMedia = [...youtubeVideos, ...tiktokItems];
        
        // Sort by date (newest first)
        allMedia.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        
        // Hide loading state
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        
        // Display media
        if (allMedia.length > 0) {
            displayMedia();
            setupLoadMore();
        } else {
            // Show empty state
            mediaGrid.innerHTML = '';
            emptyState.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading media:', error);
        
        // Hide loading, show empty state with error message
        if (loadingState) {
            loadingState.style.display = 'none';
        }
        mediaGrid.innerHTML = '';
        emptyState.style.display = 'block';
        emptyState.querySelector('p').textContent = 'Unable to load media content. Please try again later.';
    }
}

// Fetch YouTube Videos
async function fetchYouTubeVideos() {
    try {
        // Use static video list and format for display
        return YOUTUBE_VIDEOS.map(video => ({
            id: video.id,
            platform: 'youtube',
            title: video.title,
            description: video.description,
            thumbnail: `https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`,
            publishedAt: video.publishedAt,
            url: `https://www.youtube.com/watch?v=${video.id}`,
            embedUrl: `https://www.youtube.com/embed/${video.id}`
        }));
    } catch (error) {
        console.error('Error formatting YouTube videos:', error);
        return [];
    }
}

// Create TikTok Placeholders
function createTikTokPlaceholders() {
    // TikTok doesn't have a public API for fetching user videos
    // Options:
    // 1. Use TikTok oEmbed API for specific video URLs
    // 2. Manually curate TikTok posts
    // 3. Use third-party scraping services (not recommended)
    
    // For now, creating a link to the TikTok profile
    // To add specific videos, manually add them here with their URLs
    
    // Example format for adding specific TikTok videos:
    /*
    return [
        {
            id: 'video1',
            platform: 'tiktok',
            title: 'Your Video Title',
            thumbnail: 'path/to/thumbnail.jpg',
            publishedAt: '2024-01-15T00:00:00Z',
            description: 'Video description',
            url: 'https://www.tiktok.com/@thehenryquartey/video/1234567890'
        }
    ];
    */
    
    // Return empty array - TikTok videos should be manually curated
    // User can add specific video objects here
    return [];
}

// Display Media
function displayMedia() {
    const mediaGrid = document.getElementById('mediaGrid');
    mediaGrid.innerHTML = '';
    
    // Filter media based on current filter
    const filteredMedia = currentFilter === 'all' 
        ? allMedia 
        : allMedia.filter(item => item.platform === currentFilter);
    
    // Get items to display
    const itemsToDisplay = filteredMedia.slice(0, displayedCount + ITEMS_PER_PAGE);
    displayedCount = itemsToDisplay.length;
    
    // Create media cards
    itemsToDisplay.forEach(item => {
        const card = createMediaCard(item);
        mediaGrid.appendChild(card);
    });
    
    // Update load more button
    updateLoadMoreButton(filteredMedia.length);
    
    // Stagger animation
    animateCards();
}

// Create Media Card
function createMediaCard(media) {
    const card = document.createElement('div');
    card.className = `media-card ${media.platform}`;
    card.setAttribute('data-platform', media.platform);
    
    // Format date
    const date = new Date(media.publishedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    
    // Platform badge
    const platformIcon = media.platform === 'youtube' 
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>';
    
    const platformName = media.platform.charAt(0).toUpperCase() + media.platform.slice(1);
    
    card.innerHTML = `
        <div class="media-thumbnail">
            <img src="${media.thumbnail}" alt="${media.title}" loading="lazy">
            <div class="play-overlay">
                <div class="play-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="platform-badge ${media.platform}">
                ${platformIcon}
                ${platformName}
            </div>
        </div>
        <div class="media-info">
            <h3 class="media-title">${media.title}</h3>
            <div class="media-meta">
                <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    ${formattedDate}
                </span>
            </div>
        </div>
    `;
    
    // Add click event
    card.addEventListener('click', () => openMedia(media));
    
    return card;
}

// Open Media in Modal or New Tab
function openMedia(media) {
    if (media.platform === 'youtube') {
        // Open YouTube video in modal
        const modal = document.getElementById('videoModal');
        const player = document.getElementById('videoModalPlayer');
        const info = document.getElementById('videoModalInfo');
        
        // Set video iframe
        player.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${media.id}?autoplay=1" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        // Set video info
        const date = new Date(media.publishedAt);
        const formattedDate = date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        
        // Build stats HTML
        let statsHTML = `
            <span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${formattedDate}
            </span>
        `;
        
        if (media.views) {
            statsHTML += `
                <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                    ${formatViewCount(media.views)} views
                </span>
            `;
        }
        
        if (media.duration) {
            statsHTML += `
                <span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="10 8 16 12 10 16 10 8"></polyline>
                    </svg>
                    ${formatDuration(media.duration)}
                </span>
            `;
        }
        
        info.innerHTML = `
            <h2>${media.title}</h2>
            <div class="video-stats">
                ${statsHTML}
            </div>
            <p class="video-description">${media.description}</p>
        `;
        
        // Show modal
        modal.classList.add('active');
    } else {
        // For TikTok, open in new tab
        window.open(media.url, '_blank');
    }
}

// Filter Media
function filterMedia() {
    displayedCount = 0;
    displayMedia();
}

// Setup Load More
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.querySelector('.load-more-container');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            displayMedia();
        });
    }
}

// Update Load More Button
function updateLoadMoreButton(totalFiltered) {
    const loadMoreContainer = document.querySelector('.load-more-container');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    if (displayedCount < totalFiltered) {
        loadMoreContainer.style.display = 'block';
        loadMoreBtn.disabled = false;
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// Animate Cards
function animateCards() {
    const cards = document.querySelectorAll('.media-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.05}s`;
    });
}

// Format View Count
function formatViewCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count.toString();
}

// Format Duration
function formatDuration(duration) {
    // YouTube duration format: PT#M#S
    const match = duration.match(/PT(\d+M)?(\d+S)?/);
    if (!match) return '';
    
    const minutes = match[1] ? parseInt(match[1]) : 0;
    const seconds = match[2] ? parseInt(match[2]) : 0;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}
