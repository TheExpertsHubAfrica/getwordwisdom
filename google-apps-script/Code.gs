/**
 * GetWordWisdom - Google Apps Script Backend
 * This script handles all backend operations for the blog platform
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Apps Script project
 * 2. Copy this code into Code.gs
 * 3. Update MAIN_SPREADSHEET_ID below with your spreadsheet ID
 * 4. Update DRIVE_FOLDER_ID with your Google Drive folder ID
 * 5. Run setupSheets() function once to create the sheet structure
 * 6. Deploy as Web App (Execute as: Me, Access: Anyone)
 */

// ==================== CONFIGURATION ====================

const MAIN_SPREADSHEET_ID = '1eq6bioK_hMWP5P0yAgGoYmuR4uOdlVXsT9AicnY1xT0'; // The main spreadsheet ID
const DRIVE_FOLDER_ID = '1OJ9FdUAzJthNM92CTdmXWjR0Ar5h27Z5'; // Folder for images

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://getwordwisdom.vercel.app',
  'http://localhost:8000',
  'http://localhost:5500',
  'http://localhost:5501',
  'http://127.0.0.1:8000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501'
];

// Sheet names (will be created automatically by setupSheets())
const SHEET_NAMES = {
  POSTS: 'Posts',
  SUBSCRIBERS: 'Subscribers',
  ADMINS: 'Admins'
};

// ==================== SETUP FUNCTION ====================

/**
 * Run this function ONCE to set up the Google Sheets structure
 * This will create all necessary sheets with proper headers
 * 
 * To run:
 * 1. Click on "setupSheets" function in the dropdown
 * 2. Click the Run button (▶)
 * 3. Authorize the script when prompted
 * 4. Check the spreadsheet - all sheets should be created
 */
function setupSheets() {
  try {
    const ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
    
    // ===== CREATE POSTS SHEET =====
    let postsSheet = ss.getSheetByName(SHEET_NAMES.POSTS);
    if (postsSheet) {
      Logger.log('Posts sheet already exists. Skipping...');
    } else {
      postsSheet = ss.insertSheet(SHEET_NAMES.POSTS);
      const postsHeaders = [
        'postId', 
        'title', 
        'slug', 
        'content', 
        'category', 
        'featuredImage', 
        'author', 
        'status', 
        'isFeatured', 
        'createdDate', 
        'updatedDate'
      ];
      postsSheet.getRange(1, 1, 1, postsHeaders.length).setValues([postsHeaders]);
      postsSheet.getRange(1, 1, 1, postsHeaders.length).setFontWeight('bold');
      postsSheet.setFrozenRows(1);
      
      // Add a sample post
      const samplePost = [
        '1',
        'Welcome to GetWordWisdom',
        'welcome-to-getwordwisdom',
        '<p>Welcome to GetWordWisdom! We are excited to share faith, wisdom, and daily devotionals with you. This blog is dedicated to helping believers grow in their relationship with Christ.</p><blockquote>"For the Lord gives wisdom; from his mouth come knowledge and understanding." - Proverbs 2:6</blockquote>',
        'Faith',
        'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=800&h=400&fit=crop',
        'Admin',
        'published',
        'true',
        new Date().toISOString(),
        new Date().toISOString()
      ];
      postsSheet.getRange(2, 1, 1, samplePost.length).setValues([samplePost]);
      
      Logger.log('✅ Posts sheet created with sample post');
    }
    
    // ===== CREATE SUBSCRIBERS SHEET =====
    let subscribersSheet = ss.getSheetByName(SHEET_NAMES.SUBSCRIBERS);
    if (subscribersSheet) {
      Logger.log('Subscribers sheet already exists. Skipping...');
    } else {
      subscribersSheet = ss.insertSheet(SHEET_NAMES.SUBSCRIBERS);
      const subscribersHeaders = [
        'subscriberId',
        'email',
        'status',
        'dateSubscribed'
      ];
      subscribersSheet.getRange(1, 1, 1, subscribersHeaders.length).setValues([subscribersHeaders]);
      subscribersSheet.getRange(1, 1, 1, subscribersHeaders.length).setFontWeight('bold');
      subscribersSheet.setFrozenRows(1);
      
      Logger.log('✅ Subscribers sheet created');
    }
    
    // ===== CREATE ADMINS SHEET =====
    let adminsSheet = ss.getSheetByName(SHEET_NAMES.ADMINS);
    if (adminsSheet) {
      Logger.log('Admins sheet already exists. Skipping...');
    } else {
      adminsSheet = ss.insertSheet(SHEET_NAMES.ADMINS);
      const adminsHeaders = [
        'email',
        'passwordHash',
        'role'
      ];
      adminsSheet.getRange(1, 1, 1, adminsHeaders.length).setValues([adminsHeaders]);
      adminsSheet.getRange(1, 1, 1, adminsHeaders.length).setFontWeight('bold');
      adminsSheet.setFrozenRows(1);
      
      // Add default admin (CHANGE THIS PASSWORD!)
      const defaultAdmin = [
        'admin@getwordwisdom.com',
        'ChangeMe123!',
        'admin'
      ];
      adminsSheet.getRange(2, 1, 1, defaultAdmin.length).setValues([defaultAdmin]);
      
      Logger.log('✅ Admins sheet created with default admin');
      Logger.log('⚠️  IMPORTANT: Change the default admin password!');
    }
    
    // ===== DELETE DEFAULT SHEET =====
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet && ss.getSheets().length > 1) {
      ss.deleteSheet(defaultSheet);
      Logger.log('✅ Deleted default Sheet1');
    }
    
    Logger.log('\n🎉 Setup complete! All sheets have been created.');
    Logger.log('\n📋 Next steps:');
    Logger.log('1. Review the Admins sheet and change the default password');
    Logger.log('2. Deploy this script as a Web App');
    Logger.log('3. Update the API_URL in your frontend config.js');
    Logger.log('\n✅ Your GetWordWisdom backend is ready!');
    
    return ContentService.createTextOutput('Setup completed successfully! Check the logs for details.');
    
  } catch (error) {
    Logger.log('❌ Setup error: ' + error.toString());
    return ContentService.createTextOutput('Setup failed: ' + error.toString());
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Get a specific sheet from the main spreadsheet
 */
function getSheet(sheetName) {
  const ss = SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  return ss.getSheetByName(sheetName);
}

// ==================== MAIN HANDLER ====================

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    // Route to appropriate function
    switch (action) {
      // Public endpoints
      case 'getPosts':
        return handleGetPosts(data);
      case 'getFeaturedPosts':
        return handleGetFeaturedPosts(data);
      case 'getPostBySlug':
        return handleGetPostBySlug(data);
      case 'getPostsByCategory':
        return handleGetPostsByCategory(data);
      case 'getCategoryCounts':
        return handleGetCategoryCounts();
      case 'subscribe':
        return handleSubscribe(data);
      case 'submitContact':
        return handleSubmitContact(data);
      
      // Admin endpoints
      case 'adminLogin':
        return handleAdminLogin(data);
      case 'verifyAdminSession':
        return handleVerifyAdminSession(data);
      case 'adminGetAllPosts':
        return handleAdminGetAllPosts(data);
      case 'adminSavePost':
        return handleAdminSavePost(data);
      case 'adminDeletePost':
        return handleAdminDeletePost(data);
      case 'adminUploadImage':
        return handleAdminUploadImage(data);
      case 'adminGetSubscribers':
        return handleAdminGetSubscribers(data);
      case 'adminToggleSubscriber':
        return handleAdminToggleSubscriber(data);
      
      default:
        return createResponse({ error: 'Invalid action' });
    }
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return createResponse({ error: error.toString() });
  }
}

function doGet(e) {
  try {
    // Support GET requests for public endpoints
    const action = e.parameter.action;
    
    if (!action) {
      return createResponse({
        status: 'GetWordWisdom API is running',
        message: 'Use ?action=getPosts to test'
      });
    }
    
    // Route GET requests
    switch (action) {
      case 'getPosts':
        return handleGetPosts(e.parameter);
      case 'getFeaturedPosts':
        return handleGetFeaturedPosts(e.parameter);
      case 'getPostBySlug':
        return handleGetPostBySlug(e.parameter);
      case 'getPostsByCategory':
        return handleGetPostsByCategory(e.parameter);
      case 'getCategoryCounts':
        return handleGetCategoryCounts();
      default:
        return createResponse({ error: 'Invalid action or method not allowed' });
    }
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return createResponse({ error: error.toString() });
  }
}

// ==================== RESPONSE HELPER ====================

function createResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  // Handle CORS preflight requests
  // Google Apps Script automatically handles CORS, but we're being explicit
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ==================== PUBLIC ENDPOINTS ====================

/**
 * Get paginated published posts
 */
function handleGetPosts(data) {
  const page = parseInt(data.page) || 1;
  const perPage = parseInt(data.perPage) || 9;
  const category = data.category || '';
  
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  // Filter published posts
  let posts = rows.slice(1).map((row, index) => ({
    id: row[0] || `post-${index + 1}`,
    title: row[1],
    slug: row[2],
    content: row[3],
    category: row[4],
    featuredImage: row[5],
    author: row[6],
    status: row[7],
    isFeatured: row[8],
    createdDate: row[9],
    updatedDate: row[10]
  })).filter(post => post.status === 'published');
  
  // Filter by category if specified
  if (category) {
    posts = posts.filter(post => post.category === category);
  }
  
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  
  // Paginate
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / perPage);
  const start = (page - 1) * perPage;
  const paginatedPosts = posts.slice(start, start + perPage);
  
  return createResponse({
    posts: paginatedPosts,
    page: page,
    perPage: perPage,
    totalPages: totalPages,
    totalPosts: totalPosts
  });
}

/**
 * Get featured posts
 */
function handleGetFeaturedPosts(data) {
  const limit = parseInt(data.limit) || 5;
  
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  // Filter published and featured posts
  const posts = rows.slice(1).map((row, index) => ({
    id: row[0] || `post-${index + 1}`,
    title: row[1],
    slug: row[2],
    content: row[3],
    category: row[4],
    featuredImage: row[5],
    author: row[6],
    status: row[7],
    isFeatured: row[8],
    createdDate: row[9]
  })).filter(post => post.status === 'published' && post.isFeatured === 'TRUE');
  
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  
  return createResponse({
    posts: posts.slice(0, limit)
  });
}

/**
 * Get single post by slug
 */
function handleGetPostBySlug(data) {
  const slug = data.slug;
  
  if (!slug) {
    return createResponse({ error: 'Slug is required' });
  }
  
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  const post = rows.slice(1).map((row, index) => ({
    id: row[0] || `post-${index + 1}`,
    title: row[1],
    slug: row[2],
    content: row[3],
    category: row[4],
    featuredImage: row[5],
    author: row[6],
    status: row[7],
    isFeatured: row[8],
    createdDate: row[9]
  })).find(p => p.slug === slug && p.status === 'published');
  
  if (!post) {
    return createResponse({ error: 'Post not found' });
  }
  
  return createResponse({ post: post });
}

/**
 * Get posts by category
 */
function handleGetPostsByCategory(data) {
  const category = data.category;
  const page = parseInt(data.page) || 1;
  const perPage = parseInt(data.perPage) || 9;
  
  if (!category) {
    return createResponse({ error: 'Category is required' });
  }
  
  return handleGetPosts({ page, perPage, category });
}

/**
 * Get post count by category
 */
function handleGetCategoryCounts() {
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  const posts = rows.slice(1).filter(row => row[7] === 'published');
  const counts = {};
  
  posts.forEach(row => {
    const category = row[4];
    counts[category] = (counts[category] || 0) + 1;
  });
  
  return createResponse({ counts: counts });
}

/**
 * Subscribe to newsletter
 */
function handleSubscribe(data) {
  const email = data.email;
  
  if (!email || !isValidEmail(email)) {
    return createResponse({ error: 'Valid email is required' });
  }
  
  const sheet = getSheet(SHEET_NAMES.SUBSCRIBERS);
  const rows = sheet.getDataRange().getValues();
  
  // Check if already subscribed
  const exists = rows.slice(1).some(row => row[1] === email);
  if (exists) {
    return createResponse({ error: 'This email is already subscribed' });
  }
  
  // Add subscriber
  const subscriberId = `sub-${Date.now()}`;
  const dateSubscribed = new Date().toISOString();
  sheet.appendRow([subscriberId, email, 'active', dateSubscribed]);
  
  // Send welcome email
  sendWelcomeEmail(email);
  
  return createResponse({ 
    success: true,
    message: 'Successfully subscribed to newsletter' 
  });
}

/**
 * Submit contact form
 */
function handleSubmitContact(data) {
  const { name, email, subject, message } = data;
  
  if (!name || !email || !subject || !message) {
    return createResponse({ error: 'All fields are required' });
  }
  
  if (!isValidEmail(email)) {
    return createResponse({ error: 'Valid email is required' });
  }
  
  // Send email to admin (you can configure this)
  const adminEmail = 'YOUR_ADMIN_EMAIL@example.com'; // Replace with your email
  
  try {
    GmailApp.sendEmail(
      adminEmail,
      `GetWordWisdom Contact: ${subject}`,
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      {
        name: 'GetWordWisdom',
        replyTo: email
      }
    );
    
    return createResponse({ 
      success: true,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    Logger.log('Error sending contact email: ' + error.toString());
    return createResponse({ error: 'Failed to send message' });
  }
}

// ==================== ADMIN ENDPOINTS ====================

/**
 * Admin login
 */
function handleAdminLogin(data) {
  const { email, password } = data;
  
  if (!email || !password) {
    return createResponse({ error: 'Email and password are required' });
  }
  
  const sheet = getSheet(SHEET_NAMES.ADMINS);
  const rows = sheet.getDataRange().getValues();
  
  const admin = rows.slice(1).find(row => row[0] === email);
  
  if (!admin) {
    return createResponse({ error: 'Invalid credentials' });
  }
  
  // Simple password check (in production, use proper hashing)
  const storedPassword = admin[1];
  if (password !== storedPassword) {
    return createResponse({ error: 'Invalid credentials' });
  }
  
  // Generate token (simple timestamp-based token)
  const token = Utilities.base64Encode(email + ':' + Date.now());
  
  // Store token in user properties (session)
  const userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('admin_token_' + token, email);
  
  return createResponse({
    success: true,
    token: token,
    email: email
  });
}

/**
 * Verify admin session
 */
function handleVerifyAdminSession(data) {
  const token = data.token;
  
  if (!token) {
    return createResponse({ error: 'Token is required' });
  }
  
  const userProperties = PropertiesService.getUserProperties();
  const email = userProperties.getProperty('admin_token_' + token);
  
  if (!email) {
    return createResponse({ error: 'Invalid or expired session' });
  }
  
  return createResponse({
    success: true,
    email: email
  });
}

/**
 * Get all posts (admin)
 */
function handleAdminGetAllPosts(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  const posts = rows.slice(1).map((row, index) => ({
    id: row[0] || `post-${index + 1}`,
    title: row[1],
    slug: row[2],
    content: row[3],
    category: row[4],
    featuredImage: row[5],
    author: row[6],
    status: row[7],
    isFeatured: row[8],
    createdDate: row[9],
    updatedDate: row[10]
  }));
  
  // Sort by date (newest first)
  posts.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
  
  return createResponse({ posts: posts });
}

/**
 * Save post (create or update)
 */
function handleAdminSavePost(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const postData = data.postData;
  const sheet = getSheet(SHEET_NAMES.POSTS);
  
  const now = new Date().toISOString();
  
  if (postData.id) {
    // Update existing post
    const rows = sheet.getDataRange().getValues();
    const rowIndex = rows.findIndex(row => row[0] === postData.id);
    
    if (rowIndex > 0) {
      sheet.getRange(rowIndex + 1, 1, 1, 11).setValues([[
        postData.id,
        postData.title,
        postData.slug,
        postData.content,
        postData.category,
        postData.featuredImage,
        postData.author,
        postData.status,
        postData.isFeatured,
        rows[rowIndex][9], // Keep original created date
        now // Updated date
      ]]);
      
      // Send newsletter if published
      if (postData.status === 'published' && rows[rowIndex][7] === 'draft') {
        sendNewPostNewsletter(postData);
      }
    }
  } else {
    // Create new post
    const postId = `post-${Date.now()}`;
    sheet.appendRow([
      postId,
      postData.title,
      postData.slug,
      postData.content,
      postData.category,
      postData.featuredImage,
      postData.author,
      postData.status,
      postData.isFeatured,
      now, // Created date
      now  // Updated date
    ]);
    
    // Send newsletter if published
    if (postData.status === 'published') {
      sendNewPostNewsletter(postData);
    }
  }
  
  return createResponse({ 
    success: true,
    message: 'Post saved successfully' 
  });
}

/**
 * Delete post
 */
function handleAdminDeletePost(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const postId = data.postId;
  const sheet = getSheet(SHEET_NAMES.POSTS);
  const rows = sheet.getDataRange().getValues();
  
  const rowIndex = rows.findIndex(row => row[0] === postId);
  
  if (rowIndex > 0) {
    sheet.deleteRow(rowIndex + 1);
    return createResponse({ 
      success: true,
      message: 'Post deleted successfully' 
    });
  }
  
  return createResponse({ error: 'Post not found' });
}

/**
 * Upload image to Google Drive
 */
function handleAdminUploadImage(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  try {
    const base64Data = data.base64Data;
    const filename = data.filename;
    
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64Data),
      'image/jpeg',
      filename
    );
    
    const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
    const file = folder.createFile(blob);
    
    // Make file publicly accessible
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // Get file ID
    const fileId = file.getId();
    
    // Return multiple URL formats for compatibility
    // The lh3.googleusercontent.com format works better for embedding
    const imageUrl = `https://lh3.googleusercontent.com/d/${fileId}`;
    const alternateUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
    
    return createResponse({
      success: true,
      imageUrl: imageUrl,
      alternateUrl: alternateUrl,
      fileId: fileId,
      message: 'Image uploaded successfully. If image does not display, try using the alternate URL or consider using an image hosting service like Unsplash or ImgBB.'
    });
  } catch (error) {
    Logger.log('Error uploading image: ' + error.toString());
    return createResponse({ error: 'Failed to upload image' });
  }
}

/**
 * Get all subscribers
 */
function handleAdminGetSubscribers(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const sheet = getSheet(SHEET_NAMES.SUBSCRIBERS);
  const rows = sheet.getDataRange().getValues();
  
  const subscribers = rows.slice(1).map((row, index) => ({
    id: row[0] || `sub-${index + 1}`,
    email: row[1],
    status: row[2],
    dateSubscribed: row[3]
  }));
  
  // Sort by date (newest first)
  subscribers.sort((a, b) => new Date(b.dateSubscribed) - new Date(a.dateSubscribed));
  
  return createResponse({ subscribers: subscribers });
}

/**
 * Toggle subscriber status
 */
function handleAdminToggleSubscriber(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const subscriberId = data.subscriberId;
  const newStatus = data.status;
  
  const sheet = getSheet(SHEET_NAMES.SUBSCRIBERS);
  const rows = sheet.getDataRange().getValues();
  
  const rowIndex = rows.findIndex(row => row[0] === subscriberId);
  
  if (rowIndex > 0) {
    sheet.getRange(rowIndex + 1, 3).setValue(newStatus);
    return createResponse({ 
      success: true,
      message: 'Subscriber status updated' 
    });
  }
  
  return createResponse({ error: 'Subscriber not found' });
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Verify admin token
 */
function verifyAdminToken(token) {
  if (!token) return false;
  
  const userProperties = PropertiesService.getUserProperties();
  const email = userProperties.getProperty('admin_token_' + token);
  
  return !!email;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Send welcome email to new subscriber
 */
function sendWelcomeEmail(email) {
  try {
    const subject = 'Welcome to GetWordWisdom';
    const body = `
Thank you for subscribing to GetWordWisdom!

We're thrilled to have you join our community of faith. You'll now receive our latest articles, devotionals, and teachings directly in your inbox.

May God bless you richly as we grow together in faith and wisdom.

In Christ,
GetWordWisdom Team

---
To unsubscribe, please contact us at your-email@example.com
    `.trim();
    
    GmailApp.sendEmail(email, subject, body, {
      name: 'GetWordWisdom'
    });
  } catch (error) {
    Logger.log('Error sending welcome email: ' + error.toString());
  }
}

/**
 * Send newsletter for new published post
 */
function sendNewPostNewsletter(postData) {
  try {
    const sheet = getSheet(SHEET_NAMES.SUBSCRIBERS);
    const rows = sheet.getDataRange().getValues();
    
    // Get active subscribers
    const subscribers = rows.slice(1)
      .filter(row => row[2] === 'active')
      .map(row => row[1]);
    
    if (subscribers.length === 0) {
      return;
    }
    
    // Generate excerpt
    const content = postData.content.replace(/<[^>]*>/g, '');
    const excerpt = content.length > 200 
      ? content.substr(0, 200) + '...' 
      : content;
    
    const postUrl = `YOUR_WEBSITE_URL/blog/post.html?slug=${postData.slug}`;
    
    const subject = `New Post: ${postData.title}`;
    const body = `
A new post has been published on GetWordWisdom!

${postData.title}
Category: ${postData.category}

${excerpt}

Read more: ${postUrl}

---
Blessings,
GetWordWisdom Team

To unsubscribe, please contact us.
    `.trim();
    
    // Send to each subscriber (in batches to avoid quota limits)
    subscribers.forEach(email => {
      try {
        GmailApp.sendEmail(email, subject, body, {
          name: 'GetWordWisdom'
        });
      } catch (error) {
        Logger.log(`Error sending to ${email}: ` + error.toString());
      }
    });
  } catch (error) {
    Logger.log('Error sending newsletter: ' + error.toString());
  }
}
