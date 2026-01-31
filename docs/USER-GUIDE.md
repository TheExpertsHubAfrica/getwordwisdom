# GetWordWisdom - User Guide & Training Manual

## Table of Contents
1. [Platform Overview](#platform-overview)
2. [Public Website Features](#public-website-features)
3. [Admin Dashboard Training Manual](#admin-dashboard-training-manual)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Platform Overview

**GetWordWisdom** is a Christian blog platform designed to share faith-based content, devotionals, and spiritual teachings with your community. The platform consists of two main parts:

1. **Public Website** - Where readers discover and engage with content
2. **Admin Dashboard** - Where administrators manage content and subscribers

### Key Features
- ✅ Blog post creation and management
- ✅ Newsletter subscription system with automated welcome emails
- ✅ Featured posts on homepage
- ✅ Category-based content organization
- ✅ Contact form for reader inquiries
- ✅ Mobile-responsive design
- ✅ Image upload and management via Google Drive
- ✅ Automated email notifications for new posts

---

## Public Website Features

### 1. Homepage (`/`)
**What Readers See:**
- Featured blog posts prominently displayed
- Latest published posts in a clean grid layout
- Categories section for easy navigation
- Newsletter subscription form
- Quick access to all sections

**Key Elements:**
- Hero section with platform tagline
- "Featured Posts" carousel/grid
- "Latest Posts" section with pagination
- Category links for filtering content

### 2. Blog Page (`/blog/`)
**Functionality:**
- Browse all published blog posts
- Filter posts by category
- Pagination for easy navigation (9 posts per page)
- Click any post to read full content

**User Experience:**
- Search and filter options
- Category badges on each post
- Featured post indicators
- Author and date information

### 3. Individual Post Page (`/blog/post.html`)
**What's Included:**
- Full post content with HTML formatting
- Featured image display
- Author information and publish date
- Category classification
- Related posts suggestions
- Social sharing options (if enabled)

### 4. Categories Page (`/categories/`)
**Purpose:**
- Browse all available content categories
- See post counts per category
- Quick navigation to category-filtered content

**Categories Available:**
- Faith
- Devotionals
- Christian Living
- Teachings
- Wisdom

### 5. Devotionals Page (`/devotionals/`)
**Specialized Section:**
- Dedicated page for daily devotional content
- Filtered to show only "Devotionals" category posts
- Ideal for regular spiritual nourishment

### 6. Subscribe Page (`/subscribe/`)
**Features:**
- Newsletter subscription form
- Benefits of subscribing explained
- Email validation
- Automated welcome email upon subscription
- Privacy notice

**What Happens When Someone Subscribes:**
1. Email is validated and checked for duplicates
2. Subscriber is added to the database
3. Welcome email is sent automatically
4. Subscriber receives notifications about new posts

### 7. Contact Page (`/contact/`)
**Communication Channel:**
- Contact form with name, email, and message fields
- Form validation for data quality
- Messages sent directly to admin email
- Success/error notifications

### 8. About Page (`/about/`)
**Platform Information:**
- Mission and vision statement
- Team information
- Platform values and purpose
- Contact information

---

## Admin Dashboard Training Manual

### Getting Started

#### Accessing the Admin Dashboard

**URL:** `https://yoursite.com/admin/` or `http://localhost:8000/admin/`

**Login Credentials:**
- **Default Email:** `admin@getwordwisdom.com`
- **Default Password:** `ChangeMe123!`

⚠️ **IMPORTANT:** Change the default password immediately after first login!

---

### Dashboard Overview

Once logged in, you'll see the Admin Dashboard with two main sections:

1. **Posts Management** - Create, edit, and delete blog posts
2. **Subscribers Management** - View and manage newsletter subscribers

---

### 1. Posts Management

#### Viewing Posts

The Posts table displays:
- **Title** - Post headline
- **Category** - Content classification
- **Author** - Post creator name
- **Status** - Draft or Published
- **Featured** - Star icon if featured on homepage
- **Date** - Publication/creation date
- **Actions** - Edit (pencil icon) and Delete (trash icon) buttons

#### Creating a New Post

**Step-by-Step Instructions:**

1. **Click "Create New Post" Button**
   - Located at top of Posts section
   - Opens the post editor modal

2. **Fill in Post Details:**

   **Title*** (Required)
   - Enter your blog post headline
   - Keep it clear, compelling, and relevant
   - Example: "Finding Peace in God's Promises"

   **Slug*** (Required)
   - Auto-generated from title
   - URL-friendly version (e.g., "finding-peace-in-gods-promises")
   - Can be manually edited if needed
   - Must be unique for each post

   **Category*** (Required)
   - Select from dropdown:
     - Faith
     - Devotionals
     - Christian Living
     - Teachings
     - Wisdom
   
   **Author*** (Required)
   - Your name or content creator's name
   - Auto-filled with logged-in admin email
   - Can be edited to show preferred author name

   **Featured Image** (Optional)
   - Click "Choose File" to upload an image
   - Supported formats: JPG, PNG, GIF
   - Recommended size: 1200x600px for best display
   - Image uploads to Google Drive automatically
   - Preview shows after upload

   **Content*** (Required)
   - Write your blog post content
   - Supports HTML formatting
   - Use line breaks for paragraphs
   - You can include:
     - `<p>` for paragraphs
     - `<strong>` or `<b>` for bold text
     - `<em>` or `<i>` for italic text
     - `<br>` for line breaks
     - `<ul>` and `<li>` for bullet lists
     - `<blockquote>` for scripture quotes

   **Example Content:**
   ```html
   <p>In times of trouble, we often forget God's promises. But the Bible reminds us in Isaiah 41:10:</p>
   
   <blockquote>"So do not fear, for I am with you; do not be dismayed, for I am your God."</blockquote>
   
   <p>This powerful verse shows us that:</p>
   <ul>
     <li>God is always present with us</li>
     <li>We should not fear the future</li>
     <li>His strength is sufficient for our needs</li>
   </ul>
   ```

   **Status*** (Required)
   - **Draft** - Save without publishing (not visible to public)
   - **Published** - Make live on website immediately

   **Featured Post** (Checkbox)
   - ☑️ Check to display on homepage
   - Use for your most important content
   - Limit to 3-5 featured posts for best display

3. **Save Your Post**
   - Click "Save Post" button
   - Wait for success confirmation
   - Post appears in posts table immediately

**Post Creation Tips:**
- ✅ Write drafts first, review, then publish
- ✅ Use compelling titles that attract readers
- ✅ Include relevant images for visual appeal
- ✅ Keep content focused and well-structured
- ✅ Proofread before publishing
- ✅ Use categories consistently for better organization

#### Editing an Existing Post

1. **Locate the Post** in the posts table
2. **Click the Edit Icon** (pencil) in the Actions column
3. **Modal Opens** with all current post data pre-filled
4. **Make Changes** to any field as needed
5. **Click "Save Post"** to update
6. **Confirmation** appears when successful

**Common Edits:**
- Fix typos or grammar
- Update content with new information
- Change featured status
- Switch between Draft/Published
- Update images
- Modify categories

#### Deleting a Post

⚠️ **WARNING:** Deletion is permanent and cannot be undone!

1. **Click the Delete Icon** (trash) next to the post
2. **Confirmation Modal** appears
3. **Review the post title** to ensure correct selection
4. **Click "Delete"** to confirm, or "Cancel" to abort
5. **Post Removed** from database immediately

**When to Delete:**
- Content is outdated or incorrect
- Duplicate posts
- Test posts
- Violations of content policy

---

### 2. Subscriber Management

#### Viewing Subscribers

The Subscribers section shows:

**Statistics Dashboard:**
- **Total Subscribers** - All subscribers in database
- **Active Subscribers** - Currently subscribed users

**Subscribers Table:**
- **Email** - Subscriber email address
- **Status** - Active or Unsubscribed
- **Date Subscribed** - When they joined
- **Actions** - Delete option

#### Managing Subscribers

**View Subscriber Details:**
- Scroll through the table to see all subscribers
- Check subscription dates
- Monitor active vs. inactive status

**Delete a Subscriber:**
1. Click the **Delete Icon** next to the subscriber
2. Confirm deletion in modal
3. Subscriber removed from database
4. They will no longer receive newsletters

**Important Notes:**
- Subscribers are added automatically via the website form
- Welcome emails are sent automatically upon subscription
- When you publish a new post, active subscribers receive notifications
- Respect privacy - only delete with valid reason

---

### 3. Newsletter Automation

#### How It Works

**When Someone Subscribes:**
1. Visitor fills out subscription form on website
2. Email is validated and checked for duplicates
3. Subscriber added to database with "Active" status
4. **Welcome email sent automatically** containing:
   - Warm welcome message
   - Platform introduction
   - Scripture verse for encouragement
   - Call-to-action to visit the blog

**When You Publish a Post:**
1. Change post status to "Published"
2. Save the post
3. **Newsletter automatically sent to all active subscribers** containing:
   - Post title and category
   - Post excerpt (first 200 characters)
   - Featured image (if available)
   - "Read More" button linking to full post
   - Unsubscribe option

**Email Styling:**
- Professional HTML templates
- Mobile-responsive design
- Branded with GetWordWisdom theme
- Faith-focused design elements
- No spam-like emojis

---

### 4. Image Management

#### Uploading Images

**Process:**
1. Select "Choose File" in the Featured Image field
2. Choose image from your computer
3. Click "Upload" or form auto-uploads
4. Progress bar shows upload status
5. Preview displays when complete
6. Image URL saved with post

**Image Storage:**
- All images stored in Google Drive
- Folder ID configured in backend
- Two URL formats provided:
  - Direct view link (`lh3.googleusercontent.com/d/`)
  - Download link (`drive.google.com/uc`)

**Image Best Practices:**
- Use high-quality images (minimum 1200px wide)
- Optimize file size (under 1MB recommended)
- Relevant to post content
- Properly licensed or original images
- Consistent aspect ratio (16:9 recommended)

#### Default Images

If no image is uploaded, system uses default placeholder:
- Unsplash Christian-themed image
- Professional appearance
- Maintains visual consistency

---

### 5. Admin Account Management

#### Changing Your Password

**In Google Sheets:**
1. Open the spreadsheet (ID in config.js)
2. Navigate to "Admins" sheet
3. Locate your email row
4. Update the password column
5. Save the sheet

⚠️ **Security Note:** Passwords are stored as plain text in the sheet. Keep spreadsheet access restricted!

#### Adding New Admins

1. Open Google Sheets
2. Go to "Admins" sheet
3. Add new row with:
   - Email address
   - Password
   - Admin name
   - Date added
4. Save sheet
5. New admin can now log in

#### Removing Admin Access

1. Open "Admins" sheet
2. Delete the admin's row
3. Save sheet
4. Access revoked immediately

---

## Best Practices

### Content Strategy

**Posting Frequency:**
- Consistent schedule (e.g., Mon/Wed/Fri)
- Quality over quantity
- Plan content calendar in advance

**Content Types:**
- Devotionals for daily inspiration
- Teachings for deeper study
- Christian Living for practical guidance
- Faith stories and testimonies
- Wisdom for life application

**SEO Optimization:**
- Use descriptive, keyword-rich titles
- Write compelling meta descriptions (first paragraph)
- Use relevant categories
- Include scripture references
- Internal linking to related posts

### Subscriber Engagement

**Growing Your List:**
- Promote subscription on social media
- Add call-to-action in every post
- Offer exclusive subscriber content
- Share benefits clearly

**Email Best Practices:**
- Consistent sending schedule
- Valuable content in every email
- Clear subject lines
- Mobile-friendly formatting
- Always include unsubscribe option

### Database Maintenance

**Regular Tasks:**
- Review and remove duplicate posts
- Archive old draft posts
- Clean up test content
- Monitor subscriber growth
- Remove bounced email addresses

---

## Troubleshooting

### Common Issues and Solutions

#### "Cannot Login to Admin Dashboard"

**Solutions:**
1. Verify email and password are correct
2. Check Caps Lock is off
3. Confirm admin exists in "Admins" sheet
4. Clear browser cache and cookies
5. Try different browser

#### "Post Not Appearing on Website"

**Check:**
- Status is set to "Published" (not Draft)
- Browser cache - force refresh (Ctrl+F5 or Cmd+Shift+R)
- Wait 30 seconds for updates to propagate
- Check JavaScript console for errors

#### "Image Not Displaying"

**Solutions:**
1. Verify image uploaded successfully
2. Check Google Drive folder permissions (set to "Anyone with link")
3. Try re-uploading image
4. Use direct image URL format
5. Check file format is JPG, PNG, or GIF

#### "Newsletter Not Sending"

**Verify:**
1. Subscribers have "Active" status
2. Post is marked "Published"
3. Gmail API limits not exceeded (500 emails/day)
4. Admin email configured correctly in Code.gs
5. Check Google Apps Script execution logs

#### "Subscriber Can't Subscribe"

**Check:**
1. Email already exists in database
2. Form validation passing
3. API connection working
4. Google Sheets accessible
5. Check browser console for errors

#### "Contact Form Not Working"

**Solutions:**
1. Verify admin email in Code.gs (line ~715)
2. Check API endpoint connectivity
3. Confirm Google Apps Script deployed
4. Review form validation
5. Check email delivery settings

---

## Technical Support

### Getting Help

**Documentation:**
- Check `/docs` folder for technical documentation
- Review `API.md` for endpoint details
- See `DEPLOYMENT.md` for hosting issues

**Contact Options:**
- Email: support@getwordwisdom.com (configure your support email)
- Check project repository for updates
- Review Google Apps Script logs for errors

### System Requirements

**For Administrators:**
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Google Account access
- Screen resolution: 1024x768 minimum

**For Readers:**
- Any device with web browser
- JavaScript enabled
- Internet connection

---

## Appendix

### Quick Reference

**Admin Login:**
- URL: `/admin/`
- Default: `admin@getwordwisdom.com` / `ChangeMe123!`

**Key URLs:**
- Homepage: `/`
- Blog: `/blog/`
- Subscribe: `/subscribe/`
- Contact: `/contact/`
- Admin: `/admin/`

**Post Statuses:**
- **Draft** - Not visible publicly
- **Published** - Live on website

**Supported Categories:**
- Faith
- Devotionals
- Christian Living
- Teachings
- Wisdom

**Email Triggers:**
- New subscription → Welcome email
- New published post → Newsletter to all active subscribers

---

## Conclusion

GetWordWisdom provides a complete platform for sharing faith-based content with your community. This guide covers all essential features and workflows for successful content management.

**Remember:**
- Regular content updates keep readers engaged
- Quality content builds trust and authority
- Subscriber growth requires consistent effort
- Admin dashboard is your content control center

**May your ministry through GetWordWisdom bring glory to God and bless your readers!**

---

*Last Updated: January 31, 2026*  
*Platform Version: 1.0*
