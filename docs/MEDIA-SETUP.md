# Media Gallery Setup Guide

This guide will help you configure the media gallery to fetch real posts from your YouTube and TikTok accounts.

## YouTube Integration

The media gallery supports **two methods** for fetching YouTube videos:

### Method 1: RSS Feed (No API Key Required) - **RECOMMENDED**

This method is automatically enabled and requires **NO setup**. It uses YouTube's public RSS feed to fetch your latest videos.

**Pros:**
- ✅ No API key needed
- ✅ No quotas or rate limits
- ✅ Works immediately
- ✅ Free forever

**Cons:**
- ⚠️ Limited to ~15 most recent videos
- ⚠️ No view counts or video statistics
- ⚠️ No duration information

**How it works:**
The system automatically fetches videos from:
```
https://www.youtube.com/feeds/videos.xml?user=thehenryquartey
```

### Method 2: YouTube Data API v3 (Optional - For Advanced Features)

Use this method if you need video statistics (views, likes) and want to fetch more than 15 videos.

**Setup Steps:**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a Project**
   - Click "Select a project" at the top
   - Click "New Project"
   - Name it (e.g., "GetWordWisdom Media")
   - Click "Create"

3. **Enable YouTube Data API v3**
   - In the left menu, go to "APIs & Services" > "Library"
   - Search for "YouTube Data API v3"
   - Click on it and press "Enable"

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key that appears

5. **Restrict API Key (Recommended)**
   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Check only "YouTube Data API v3"
   - Under "Application restrictions", select "HTTP referrers"
   - Add your website domain (e.g., `yourwebsite.com/*`)
   - Click "Save"

6. **Add API Key to Code**
   - Open `/js/media.js`
   - Find this line near the top:
     ```javascript
     const YOUTUBE_API_KEY = '';
     ```
   - Replace with your API key:
     ```javascript
     const YOUTUBE_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
     ```
   - Save the file

**API Quotas:**
- Free tier: 10,000 units per day
- Each video search costs ~100 units
- This allows ~100 page loads per day
- More than enough for most websites

---

## TikTok Integration

TikTok does not provide a public API for fetching user videos without approval. Here are your options:

### Option 1: Manual Curation (Recommended)

Manually add your featured TikTok videos to the gallery.

**Steps:**

1. Open `/js/media.js`
2. Find the `createTikTokPlaceholders()` function
3. Replace the empty return array with your videos:

```javascript
function createTikTokPlaceholders() {
    return [
        {
            id: 'tiktok1',
            platform: 'tiktok',
            title: 'Your Video Title',
            thumbnail: '../assets/tiktok-thumb1.jpg', // Add thumbnail image to assets folder
            publishedAt: '2024-01-15T00:00:00Z',
            description: 'Brief description of your video',
            url: 'https://www.tiktok.com/@thehenryquartey/video/1234567890'
        },
        {
            id: 'tiktok2',
            platform: 'tiktok',
            title: 'Another Video Title',
            thumbnail: '../assets/tiktok-thumb2.jpg',
            publishedAt: '2024-01-10T00:00:00Z',
            description: 'Another video description',
            url: 'https://www.tiktok.com/@thehenryquartey/video/0987654321'
        }
        // Add more videos as needed
    ];
}
```

**Getting TikTok Video URLs:**
1. Open your TikTok video in the app or on the web
2. Click the "Share" button
3. Click "Copy Link"
4. The URL will look like: `https://www.tiktok.com/@username/video/1234567890`

**Getting Thumbnails:**
1. Take a screenshot of your video
2. Crop to 16:9 aspect ratio (1280x720 or 1920x1080)
3. Save to `/assets/` folder
4. Reference in the code as shown above

### Option 2: TikTok Embed Widget

Embed TikTok's official timeline widget to show all your videos automatically.

**Steps:**

1. Open `/media/index.html`
2. Add this code where you want the TikTok feed to appear:

```html
<section class="tiktok-embed-section">
    <div class="container">
        <h2>Latest TikTok Posts</h2>
        <blockquote 
            class="tiktok-embed" 
            cite="https://www.tiktok.com/@thehenryquartey" 
            data-unique-id="thehenryquartey" 
            data-embed-type="creator">
            <section>
                <a target="_blank" href="https://www.tiktok.com/@thehenryquartey">@thehenryquartey</a>
            </section>
        </blockquote>
        <script async src="https://www.tiktok.com/embed.js"></script>
    </div>
</section>
```

This will show your entire TikTok timeline automatically.

### Option 3: TikTok for Developers (Advanced)

Apply for TikTok API access (requires business verification):
1. Visit: https://developers.tiktok.com/
2. Apply for "Display API" access
3. Wait for approval (can take weeks)
4. Implement OAuth flow

**Not recommended** unless you need programmatic access for other reasons.

---

## Testing Your Setup

### Test YouTube Integration:

1. Open the media gallery page in your browser
2. You should see videos loading automatically
3. Videos should be from @thehenryquartey channel
4. Click a video to open it in the modal player

**Troubleshooting:**
- If no videos appear, check browser console (F12) for errors
- Verify the YouTube handle is correct: `@thehenryquartey`
- If using API key, verify it's correctly entered in the code
- Check that API key restrictions allow your domain

### Test TikTok Integration:

1. Add at least one TikTok video manually (see Option 1 above)
2. Refresh the page
3. Click the "TikTok" filter tab
4. Your curated videos should appear
5. Clicking should open the video on TikTok

---

## Current Configuration

**YouTube Handle:** `@thehenryquartey`
**TikTok Username:** `@thehenryquartey`

To change these, edit the constants at the top of `/js/media.js`:

```javascript
const YOUTUBE_HANDLE = '@thehenryquartey';
const TIKTOK_USERNAME = 'thehenryquartey';
```

---

## Performance Tips

1. **YouTube RSS (Default):**
   - Loads 15 most recent videos
   - Very fast and reliable
   - No quotas to worry about

2. **YouTube API (Optional):**
   - Can fetch up to 50 videos
   - Monitor your quota usage at: https://console.cloud.google.com/
   - Consider caching results if you have high traffic

3. **TikTok Manual Curation:**
   - Update weekly/monthly with your best content
   - Keep thumbnails under 200KB for faster loading
   - Limit to 10-20 featured videos

---

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify all URLs and API keys are correct
3. Test in incognito mode to rule out caching issues
4. Refer to official documentation:
   - YouTube API: https://developers.google.com/youtube/v3
   - TikTok Embed: https://www.tiktok.com/embed

---

## Summary

✅ **YouTube** - Works immediately with RSS feed (no setup needed)  
⚠️ **TikTok** - Requires manual curation of featured videos

The media gallery is now configured to fetch real content from your accounts!
