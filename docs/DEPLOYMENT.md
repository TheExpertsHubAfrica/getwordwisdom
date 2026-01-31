# GetWordWisdom - Deployment Guide

Complete step-by-step instructions for deploying your Christian blog platform.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Google Sheets Setup](#google-sheets-setup)
3. [Google Drive Setup](#google-drive-setup)
4. [Google Apps Script Deployment](#google-apps-script-deployment)
5. [Frontend Configuration](#frontend-configuration)
6. [Testing Checklist](#testing-checklist)
7. [Going Live](#going-live)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:
- A Google Account
- Access to Google Drive, Sheets, and Apps Script
- Basic understanding of Google Apps Script
- A web hosting service (e.g., Netlify, Vercel, GitHub Pages, or any static hosting)

---

## Google Sheets Setup

### 1. Create the Database Spreadsheet

## Google Sheets Setup

### 1. Create the Database Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet named **"GetWordWisdom Database"**
3. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
   ```
4. Save the `SHEET_ID` for later configuration

**Note:** You no longer need to manually create the sheets! The `setupSheets()` function will create all three sheets automatically with proper headers and sample data.

### 2. Sheet Structure (Auto-Created)

The `setupSheets()` function will create these sheets:

**Posts Sheet:**
- Columns: postId, title, slug, content, category, featuredImage, author, status, isFeatured, createdDate, updatedDate
- Includes a sample "Welcome" post

**Subscribers Sheet:**
- Columns: subscriberId, email, status, dateSubscribed
- Ready for subscriber data

**Admins Sheet:**
- Columns: email, passwordHash, role
- Includes default admin: `admin@getwordwisdom.com` / `ChangeMe123!`
- ⚠️ **IMPORTANT:** Change this password after setup!

**⚠️ Security Note:** Passwords are currently stored in plain text. For production, implement proper password hashing.

---

## Google Drive Setup

### 1. Create Upload Folder

1. Go to [Google Drive](https://drive.google.com)
2. Create a new folder named **"GetWordWisdom Images"**
3. Right-click the folder > Share
4. Under "General access" set to **"Anyone with the link"** > **Viewer**
5. Click "Copy link" and note the folder ID:
   ```
   https://drive.google.com/drive/folders/[FOLDER_ID]
   ```
6. Save the `FOLDER_ID` for configuration

---

## Google Apps Script Deployment

### 1. Create Apps Script Project

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New project"**
3. Name it **"GetWordWisdom API"**

### 2. Add the Code

1. Delete any default code in `Code.gs`
2. Copy the entire content from `/google-apps-script/Code.gs`
3. Paste it into the Apps Script editor

### 3. Configure the Script

Update these constants at the top of `Code.gs`:

```javascript
// Configuration - UPDATE THESE VALUES
const MAIN_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // From Google Sheets Setup
const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // From Google Drive Setup
```

### 4. Run Setup Function (IMPORTANT!)

**This automatically creates all sheets with proper structure:**

1. Select `setupSheets` from the function dropdown at the top
2. Click the **Run** button (▶)
3. Authorize permissions:
   - Click **"Review permissions"**
   - Select your Google account
   - Click **"Advanced"** > **"Go to GetWordWisdom API (unsafe)"**
   - Click **"Allow"**
4. Check the **Execution log** (View > Logs or Ctrl+Enter):
   - Should see "✅ Posts sheet created with sample post"
   - Should see "✅ Subscribers sheet created"
   - Should see "✅ Admins sheet created with default admin"
   - Should see "🎉 Setup complete!"
5. Open your spreadsheet - all three sheets should now exist with headers and sample data!
6. **Change the default admin password** in the Admins sheet (admin@getwordwisdom.com / ChangeMe123!)

### 5. Deploy as Web App

1. Click **"Deploy"** > **"New deployment"**
2. Click the gear icon ⚙️ next to "Select type"
3. Select **"Web app"**
4. Configure deployment:
   - **Description:** "GetWordWisdom API v1"
   - **Execute as:** Me (your-email@example.com)
   - **Who has access:** Anyone
5. Click **"Deploy"**
6. Review permissions:
   - Click **"Review permissions"**
   - Select your Google account
   - Click **"Advanced"** > **"Go to GetWordWisdom API (unsafe)"**
   - Click **"Allow"**
7. Copy the **Web app URL** (looks like):
   ```
   https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec
   ```
8. Save this URL for frontend configuration

### 5. Test the Deployment

Test in your browser or with curl:

```bash
curl -X POST https://script.google.com/macros/s/[DEPLOYMENT_ID]/exec \
  -H "Content-Type: application/json" \
  -d '{"action":"getPosts","page":1}'
```

Expected response: `{"success":true,"data":{"posts":[],"total":0}}`

---

## Frontend Configuration

### 1. Update API Configuration

Open `/js/config.js` and update:

```javascript
const CONFIG = {
    API_URL: 'https://script.google.com/macros/s/[YOUR_DEPLOYMENT_ID]/exec', // ← Update this
    POSTS_PER_PAGE: 9,
    CATEGORIES: [
        'Faith',
        'Devotionals',
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

### 2. Test Locally

You can test locally using any static server:

**Option 1: Python**
```bash
cd /Users/mygyan/Downloads/Code\ Arena/getwordwisdom
python3 -m http.server 8000
```
Then visit: `http://localhost:8000`

**Option 2: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

**Option 3: Node.js**
```bash
npx serve .
```

---

## Testing Checklist

### Public Pages Testing

- [ ] **Homepage** (`/`)
  - [ ] Hero section displays
  - [ ] Featured posts load (after adding test posts)
  - [ ] Newsletter CTA works
  - [ ] Mobile menu toggles correctly

- [ ] **About Page** (`/about/`)
  - [ ] Content displays properly
  - [ ] All sections render correctly
  - [ ] CTAs link to correct pages

- [ ] **Blog Page** (`/blog/`)
  - [ ] Posts grid displays
  - [ ] Category filter works
  - [ ] Pagination works (with multiple posts)
  - [ ] Click on post navigates to post page

- [ ] **Single Post** (`/blog/post.html?slug=test-post`)
  - [ ] Post content displays
  - [ ] Featured image shows
  - [ ] Meta information (date, category, author) displays
  - [ ] Share buttons work (test each: Twitter, Facebook, LinkedIn, Copy)

- [ ] **Categories Page** (`/categories/`)
  - [ ] All 5 categories display with icons
  - [ ] Click on category navigates to filtered blog
  - [ ] Post counts display correctly

- [ ] **Devotionals Page** (`/devotionals/`)
  - [ ] Devotional posts display
  - [ ] Pagination works
  - [ ] Click on devotional navigates to post page

- [ ] **Subscribe Page** (`/subscribe/`)
  - [ ] Form validation works (invalid email shows error)
  - [ ] Successful subscription shows success message
  - [ ] Email is added to Subscribers sheet
  - [ ] Welcome email is sent

- [ ] **Contact Page** (`/contact/`)
  - [ ] Form validation works (all required fields)
  - [ ] Successful submission shows success message
  - [ ] Contact details display correctly

### Admin Dashboard Testing

- [ ] **Login** (`/admin/login.html`)
  - [ ] Valid credentials allow login
  - [ ] Invalid credentials show error
  - [ ] Session token is stored
  - [ ] Redirect to dashboard after login

- [ ] **Dashboard** (`/admin/`)
  - [ ] Must be logged in to access
  - [ ] Posts table displays all posts
  - [ ] Subscribers table displays all subscribers
  - [ ] Navigation between sections works

- [ ] **Post Management**
  - [ ] Create new post
    - [ ] Title generates slug automatically
    - [ ] All fields save correctly
    - [ ] Image upload works
    - [ ] Post appears in Posts sheet
  - [ ] Edit existing post
    - [ ] Load post data into form
    - [ ] Update fields
    - [ ] Changes save to sheet
  - [ ] Delete post
    - [ ] Confirmation modal appears
    - [ ] Post is removed from sheet
  - [ ] Feature post
    - [ ] Toggle featured status
    - [ ] Featured post appears on homepage

- [ ] **Subscriber Management**
  - [ ] View all subscribers
  - [ ] See subscriber stats (total, active)
  - [ ] Toggle subscriber status (active/unsubscribed)

- [ ] **Newsletter Functionality**
  - [ ] Save featured post triggers newsletter
  - [ ] All active subscribers receive email
  - [ ] Email contains correct content and unsubscribe link

### Responsive Design Testing

Test on multiple devices/viewports:
- [ ] Mobile (375px - iPhone)
- [ ] Tablet (768px - iPad)
- [ ] Desktop (1440px+)
- [ ] Mobile menu works on small screens
- [ ] Images scale appropriately
- [ ] Text remains readable
- [ ] Buttons are tapable (min 44px)

### Browser Testing

Test on:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

## Going Live

### Option 1: Netlify (Recommended)

1. Push code to GitHub repository
2. Go to [Netlify](https://netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Connect to GitHub and select your repo
5. Build settings:
   - Build command: (leave empty)
   - Publish directory: `/`
6. Click "Deploy"
7. Optional: Configure custom domain

### Option 2: Vercel

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Click "Deploy"
6. Optional: Configure custom domain

### Option 3: GitHub Pages

1. Push code to GitHub repository
2. Go to repo Settings > Pages
3. Source: Deploy from branch
4. Branch: main, folder: / (root)
5. Click "Save"
6. Site will be live at: `https://[username].github.io/[repo-name]`

### Option 4: Traditional Hosting

1. Build/bundle your files (if using a build tool)
2. Upload all files via FTP/SFTP to your hosting provider
3. Ensure `index.html` is in the root directory
4. Configure server for SPA routing (if needed)

---

## Troubleshooting

### Posts Not Loading

**Symptoms:** Empty posts grid, loading skeleton never disappears

**Solutions:**
1. Check browser console for errors (F12)
2. Verify `API_URL` in `/js/config.js` is correct
3. Test API directly in browser: `[API_URL]?action=getPosts&page=1`
4. Ensure Google Apps Script is deployed with "Anyone" access
5. Check CORS settings (Apps Script should handle this automatically)

### Admin Login Fails

**Symptoms:** "Invalid credentials" error even with correct details

**Solutions:**
1. Verify admin email/password in Admins sheet (Google Sheets)
2. Check for extra spaces in email/password cells
3. Ensure `SHEET_ID` in `Code.gs` is correct
4. Check Apps Script execution logs for errors:
   - Open Apps Script editor
   - Click "Executions" (left sidebar)
   - Look for failed executions and error messages

### Images Not Uploading

**Symptoms:** Image upload fails or images don't appear

**Solutions:**
1. Verify `DRIVE_FOLDER_ID` in `Code.gs` is correct
2. Ensure Drive folder has "Anyone with the link" > "Viewer" access
3. Check Apps Script has Drive API permissions
4. Verify image is under 5MB
5. Check browser console for upload errors

### Newsletter Not Sending

**Symptoms:** No emails received when publishing featured post

**Solutions:**
1. Check Gmail quota (100 emails/day for free accounts, 1500 for Workspace)
2. Verify subscriber emails in Subscribers sheet
3. Check Apps Script execution logs for email errors
4. Ensure `GmailApp.sendEmail()` has proper permissions
5. Test with a single subscriber first

### Mobile Menu Not Working

**Symptoms:** Menu doesn't toggle on mobile

**Solutions:**
1. Ensure `/js/utils.js` is loaded before page scripts
2. Check browser console for JavaScript errors
3. Verify `initMobileMenu()` is called on page load
4. Clear browser cache and reload

### Pagination Not Working

**Symptoms:** Can't navigate between pages

**Solutions:**
1. Verify sufficient posts exist (need 10+ for second page)
2. Check `POSTS_PER_PAGE` in `/js/config.js`
3. Look for JavaScript errors in console
4. Verify API returns correct `total` count

### CORS Errors

**Symptoms:** "Blocked by CORS policy" error in console

**Solutions:**
1. Ensure Google Apps Script is deployed as "Anyone" can access
2. Redeploy the Apps Script if recently changed
3. Google Apps Script should automatically handle CORS
4. If using custom domain, ensure API requests use HTTPS

---

## Production Checklist

Before launching to public:

### Security
- [ ] Change admin password from default
- [ ] Review Google Sheets sharing settings
- [ ] Review Drive folder sharing settings
- [ ] Enable 2-factor authentication on Google account
- [ ] Consider implementing password hashing in Code.gs

### Performance
- [ ] Optimize images (compress before upload)
- [ ] Test page load times
- [ ] Enable caching on hosting platform
- [ ] Consider CDN for static assets

### Content
- [ ] Add several initial blog posts
- [ ] Set featured posts for homepage
- [ ] Test all post categories
- [ ] Proofread all content
- [ ] Add author bio/photo (if desired)

### SEO
- [ ] Update meta descriptions in all HTML files
- [ ] Add Open Graph tags for social sharing
- [ ] Create sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Add Google Analytics (optional)

### Legal
- [ ] Add Privacy Policy page
- [ ] Add Terms of Service page
- [ ] Ensure GDPR compliance (if applicable)
- [ ] Add cookie consent (if using analytics)

### Testing
- [ ] Complete all items in Testing Checklist above
- [ ] Have someone else test the site
- [ ] Test unsubscribe functionality
- [ ] Test on slow network connection
- [ ] Test with screen reader (accessibility)

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor subscriber growth
- Check contact form submissions
- Review new posts in admin dashboard

**Weekly:**
- Publish new blog posts
- Send newsletter (if featured post)
- Respond to contact inquiries
- Monitor email quota usage

**Monthly:**
- Review Google Sheets for data integrity
- Check Google Drive storage usage
- Update old content as needed
- Review analytics (if installed)

### Backup Strategy

**Recommended:**
1. Enable Google Sheets version history (automatic)
2. Periodically export sheets as Excel/CSV
3. Backup uploaded images from Google Drive
4. Keep a copy of `Code.gs` in version control

### Email Quota Management

**Free Google Account:** 100 emails/day
**Google Workspace:** 1,500 emails/day

**If you exceed quota:**
1. Batch newsletter sends across multiple days
2. Upgrade to Google Workspace
3. Integrate third-party email service (Mailchimp, SendGrid)

---

## Next Steps & Enhancements

### Recommended Improvements

1. **Password Security**
   - Implement bcrypt or similar hashing in Code.gs
   - Add password reset functionality
   - Add password strength requirements

2. **Rich Text Editor**
   - Integrate Quill or TinyMCE for post editing
   - Add formatting toolbar in admin

3. **Image Optimization**
   - Compress images before upload
   - Generate multiple sizes for responsive images
   - Implement lazy loading

4. **Caching**
   - Cache API responses in frontend
   - Implement service worker for offline support
   - Add cache invalidation strategy

5. **Analytics**
   - Add Google Analytics 4
   - Track popular posts
   - Monitor user engagement

6. **Comments System**
   - Integrate Disqus or similar
   - Or build custom comment system in Google Sheets

7. **Search Functionality**
   - Add search bar to blog
   - Implement full-text search in posts

8. **Social Media**
   - Add social media links to footer
   - Create social media share images
   - Auto-post to social platforms

---

## Contact & Support

For questions or issues:
1. Check this documentation first
2. Review [Google Apps Script documentation](https://developers.google.com/apps-script)
3. Check browser console for specific error messages
4. Review Google Apps Script execution logs

---

## Congratulations!

Your GetWordWisdom blog platform is now fully configured and ready to inspire believers worldwide with faith-building content. 

**"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom." - Colossians 3:16**

🙏 May your ministry flourish and bring glory to God!
