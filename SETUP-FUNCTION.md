# 🚀 Automated Setup Function Guide

The GetWordWisdom backend now includes an **automated setup function** that creates all required Google Sheets with proper structure, headers, and sample data in just one click!

## What It Does

The `setupSheets()` function automatically:

✅ Creates **Posts** sheet with 11 columns and sample welcome post  
✅ Creates **Subscribers** sheet with 4 columns  
✅ Creates **Admins** sheet with 3 columns and default admin account  
✅ Sets proper headers with bold formatting  
✅ Freezes the header rows  
✅ Deletes the default "Sheet1"  
✅ Provides detailed logs of all operations  

## How to Use

### Step 1: Configure

Update these two lines in `Code.gs`:

```javascript
const MAIN_SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'YOUR_FOLDER_ID_HERE';
```

**Where to get these:**
- **Spreadsheet ID:** Create a blank spreadsheet, copy from URL: `https://docs.google.com/spreadsheets/d/[THIS_PART]/edit`
- **Folder ID:** Create a Drive folder, copy from URL: `https://drive.google.com/drive/folders/[THIS_PART]`

### Step 2: Run Setup

1. In Apps Script editor, select **`setupSheets`** from the function dropdown (top center)
2. Click the **Run** button (▶ play icon)
3. Authorize permissions when prompted:
   - Click "Review permissions"
   - Select your Google account
   - Click "Advanced" → "Go to GetWordWisdom API (unsafe)"
   - Click "Allow"
4. Wait for execution to complete (5-10 seconds)

### Step 3: Verify

1. Check the **Execution log** (View → Logs or Ctrl+Enter):
   ```
   ✅ Posts sheet created with sample post
   ✅ Subscribers sheet created
   ✅ Admins sheet created with default admin
   ⚠️  IMPORTANT: Change the default admin password!
   ✅ Deleted default Sheet1
   🎉 Setup complete! All sheets have been created.
   ```

2. Open your Google Spreadsheet - you should see three new sheets:
   - **Posts** (with sample welcome post)
   - **Subscribers** (empty, ready for data)
   - **Admins** (with default admin account)

### Step 4: Update Admin Password

**IMPORTANT:** Change the default admin credentials!

1. Open the **Admins** sheet
2. Row 2 contains: `admin@getwordwisdom.com | ChangeMe123! | admin`
3. Update the email and password to your own
4. Save the spreadsheet

## What Gets Created

### Posts Sheet

| Column | Value |
|--------|-------|
| Headers | postId, title, slug, content, category, featuredImage, author, status, isFeatured, createdDate, updatedDate |
| Sample Post | A "Welcome to GetWordWisdom" post with Faith category and featured status |

### Subscribers Sheet

| Column | Value |
|--------|-------|
| Headers | subscriberId, email, status, dateSubscribed |
| Data | Empty (ready for subscribers) |

### Admins Sheet

| Column | Value |
|--------|-------|
| Headers | email, passwordHash, role |
| Default Admin | admin@getwordwisdom.com / ChangeMe123! / admin |

## Troubleshooting

### Error: "Exception: Spreadsheet not found"

**Solution:** Update `MAIN_SPREADSHEET_ID` with the correct ID from your spreadsheet URL.

### Error: "Sheets already exist"

**Solution:** The function checks if sheets exist and skips them. You'll see "Sheet already exists. Skipping..." in logs. This is safe!

### Error: "Authorization required"

**Solution:** Click "Review permissions" and follow the authorization steps. Apps Script needs permission to:
- View and manage spreadsheets
- View and manage Drive files
- Send email (for newsletters)

### Can't find `setupSheets` function

**Solution:** 
1. Make sure you've saved the script (Ctrl+S / Cmd+S)
2. Refresh the page
3. The function should appear in the dropdown

### Function runs but sheets not created

**Solution:**
1. Check the Execution log for errors
2. Verify the spreadsheet ID is correct
3. Make sure you have edit permissions on the spreadsheet

## Re-running the Function

It's safe to run `setupSheets()` multiple times. The function:
- Checks if each sheet already exists
- Only creates missing sheets
- Never deletes existing data
- Logs which sheets were created vs skipped

## After Setup

Once setup is complete:

1. ✅ Change the default admin password
2. ✅ Add more posts if desired
3. ✅ Deploy the script as a Web App
4. ✅ Update your frontend `config.js` with the API URL
5. ✅ Start using your blog!

## Benefits of Automated Setup

**Old Way (Manual):**
- ❌ 15-20 minutes creating sheets
- ❌ Error-prone column naming
- ❌ Easy to miss required fields
- ❌ No sample data

**New Way (Automated):**
- ✅ 30 seconds to run
- ✅ Perfect column structure every time
- ✅ All required fields included
- ✅ Sample data for testing
- ✅ Consistent setup across installations

## What's Next?

After running the setup function:

1. **Test the API:** Deploy as Web App and test endpoints
2. **Add Content:** Create more blog posts in the Posts sheet
3. **Customize:** Update the sample post or add your own
4. **Deploy Frontend:** Update config.js and deploy to Netlify/Vercel
5. **Launch:** Start sharing faith-building content!

---

**The setup function saves you 15+ minutes and eliminates setup errors. Enjoy! 🎉**
