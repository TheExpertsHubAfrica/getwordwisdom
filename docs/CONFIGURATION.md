# Configuration Examples

Reference configurations for GetWordWisdom deployment.

## Google Sheets Schema

### Posts Sheet Structure

| Column | Header | Type | Example | Description |
|--------|--------|------|---------|-------------|
| A | postId | String | "1" | Unique identifier (auto-increment) |
| B | title | String | "Building Faith Daily" | Post title |
| C | slug | String | "building-faith-daily" | URL-friendly slug |
| D | content | HTML | `<p>Content...</p>` | Post content with HTML |
| E | category | String | "Faith" | Category name |
| F | featuredImage | URL | "https://..." | Featured image URL |
| G | author | String | "John Smith" | Author name |
| H | status | String | "published" | "published" or "draft" |
| I | isFeatured | String | "true" | "true" or "false" |
| J | createdDate | ISO Date | "2024-01-01T00:00:00.000Z" | Creation timestamp |
| K | updatedDate | ISO Date | "2024-01-01T00:00:00.000Z" | Last update timestamp |

**Example Row:**
```
1 | Building Faith Daily | building-faith-daily | <p>Discover how to strengthen your faith through daily spiritual practices and prayer.</p> | Faith | https://drive.google.com/uc?export=view&id=ABC123 | John Smith | published | true | 2024-01-15T08:00:00.000Z | 2024-01-15T08:00:00.000Z
```

### Subscribers Sheet Structure

| Column | Header | Type | Example | Description |
|--------|--------|------|---------|-------------|
| A | subscriberId | String | "1" | Unique identifier (auto-increment) |
| B | email | Email | "user@example.com" | Subscriber email |
| C | status | String | "active" | "active" or "unsubscribed" |
| D | dateSubscribed | ISO Date | "2024-01-01T00:00:00.000Z" | Subscription timestamp |

**Example Row:**
```
1 | john.doe@example.com | active | 2024-01-15T10:30:00.000Z
```

### Admins Sheet Structure

| Column | Header | Type | Example | Description |
|--------|--------|------|---------|-------------|
| A | email | Email | "admin@example.com" | Admin email |
| B | passwordHash | String | "securePassword123" | Password (plain text in v1.0) |
| C | role | String | "admin" | Role ("admin" or "editor") |

**Example Row:**
```
admin@getwordwisdom.com | MySecurePassword2024! | admin
```

---

## Google Apps Script Configuration

### Required Configuration Values

```javascript
// =====================================
// CONFIGURATION - UPDATE THESE VALUES
// =====================================

// Google Sheets Configuration
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
const POSTS_SHEET_NAME = 'Posts';
const SUBSCRIBERS_SHEET_NAME = 'Subscribers';
const ADMINS_SHEET_NAME = 'Admins';

// Google Drive Configuration
const DRIVE_FOLDER_ID = 'YOUR_GOOGLE_DRIVE_FOLDER_ID_HERE';

// Admin Configuration
const ADMIN_EMAIL = 'your-email@example.com';

// Pagination
const POSTS_PER_PAGE = 9;

// Token Configuration
const TOKEN_EXPIRY_HOURS = 24;
```

### Example with Real Values

```javascript
// Example configuration (replace with your actual values)
const SHEET_ID = '1abc123xyz789def456ghi789jkl012mno345pqr678stu901';
const POSTS_SHEET_NAME = 'Posts';
const SUBSCRIBERS_SHEET_NAME = 'Subscribers';
const ADMINS_SHEET_NAME = 'Admins';

const DRIVE_FOLDER_ID = '1XyZ9876AbC5432DeF1098GhI7654JkL3210';

const ADMIN_EMAIL = 'admin@getwordwisdom.com';

const POSTS_PER_PAGE = 9;
const TOKEN_EXPIRY_HOURS = 24;
```

### How to Get IDs

**Sheet ID:**
1. Open your Google Sheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`
3. Copy the long string between `/d/` and `/edit`

**Drive Folder ID:**
1. Open your Google Drive folder
2. Look at the URL: `https://drive.google.com/drive/folders/[FOLDER_ID]`
3. Copy the string after `/folders/`

---

## Frontend Configuration

### /js/config.js

```javascript
const CONFIG = {
    // =====================================
    // CONFIGURATION - UPDATE THIS URL
    // =====================================
    API_URL: 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec',
    
    // Pagination
    POSTS_PER_PAGE: 9,
    
    // Categories (must match categories used in posts)
    CATEGORIES: [
        'Faith',
        'Commentary',
        'Christian Living',
        'Teachings',
        'Wisdom'
    ],
    
    // Local storage keys
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_admin_token',
        ADMIN_EMAIL: 'gww_admin_email'
    }
};
```

### Example with Real API URL

```javascript
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/AKfycbzXYZ123abc456def789ghi012jkl345mno678pqr901stu234/exec',
    POSTS_PER_PAGE: 9,
    CATEGORIES: [
        'Faith',
        'Commentary',
        'Christian Living',
        'Teachings',
        'Wisdom'
    ],
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_admin_token',
        ADMIN_EMAIL: 'gww_admin_email'
    }
};
```

### How to Get API URL

1. Open Google Apps Script project
2. Click "Deploy" → "Manage deployments"
3. Click "Edit" (pencil icon) on your deployment
4. Copy the "Web app" URL
5. Should look like: `https://script.google.com/macros/s/.../exec`

---

## Test Data Examples

### Sample Posts for Testing

**Post 1: Featured Faith Post**
```
postId: 1
title: Welcome to GetWordWisdom
slug: welcome-to-getwordwisdom
content: <h2>Welcome</h2><p>We're excited to share faith, wisdom, and commentary with you. This blog is dedicated to helping believers grow in their relationship with Christ through biblical teachings and practical wisdom.</p><blockquote>"For the Lord gives wisdom; from his mouth come knowledge and understanding." - Proverbs 2:6</blockquote>
category: Faith
featuredImage: https://via.placeholder.com/800x400/2c3e50/ffffff?text=Welcome+to+GetWordWisdom
author: Admin
status: published
isFeatured: true
createdDate: 2024-01-15T08:00:00.000Z
updatedDate: 2024-01-15T08:00:00.000Z
```

**Post 2: Commentary**
```
postId: 2
title: Morning Prayer for Strength
slug: morning-prayer-for-strength
content: <p>Start your day with this powerful prayer for strength and guidance.</p><p><strong>Prayer:</strong> "Lord, as I begin this new day, I ask for Your strength to face whatever comes my way. Guide my steps, guard my heart, and help me to walk in Your ways. Amen."</p><p><em>Scripture:</em> "The Lord is my strength and my shield; my heart trusts in him, and he helps me." - Psalm 28:7</p>
category: Commentarys
featuredImage: https://via.placeholder.com/800x400/8b7355/ffffff?text=Morning+Prayer
author: Admin
status: published
isFeatured: false
createdDate: 2024-01-14T06:00:00.000Z
updatedDate: 2024-01-14T06:00:00.000Z
```

**Post 3: Christian Living**
```
postId: 3
title: Living Out Your Faith at Work
slug: living-out-your-faith-at-work
content: <p>Practical tips for being a light in your workplace.</p><ul><li>Start with prayer each morning</li><li>Show integrity in all dealings</li><li>Be a source of encouragement</li><li>Serve others with excellence</li><li>Share your faith when appropriate</li></ul><p>Remember, your workplace is your mission field!</p>
category: Christian Living
featuredImage: https://via.placeholder.com/800x400/c9a66b/333333?text=Faith+at+Work
author: Admin
status: published
isFeatured: false
createdDate: 2024-01-13T12:00:00.000Z
updatedDate: 2024-01-13T12:00:00.000Z
```

### Sample Subscribers for Testing

```
1 | john.doe@example.com | active | 2024-01-10T10:00:00.000Z
2 | jane.smith@example.com | active | 2024-01-11T14:30:00.000Z
3 | test@example.com | active | 2024-01-12T09:15:00.000Z
4 | unsubscribed@example.com | unsubscribed | 2024-01-09T08:00:00.000Z
```

### Sample Admin for Testing

```
admin@test.com | password123 | admin
```

---

## Environment-Specific Configurations

### Development

```javascript
// Development Configuration
const CONFIG = {
    API_URL: 'http://localhost:3000/api',  // Local mock API
    POSTS_PER_PAGE: 3,  // Smaller for faster testing
    CATEGORIES: ['Faith', 'Commentary'],  // Limited for testing
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_dev_admin_token',
        ADMIN_EMAIL: 'gww_dev_admin_email'
    },
    DEBUG: true  // Enable console logging
};
```

### Staging

```javascript
// Staging Configuration
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/STAGING_DEPLOYMENT_ID/exec',
    POSTS_PER_PAGE: 9,
    CATEGORIES: [
        'Faith',
        'Commentary',
        'Christian Living',
        'Teachings',
        'Wisdom'
    ],
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_staging_admin_token',
        ADMIN_EMAIL: 'gww_staging_admin_email'
    },
    DEBUG: true  // Keep logging in staging
};
```

### Production

```javascript
// Production Configuration
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/PRODUCTION_DEPLOYMENT_ID/exec',
    POSTS_PER_PAGE: 9,
    CATEGORIES: [
        'Faith',
        'Commentary',
        'Christian Living',
        'Teachings',
        'Wisdom'
    ],
    STORAGE_KEYS: {
        ADMIN_TOKEN: 'gww_admin_token',
        ADMIN_EMAIL: 'gww_admin_email'
    },
    DEBUG: false  // Disable logging in production
};
```

---

## CSS Customization Examples

### Color Schemes

**Default (Professional Christian):**
```css
:root {
    --color-primary: #2c3e50;      /* Dark blue-gray */
    --color-secondary: #8b7355;    /* Warm brown */
    --color-accent: #c9a66b;       /* Gold */
}
```

**Warm & Inviting:**
```css
:root {
    --color-primary: #8b4513;      /* Saddle brown */
    --color-secondary: #d2691e;    /* Chocolate */
    --color-accent: #f4a460;       /* Sandy brown */
}
```

**Modern & Clean:**
```css
:root {
    --color-primary: #1e3a8a;      /* Royal blue */
    --color-secondary: #3b82f6;    /* Blue */
    --color-accent: #60a5fa;       /* Light blue */
}
```

**Traditional Church:**
```css
:root {
    --color-primary: #800020;      /* Burgundy */
    --color-secondary: #b8860b;    /* Dark goldenrod */
    --color-accent: #daa520;       /* Goldenrod */
}
```

### Typography

**Serif (Classic):**
```css
:root {
    --font-heading: Georgia, 'Times New Roman', serif;
    --font-body: Georgia, 'Times New Roman', serif;
}
```

**Sans-Serif (Modern):**
```css
:root {
    --font-heading: 'Helvetica Neue', Arial, sans-serif;
    --font-body: 'Helvetica Neue', Arial, sans-serif;
}
```

**Mixed (Balanced):**
```css
:root {
    --font-heading: Georgia, 'Times New Roman', serif;
    --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
```

---

## Hosting Configuration Examples

### Netlify

**netlify.toml:**
```toml
[build]
  publish = "."
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  
[build.environment]
  NODE_VERSION = "18"
```

### Vercel

**vercel.json:**
```json
{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

### GitHub Pages

**No special configuration needed.**

Just ensure `index.html` is in root directory.

---

## Email Template Customization

### Welcome Email (in Code.gs)

```javascript
const subject = 'Welcome to GetWordWisdom Newsletter!';
const body = `
Dear Subscriber,

Thank you for subscribing to GetWordWisdom!

You'll now receive:
- Daily commentary
- Biblical teachings
- Faith-building content
- Updates on new posts

Unsubscribe anytime by replying to this email.

Blessings,
GetWordWisdom Team

---
"For the Lord gives wisdom; from his mouth come knowledge and understanding." - Proverbs 2:6
`;
```

### Newsletter Email (in Code.gs)

```javascript
const subject = `New Post: ${postData.title}`;
const body = `
Dear Subscriber,

We've published a new ${postData.category} post you'll love!

${postData.title}
By ${postData.author}

${postData.content.replace(/<[^>]*>/g, '').substring(0, 300)}...

Read more: [Your Website URL]/blog/post.html?slug=${postData.slug}

Unsubscribe: Reply to this email with "unsubscribe"

Blessings,
GetWordWisdom Team
`;
```

---

## Security Best Practices

### Recommended Changes for Production

**1. Password Hashing:**
```javascript
// Install CryptoJS or similar in Apps Script
function hashPassword(password) {
    const salt = 'your-random-salt-here';
    return Utilities.computeDigest(
        Utilities.DigestAlgorithm.SHA_256,
        password + salt
    ).map(byte => (byte + 256).toString(16).slice(-2)).join('');
}
```

**2. Environment Variables:**
```javascript
// Use PropertiesService for sensitive data
const scriptProperties = PropertiesService.getScriptProperties();
const ADMIN_EMAIL = scriptProperties.getProperty('ADMIN_EMAIL');
const SHEET_ID = scriptProperties.getProperty('SHEET_ID');
```

**3. Rate Limiting:**
```javascript
// Track requests per IP
function checkRateLimit(ip) {
    const cache = CacheService.getScriptCache();
    const key = `rate_limit_${ip}`;
    const requests = cache.get(key) || 0;
    
    if (requests > 100) {  // 100 requests per hour
        throw new Error('Rate limit exceeded');
    }
    
    cache.put(key, parseInt(requests) + 1, 3600);
}
```

---

## Backup Configuration

### Automated Google Sheets Backup

**Apps Script for Daily Backup:**
```javascript
function backupSheets() {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const backupFolder = DriveApp.getFolderById('BACKUP_FOLDER_ID');
    const today = Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd');
    
    const backup = ss.copy(`GetWordWisdom Backup ${today}`);
    DriveApp.getFileById(backup.getId()).moveTo(backupFolder);
    
    // Delete backups older than 30 days
    const files = backupFolder.getFiles();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    while (files.hasNext()) {
        const file = files.next();
        if (file.getDateCreated() < thirtyDaysAgo) {
            file.setTrashed(true);
        }
    }
}

// Set up trigger: Edit > Current project's triggers > Add Trigger
// Function: backupSheets
// Event source: Time-driven
// Type: Day timer
// Time: 2am to 3am
```

---

## Monitoring Configuration

### Google Apps Script Logging

```javascript
// Enhanced logging function
function logAction(action, details, success = true) {
    const logSheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Logs');
    if (!logSheet) return;
    
    logSheet.appendRow([
        new Date(),
        action,
        JSON.stringify(details),
        success ? 'SUCCESS' : 'ERROR',
        Session.getActiveUser().getEmail()
    ]);
}

// Usage
logAction('POST_CREATED', { postId: '1', title: 'New Post' }, true);
logAction('LOGIN_FAILED', { email: 'test@example.com' }, false);
```

---

## Additional Resources

- **Google Apps Script Docs:** https://developers.google.com/apps-script
- **Google Sheets API:** https://developers.google.com/sheets/api
- **Google Drive API:** https://developers.google.com/drive/api
- **Gmail API Quotas:** https://developers.google.com/gmail/api/reference/quota

---

**Configuration guide complete! Use these examples as reference for your deployment. 🚀**
