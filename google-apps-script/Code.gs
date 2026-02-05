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
  COMMENTARIES: 'Commentaries',
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
    
    // ===== CREATE COMMENTARIES SHEET =====
    let commentariesSheet = ss.getSheetByName(SHEET_NAMES.COMMENTARIES);
    if (commentariesSheet) {
      Logger.log('Commentaries sheet already exists. Skipping...');
    } else {
      commentariesSheet = ss.insertSheet(SHEET_NAMES.COMMENTARIES);
      const commentariesHeaders = [
        'commentaryId',
        'book',
        'chapter',
        'verse',
        'dateWritten',
        'content',
        'createdDate'
      ];
      commentariesSheet.getRange(1, 1, 1, commentariesHeaders.length).setValues([commentariesHeaders]);
      commentariesSheet.getRange(1, 1, 1, commentariesHeaders.length).setFontWeight('bold');
      commentariesSheet.setFrozenRows(1);
      
      // Add a sample commentary
      const sampleCommentary = [
        '1',
        'exodus',
        '6',
        '26-27',
        new Date('2017-10-28').toISOString(),
        'These are that Aaron and Moses, to whom the LORD said, Bring out the children of Israel from the land of Egypt according to their armies. It is interesting the double or rather triple repetition above. Initially Aaron was placed before Moses and then Moses was placed ahead. The Holy scriptures is so interesting. Subtle details you would never see if you don\'t look closely.',
        new Date().toISOString()
      ];
      commentariesSheet.getRange(2, 1, 1, sampleCommentary.length).setValues([sampleCommentary]);
      
      Logger.log('✅ Commentaries sheet created with sample commentary');
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
      
      // Commentary endpoints
      case 'adminGetAllCommentaries':
        return handleAdminGetAllCommentaries(data);
      case 'adminSaveCommentary':
        return handleAdminSaveCommentary(data);
      case 'adminDeleteCommentary':
        return handleAdminDeleteCommentary(data);
      case 'getCommentariesByBook':
        return handleGetCommentariesByBook(data);
      case 'getAllCommentaries':
        return handleGetAllCommentaries();
      
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
      case 'getCommentariesByBook':
        return handleGetCommentariesByBook(e.parameter);
      case 'getAllCommentaries':
        return handleGetAllCommentaries();
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
  })).filter(post => {
    // Check if post is published and featured
    // Handle both boolean and string values
    const isFeatured = String(post.isFeatured).toUpperCase() === 'TRUE';
    return post.status === 'published' && isFeatured;
  });
  
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
    const subject = 'Welcome to GetWordWisdom - Your Journey in Faith Begins';
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #faf9f7; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 40px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; }
          .header p { color: #c9a66b; margin: 10px 0 0 0; font-size: 14px; font-style: italic; }
          .content { padding: 40px 30px; color: #333333; line-height: 1.8; }
          .content h2 { color: #2c3e50; font-size: 22px; margin-bottom: 20px; }
          .content p { margin-bottom: 16px; font-size: 16px; }
          .verse-box { background: linear-gradient(135deg, #f0ebe5 0%, #faf9f7 100%); border-left: 4px solid #c9a66b; padding: 20px; margin: 25px 0; border-radius: 8px; }
          .verse-box p { margin: 0; font-style: italic; color: #555555; font-size: 15px; }
          .verse-ref { text-align: right; color: #8b7355; font-size: 14px; font-weight: 600; margin-top: 10px; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #8b7355 0%, #a68968 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3); }
          .footer { background-color: #2c3e50; color: #ffffff; padding: 30px; text-align: center; font-size: 14px; }
          .footer p { margin: 8px 0; opacity: 0.9; }
          .footer a { color: #c9a66b; text-decoration: none; }
          .divider { height: 2px; background: linear-gradient(90deg, transparent, #c9a66b, transparent); margin: 30px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GetWordWisdom</h1>
            <p>Faith &bull; Wisdom &bull; Daily Devotionals</p>
          </div>
          <div class="content">
            <h2>Welcome to Our Community of Faith!</h2>
            <p>Dear Beloved in Christ,</p>
            <p>We are absolutely <strong>thrilled</strong> to welcome you to the GetWordWisdom family! Your decision to join us marks the beginning of an enriching journey of faith, wisdom, and spiritual growth.</p>
            
            <div class="verse-box">
              <p>"For the Lord gives wisdom; from His mouth come knowledge and understanding. He stores up sound wisdom for the upright; He is a shield to those who walk in integrity."</p>
              <div class="verse-ref">&mdash; Proverbs 2:6-7 (ESV)</div>
            </div>
            
            <p>As a subscriber, you'll receive:</p>
            <ul style="margin: 20px 0; padding-left: 25px; line-height: 2;">
              <li><strong>Weekly Devotionals</strong> to strengthen your faith</li>
              <li><strong>Inspiring Articles</strong> on Christian living</li>
              <li><strong>Biblical Wisdom</strong> for daily challenges</li>
              <li><strong>Prayer Insights</strong> and spiritual teachings</li>
            </ul>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="https://getwordwisdom.vercel.app/blog/" class="cta-button">Explore Our Latest Articles</a>
            </div>
            
            <div class="divider"></div>
            
            <p style="font-size: 15px; color: #666;">May God bless you richly as we grow together in faith and wisdom. We're honored to walk alongside you in your spiritual journey.</p>
            
            <p style="margin-top: 30px;"><strong>In Christ's Love,</strong><br>The GetWordWisdom Team</p>
          </div>
          <div class="footer">
            <p><strong>GetWordWisdom</strong></p>
            <p>Sharing faith, wisdom, and devotionals to strengthen your walk with Christ</p>
            <p style="margin-top: 20px; font-size: 12px; opacity: 0.7;">You're receiving this because you subscribed at GetWordWisdom</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const plainBody = `
Welcome to GetWordWisdom!

Dear Beloved in Christ,

We are absolutely thrilled to welcome you to the GetWordWisdom family! Your decision to join us marks the beginning of an enriching journey of faith, wisdom, and spiritual growth.

"For the Lord gives wisdom; from His mouth come knowledge and understanding. He stores up sound wisdom for the upright; He is a shield to those who walk in integrity." - Proverbs 2:6-7 (ESV)

As a subscriber, you'll receive:
* Weekly Devotionals to strengthen your faith
* Inspiring Articles on Christian living
* Biblical Wisdom for daily challenges
* Prayer Insights and spiritual teachings

May God bless you richly as we grow together in faith and wisdom. We're honored to walk alongside you in your spiritual journey.

Explore our articles: https://getwordwisdom.vercel.app/blog/

In Christ's Love,
The GetWordWisdom Team

---
You're receiving this because you subscribed at GetWordWisdom
    `.trim();
    
    GmailApp.sendEmail(email, subject, plainBody, {
      name: 'GetWordWisdom',
      htmlBody: htmlBody
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
    
    const postUrl = `https://getwordwisdom.vercel.app/blog/post.html?slug=${postData.slug}`;
    
    const subject = `New on GetWordWisdom: ${postData.title}`;
    
    const htmlBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { margin: 0; padding: 0; font-family: Georgia, 'Times New Roman', serif; background-color: #faf9f7; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; }
          .header { background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%); padding: 30px 20px; text-align: center; }
          .header h1 { color: #ffffff; margin: 0; font-size: 24px; }
          .badge { display: inline-block; background: #c9a66b; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 12px; margin-top: 10px; font-weight: 600; text-transform: uppercase; }
          .content { padding: 40px 30px; }
          .post-title { color: #2c3e50; font-size: 26px; margin-bottom: 15px; line-height: 1.3; }
          .post-meta { color: #8b7355; font-size: 14px; margin-bottom: 20px; }
          .post-excerpt { color: #555555; line-height: 1.8; font-size: 16px; margin: 20px 0; }
          .cta-button { display: inline-block; background: linear-gradient(135deg, #8b7355 0%, #a68968 100%); color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin: 25px 0; font-weight: 600; box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3); }
          .footer { background-color: #2c3e50; color: #ffffff; padding: 25px; text-align: center; font-size: 13px; }
          .footer p { margin: 5px 0; opacity: 0.9; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>GetWordWisdom</h1>
            <div class="badge">New Article Published</div>
          </div>
          <div class="content">
            <h2 class="post-title">${postData.title}</h2>
            <div class="post-meta">${postData.category} &bull; By ${postData.author}</div>
            <div class="post-excerpt">${excerpt}</div>
            <div style="text-align: center;">
              <a href="${postUrl}" class="cta-button">Read Full Article &rarr;</a>
            </div>
          </div>
          <div class="footer">
            <p><strong>GetWordWisdom</strong></p>
            <p>Sharing faith, wisdom, and devotionals daily</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const plainBody = `
New Article Published on GetWordWisdom!

${postData.title}
Category: ${postData.category} | By ${postData.author}

${excerpt}

Read the full article: ${postUrl}

---
Blessings in Christ,
GetWordWisdom Team
    `.trim();
    
    // Send to each subscriber (in batches to avoid quota limits)
    subscribers.forEach(email => {
      try {
        GmailApp.sendEmail(email, subject, plainBody, {
          name: 'GetWordWisdom',
          htmlBody: htmlBody
        });
      } catch (error) {
        Logger.log(`Error sending to ${email}: ` + error.toString());
      }
    });
  } catch (error) {
    Logger.log('Error sending newsletter: ' + error.toString());
  }
}

// ==================== COMMENTARY ENDPOINTS ====================

/**
 * Get all commentaries for admin
 */
function handleAdminGetAllCommentaries(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const sheet = getSheet(SHEET_NAMES.COMMENTARIES);
  const rows = sheet.getDataRange().getValues();
  
  const commentaries = rows.slice(1).map((row, index) => ({
    id: row[0] || `commentary-${index + 1}`,
    book: row[1],
    chapter: row[2],
    verse: row[3],
    dateWritten: row[4],
    content: row[5],
    createdDate: row[6]
  })).filter(c => c.book); // Filter out empty rows
  
  // Sort by date (newest first)
  commentaries.sort((a, b) => new Date(b.dateWritten) - new Date(a.dateWritten));
  
  return createResponse({ commentaries: commentaries });
}

/**
 * Save commentary (create or update)
 */
function handleAdminSaveCommentary(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const sheet = getSheet(SHEET_NAMES.COMMENTARIES);
  const commentaryData = data.commentaryData;
  
  if (commentaryData.commentaryId) {
    // Update existing commentary
    const rows = sheet.getDataRange().getValues();
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] == commentaryData.commentaryId) {
        sheet.getRange(i + 1, 1, 1, 7).setValues([[
          commentaryData.commentaryId,
          commentaryData.book,
          commentaryData.chapter,
          commentaryData.verse,
          commentaryData.dateWritten,
          commentaryData.content,
          rows[i][6] // Keep original createdDate
        ]]);
        return createResponse({ success: true, message: 'Commentary updated successfully' });
      }
    }
    return createResponse({ error: 'Commentary not found' });
  } else {
    // Create new commentary
    const commentaryId = Utilities.getUuid();
    const now = new Date().toISOString();
    
    sheet.appendRow([
      commentaryId,
      commentaryData.book,
      commentaryData.chapter,
      commentaryData.verse,
      commentaryData.dateWritten,
      commentaryData.content,
      now
    ]);
    
    return createResponse({ success: true, message: 'Commentary created successfully', commentaryId: commentaryId });
  }
}

/**
 * Delete commentary
 */
function handleAdminDeleteCommentary(data) {
  if (!verifyAdminToken(data.token)) {
    return createResponse({ error: 'Unauthorized' });
  }
  
  const sheet = getSheet(SHEET_NAMES.COMMENTARIES);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] == data.commentaryId) {
      sheet.deleteRow(i + 1);
      return createResponse({ success: true, message: 'Commentary deleted successfully' });
    }
  }
  
  return createResponse({ error: 'Commentary not found' });
}

/**
 * Get commentaries by book (public endpoint)
 */
function handleGetCommentariesByBook(data) {
  const book = data.book;
  
  if (!book) {
    return createResponse({ error: 'Book parameter required' });
  }
  
  const sheet = getSheet(SHEET_NAMES.COMMENTARIES);
  const rows = sheet.getDataRange().getValues();
  
  const commentaries = rows.slice(1).map((row, index) => ({
    id: row[0] || `commentary-${index + 1}`,
    book: row[1],
    chapter: row[2],
    verse: row[3],
    dateWritten: row[4],
    content: row[5],
    createdDate: row[6]
  })).filter(c => c.book === book);
  
  // Sort by chapter and verse
  commentaries.sort((a, b) => {
    const chapterA = parseInt(a.chapter) || 0;
    const chapterB = parseInt(b.chapter) || 0;
    if (chapterA !== chapterB) return chapterA - chapterB;
    
    // Parse verse numbers (handle ranges like "26-27")
    const verseA = parseInt((a.verse || '').split('-')[0]) || 0;
    const verseB = parseInt((b.verse || '').split('-')[0]) || 0;
    return verseA - verseB;
  });
  
  return createResponse({ commentaries: commentaries, book: book });
}

/**
 * Get all commentaries grouped by book (public endpoint)
 */
function handleGetAllCommentaries() {
  const sheet = getSheet(SHEET_NAMES.COMMENTARIES);
  const rows = sheet.getDataRange().getValues();
  
  const commentaries = rows.slice(1).map((row, index) => ({
    id: row[0] || `commentary-${index + 1}`,
    book: row[1],
    chapter: row[2],
    verse: row[3],
    dateWritten: row[4],
    content: row[5],
    createdDate: row[6]
  })).filter(c => c.book);
  
  // Group by book
  const grouped = {};
  commentaries.forEach(commentary => {
    if (!grouped[commentary.book]) {
      grouped[commentary.book] = [];
    }
    grouped[commentary.book].push(commentary);
  });
  
  // Sort each book's commentaries
  Object.keys(grouped).forEach(book => {
    grouped[book].sort((a, b) => {
      const chapterA = parseInt(a.chapter) || 0;
      const chapterB = parseInt(b.chapter) || 0;
      if (chapterA !== chapterB) return chapterA - chapterB;
      
      const verseA = parseInt((a.verse || '').split('-')[0]) || 0;
      const verseB = parseInt((b.verse || '').split('-')[0]) || 0;
      return verseA - verseB;
    });
  });
  
  return createResponse({ commentaries: grouped });
}
