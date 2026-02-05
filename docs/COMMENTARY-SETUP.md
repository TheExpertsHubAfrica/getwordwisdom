# Bible Commentary Feature - Setup Guide

## Overview
The GetWordWisdom platform now includes a complete Bible commentary management system that allows admins to upload verse-by-verse commentaries for all 66 books of the Bible.

## Features Implemented

### 1. Admin Dashboard
- **New "Commentaries" section** in the sidebar navigation
- Upload form with fields for:
  - Bible book (dropdown with all 66 books)
  - Chapter (optional, for book introductions)
  - Verse or verse range (e.g., "6:26-27", "8:19")
  - Date written
  - Commentary content (supports multiple paragraphs)
- Table view of all commentaries with:
  - Book name
  - Chapter and verse reference
  - Date
  - Content preview
  - Edit and Delete actions

### 2. Public Commentary Page
- Browse all commentaries or filter by specific book
- Commentaries grouped by Bible book
- Cards showing reference, date, and preview
- "Read Full Commentary" button opens modal with complete text
- Responsive design for all devices

### 3. Homepage Bible Navigator
- Grid of all 66 Bible books (Old Testament and New Testament)
- Click any book to view commentaries for that book
- Direct navigation to `/commentary/?book=exodus` (example)

### 4. Backend (Google Apps Script)
- New "Commentaries" sheet created automatically
- API endpoints for:
  - Admin: Get all, create, update, delete commentaries
  - Public: Get commentaries by book, get all commentaries grouped

## Google Apps Script Setup

### Step 1: Update the Script
1. Open your Google Apps Script project
2. Replace the contents of `Code.gs` with the updated code from `google-apps-script/Code.gs`
3. The script now includes:
   - `SHEET_NAMES.COMMENTARIES` in configuration
   - Commentary sheet creation in `setupSheets()`
   - Five new API endpoints for commentary management

### Step 2: Create the Commentaries Sheet
Run the `setupSheets()` function again to create the new "Commentaries" sheet:

1. In the Apps Script editor, select `setupSheets` from the function dropdown
2. Click the Run button (▶)
3. Check your spreadsheet - you should see a new "Commentaries" sheet with these columns:
   - commentaryId
   - book
   - chapter
   - verse
   - dateWritten
   - content
   - createdDate

### Step 3: Deploy the Updated Script
1. Click **Deploy** > **Manage deployments**
2. Click the **Edit** button (pencil icon) on your existing deployment
3. Under "Version", select **New version**
4. Add description: "Added Bible commentary management"
5. Click **Deploy**

## Commentary Format

The system supports the format you provided:

```
EXODUS
Saturday, October 28, 2017  7:03:05 AM
Exodus 6:26-27
A. These [are] that Aaron and Moses, to whom the LORD said...
B. These [are] they which spake to Pharaoh king of Egypt...
C. these [are] that Moses and Aaron.(KJV)
 
It is interesting the double or rather triple repetition above...
```

### How to Enter This Format:

1. **Book**: Select "Exodus" from dropdown
2. **Chapter**: Enter "6"
3. **Verse**: Enter "26-27"
4. **Date Written**: Select "2017-10-28"
5. **Content**: Paste the full commentary text including:
   - Scripture verses
   - Your reflections and observations
   - Any cross-references

## Usage Guide

### For Admins

#### Adding a New Commentary
1. Log in to admin dashboard
2. Click "Commentaries" in sidebar
3. Click "Add New Commentary"
4. Fill in the form:
   - Select Bible book
   - Enter chapter (optional for book introductions)
   - Enter verse or verse range
   - Select date
   - Paste or type your commentary
5. Click "Save Commentary"

#### Editing a Commentary
1. Go to Commentaries section
2. Find the commentary in the table
3. Click "Edit"
4. Make your changes
5. Click "Save Commentary"

#### Deleting a Commentary
1. Go to Commentaries section
2. Find the commentary in the table
3. Click "Delete"
4. Confirm deletion

### For Visitors

#### Browsing All Commentaries
1. Visit `/commentary/` page
2. See all commentaries organized by Bible book
3. Click "Read Full Commentary" to view complete text in modal

#### Viewing Specific Book
1. From homepage, click any Bible book in the "Explore Bible Commentary" section
2. OR visit `/commentary/?book=exodus` (replace with any book)
3. See all commentaries for that specific book

## API Endpoints

### Admin Endpoints (require authentication token)

**Get All Commentaries**
```javascript
API.adminGetAllCommentaries(token)
```

**Save Commentary**
```javascript
API.adminSaveCommentary(token, {
  commentaryId: null, // or ID for update
  book: 'exodus',
  chapter: '6',
  verse: '26-27',
  dateWritten: '2017-10-28',
  content: 'Your commentary text...'
})
```

**Delete Commentary**
```javascript
API.adminDeleteCommentary(token, commentaryId)
```

### Public Endpoints

**Get Commentaries by Book**
```javascript
API.getCommentariesByBook('exodus')
```

**Get All Commentaries**
```javascript
API.getAllCommentaries()
```

## Bulk Import Guide

To import multiple commentaries at once:

1. Prepare a CSV file with columns: book, chapter, verse, dateWritten, content
2. Open Google Sheets Commentaries sheet
3. Copy/paste from your CSV (starting at row 2)
4. Add unique commentaryIds for each row (use formula: `=CONCATENATE("comm-", ROW())`)
5. Add createdDate for each row (use formula: `=NOW()`)

## Troubleshooting

### Commentaries not showing up
- Check that you've deployed the updated Apps Script
- Verify the Commentaries sheet exists and has data
- Check browser console for API errors
- Ensure date format is ISO 8601 (YYYY-MM-DD)

### Admin can't access commentary section
- Clear browser cache and reload
- Check admin token is valid
- Verify Apps Script deployment permissions

### Book filtering not working
- Check URL format: `/commentary/?book=exodus` (lowercase, hyphens for spaces)
- Verify book slugs match dropdown values exactly

## Book Slug Reference

All 66 Bible books use these slugs:

**Old Testament:**
genesis, exodus, leviticus, numbers, deuteronomy, joshua, judges, ruth, 1-samuel, 2-samuel, 1-kings, 2-kings, 1-chronicles, 2-chronicles, ezra, nehemiah, esther, job, psalms, proverbs, ecclesiastes, song-of-solomon, isaiah, jeremiah, lamentations, ezekiel, daniel, hosea, joel, amos, obadiah, jonah, micah, nahum, habakkuk, zephaniah, haggai, zechariah, malachi

**New Testament:**
matthew, mark, luke, john, acts, romans, 1-corinthians, 2-corinthians, galatians, ephesians, philippians, colossians, 1-thessalonians, 2-thessalonians, 1-timothy, 2-timothy, titus, philemon, hebrews, james, 1-peter, 2-peter, 1-john, 2-john, 3-john, jude, revelation

## Next Steps

1. **Test the system**: Add a few sample commentaries through the admin dashboard
2. **Import existing commentaries**: Use the bulk import method for your existing Exodus commentaries
3. **Verify display**: Check the public commentary page and book filtering
4. **Customize styling**: Adjust CSS in `styles/commentary.css` if needed

## Support

For issues or questions, refer to:
- Main documentation: `docs/USER-GUIDE.md`
- API documentation: `docs/API.md`
- Admin help: Visit `/admin/help.html`
