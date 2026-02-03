// Media Gallery JavaScript

// Configuration
// TO ENABLE YOUTUBE API:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable YouTube Data API v3
// 4. Create credentials (API Key)
// 5. Restrict the API key to YouTube Data API v3
// 6. Replace the API key below
const YOUTUBE_API_KEY = ''; // Add your YouTube Data API v3 key here
const YOUTUBE_HANDLE = '@thehenryquartey';
const TIKTOK_USERNAME = 'thehenryquartey';

// RSS Feed fallback for YouTube (no API key needed)
const YOUTUBE_RSS_FEED = `https://www.youtube.com/feeds/videos.xml?user=${YOUTUBE_HANDLE.replace('@', '')}`;

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
});

// Navigation Toggle
function initializeNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
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
        // Method 1: Try YouTube Data API v3 if API key is provided
        if (YOUTUBE_API_KEY && YOUTUBE_API_KEY !== '') {
            return await fetchYouTubeWithAPI();
        }
        
        // Method 2: Use RSS feed (no API key required)
        return await fetchYouTubeWithRSS();
        
    } catch (error) {
        console.error('Error fetching YouTube videos:', error);
        return [];
    }
}

// Fetch YouTube videos using Data API v3
async function fetchYouTubeWithAPI() {
    try {
        // First, get the channel ID from the handle
        const searchResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${YOUTUBE_HANDLE}&type=channel&key=${YOUTUBE_API_KEY}`
        );
        
        if (!searchResponse.ok) {
            throw new Error('Failed to find YouTube channel');
        }
        
        const searchData = await searchResponse.json();
        
        if (!searchData.items || searchData.items.length === 0) {
            throw new Error('Channel not found');
        }
        
        const channelId = searchData.items[0].id.channelId;
        
        // Now fetch videos from the channel
        const videosResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=50&type=video`
        );
        
        if (!videosResponse.ok) {
            throw new Error('Failed to fetch videos');
        }
        
        const videosData = await videosResponse.json();
        
        // Get video statistics
        const videoIds = videosData.items.map(item => item.id.videoId).join(',');
        const statsResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=statistics,contentDetails`
        );
        
        const statsData = await statsResponse.json();
        const statsMap = {};
        statsData.items.forEach(item => {
            statsMap[item.id] = {
                views: item.statistics.viewCount,
                duration: item.contentDetails.duration
            };
        });
        
        return videosData.items.map(item => ({
            id: item.id.videoId,
            platform: 'youtube',
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
            publishedAt: item.snippet.publishedAt,
            description: item.snippet.description,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
            views: statsMap[item.id.videoId]?.views || 0,
            duration: statsMap[item.id.videoId]?.duration || ''
        }));
        
    } catch (error) {
        console.error('YouTube API error:', error);
        throw error;
    }
}

// Fetch YouTube videos using RSS feed (no API key required)
async function fetchYouTubeWithRSS() {
    try {
        // Try multiple methods to fetch RSS feed
        const channelUsername = YOUTUBE_HANDLE.replace('@', '');
        
        // Method 1: Try with allorigins proxy
        try {
            const corsProxy = 'https://api.allorigins.win/get?url=';
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${channelUsername}`;
            
            const response = await fetch(corsProxy + encodeURIComponent(rssUrl));
            
            if (response.ok) {
                const data = await response.json();
                const xmlText = data.contents;
                return parseYouTubeRSS(xmlText);
            }
        } catch (e) {
            console.log('AllOrigins proxy failed, trying alternative...');
        }
        
        // Method 2: Try with corsproxy.io
        try {
            const corsProxy = 'https://corsproxy.io/?';
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${channelUsername}`;
            
            const response = await fetch(corsProxy + encodeURIComponent(rssUrl));
            
            if (response.ok) {
                const xmlText = await response.text();
                return parseYouTubeRSS(xmlText);
            }
        } catch (e) {
            console.log('Corsproxy failed, trying direct fetch...');
        }
        
        // Method 3: Try direct fetch (might work in some browsers)
        try {
            const rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${channelUsername}`;
            const response = await fetch(rssUrl);
            
            if (response.ok) {
                const xmlText = await response.text();
                return parseYouTubeRSS(xmlText);
            }
        } catch (e) {
            console.log('Direct fetch failed');
        }
        
        throw new Error('All RSS fetch methods failed');
        
    } catch (error) {
        console.error('YouTube RSS error:', error);
        throw error;
    }
}

// Parse YouTube RSS XML
function parseYouTubeRSS(xmlText) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parse errors
    const parseError = xml.querySelector('parsererror');
    if (parseError) {
        throw new Error('XML parsing failed');
    }
    
    // Parse XML entries
    const entries = xml.querySelectorAll('entry');
    const videos = [];
    
    entries.forEach(entry => {
        // Get video ID from yt:videoId or from link
        let videoId = entry.querySelector('videoId')?.textContent;
        if (!videoId) {
            const link = entry.querySelector('link')?.getAttribute('href');
            if (link) {
                const match = link.match(/watch\?v=([^&]+)/);
                if (match) videoId = match[1];
            }
        }
        
        const title = entry.querySelector('title')?.textContent;
        const published = entry.querySelector('published')?.textContent;
        
        // Try different ways to get description
        let description = entry.querySelector('media\\:description')?.textContent || 
                         entry.querySelector('description')?.textContent || 
                         entry.getElementsByTagName('media:description')[0]?.textContent ||
                         '';
        
        // Get thumbnail - try multiple methods
        let thumbnail = '';
        const mediaThumbnail = entry.querySelector('media\\:thumbnail') || 
                              entry.getElementsByTagName('media:thumbnail')[0];
        if (mediaThumbnail) {
            thumbnail = mediaThumbnail.getAttribute('url');
        }
        
        if (!thumbnail && videoId) {
            thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
        }
        
        if (videoId && title) {
            videos.push({
                id: videoId,
                platform: 'youtube',
                title: title,
                thumbnail: thumbnail,
                publishedAt: published,
                description: description,
                url: `https://www.youtube.com/watch?v=${videoId}`,
                views: null,
                duration: null
            });
        }
    });
    
    return videos;
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
