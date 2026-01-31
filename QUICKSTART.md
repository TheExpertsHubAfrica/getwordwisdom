# Quick Start Guide

Get GetWordWisdom running locally in just 3 minutes!

## Prerequisites

- Google Account
- Web browser
- Text editor (VS Code recommended)
- Python 3 or Node.js (for local server)

## Step-by-Step Setup

### 1. Download the Project

```bash
# Clone or download the repository
cd /Users/mygyan/Downloads/Code\ Arena/getwordwisdom
```

### 2. Set Up Google Sheets (1 minute - AUTOMATED!)

1. **Create Spreadsheet:**
   - Go to [sheets.google.com](https://sheets.google.com)
   - Create new spreadsheet: "GetWordWisdom Database"
   - Copy the Sheet ID from URL: `https://docs.google.com/spreadsheets/d/[COPY_THIS_PART]/edit`

**That's it! The sheets will be created automatically in step 4.**

### 3. Set Up Google Drive (1 minute)

1. Go to [drive.google.com](https://drive.google.com)
2. Create folder "GetWordWisdom Images"
3. Right-click folder → Share → "Anyone with the link" → Viewer
4. Copy folder ID from URL: `https://drive.google.com/drive/folders/[COPY_THIS_PART]`

### 4. Deploy Google Apps Script (2 minutes with AUTO-SETUP!)

1. Go to [script.google.com](https://script.google.com)
2. New project: "GetWordWisdom API"
3. Delete default code
4. Copy ALL code from `/google-apps-script/Code.gs`
5. **Update these TWO lines at the top:**
   ```javascript
   const MAIN_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // From step 2
   const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE'; // From step 3
   ```
6. Save (Ctrl+S / Cmd+S)

7. **Run the Setup Function (IMPORTANT!):**
   - Select `setupSheets` from the function dropdown (top of editor)
   - Click the Run button (▶)
   - Authorize permissions when prompted (click through warnings)
   - Check "Execution log" - should see success messages
   - ✅ Your sheets are now created with sample data!

8. **Deploy as Web App:**
   - Click Deploy → New deployment
   - Click gear icon → Select "Web app"
   - Execute as: Me
   - Who has access: Anyone
   - Click Deploy
   - **Copy Web app URL** (save for next step)

### 5. Configure Frontend (30 seconds)

1. Open `/js/config.js`
2. Replace line 2:
   ```javascript
   API_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
   ```
   with your actual deployment URL:
   ```javascript
   API_URL: 'https://script.google.com/macros/s/AK.../exec',
   ```
3. Save file

### 6. Run Locally

**Option A: Python (Recommended)**
```bash
cd /Users/mygyan/Downloads/Code\ Arena/getwordwisdom
python3 -m http.server 8000
```
Visit: http://localhost:8000

**Option B: VS Code Live Server**
1. Install "Live Server" extension
2. Right-click `index.html` → "Open with Live Server"

**Option C: Node.js**
```bash
npx serve .
```

### 7. Test the Site

1. **Homepage:** http://localhost:8000
   - Should show featured post

2. **Blog:** http://localhost:8000/blog/
   - Should show test post

3. **Admin Login:** http://localhost:8000/admin/login.html
   - Login: admin@test.com / password123

4. **Admin Dashboard:** http://localhost:8000/admin/
   - Create new posts
   - Upload images
   - Manage subscribers

## Quick Test Checklist

- [ ] Homepage loads with featured post
- [ ] Blog page shows posts
- [ ] Click post opens post detail
- [ ] Admin login works
- [ ] Can create new post in admin
- [ ] Can upload image in admin
- [ ] Subscribe form works
- [ ] Contact form submits

## Troubleshooting

### "Unable to load featured posts"
- Check browser console (F12)
- Verify API_URL in config.js
- Test API URL directly in browser: `[YOUR_API_URL]?action=getPosts&page=1`

### "Invalid credentials" on admin login
- Check email/password in Admins sheet
- Ensure no extra spaces
- Verify SHEET_ID in Code.gs

### Images not uploading
- Verify DRIVE_FOLDER_ID in Code.gs
- Ensure folder is shared publicly
- Check image is under 5MB

### Newsletter not sending
- Verify you have test subscribers in Subscribers sheet
- Check Gmail quota (100/day for free accounts)
- Look at Apps Script execution logs

## Adding More Test Data

### Add More Posts
In your Google Sheet "Posts", add rows with:
```
2 | Building Faith Daily | building-faith-daily | <p>How to strengthen your faith through daily practices.</p> | Devotionals | https://via.placeholder.com/800x400 | Admin | published | false | 2024-01-02T00:00:00.000Z | 2024-01-02T00:00:00.000Z

3 | Christian Living Guide | christian-living-guide | <p>Practical tips for living as a Christian in modern world.</p> | Christian Living | https://via.placeholder.com/800x400 | Admin | published | false | 2024-01-03T00:00:00.000Z | 2024-01-03T00:00:00.000Z
```

### Add Test Subscribers
In "Subscribers" sheet:
```
1 | test@example.com | active | 2024-01-01T00:00:00.000Z
2 | test2@example.com | active | 2024-01-02T00:00:00.000Z
```

## Next Steps

Once everything works locally:

1. **Deploy to Production**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md) for full deployment guide
   - Deploy to Netlify, Vercel, or GitHub Pages

2. **Customize**
   - Change colors in `/styles/main.css`
   - Update About page content
   - Add your own posts

3. **Go Live**
   - Configure custom domain
   - Set up analytics
   - Start publishing content!

## Need Help?

- Read full [DEPLOYMENT.md](DEPLOYMENT.md)
- Check [README.md](README.md)
- Review browser console for errors
- Check Apps Script execution logs

---

**You're all set! Start creating content and sharing faith! 🙏**
