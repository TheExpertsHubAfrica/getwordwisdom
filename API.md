# API Documentation

Complete API reference for the GetWordWisdom backend (Google Apps Script).

## Base URL

```
https://script.google.com/macros/s/[YOUR_DEPLOYMENT_ID]/exec
```

## Request Format

All requests are POST requests with JSON body:

```javascript
{
    "action": "ACTION_NAME",
    "param1": "value1",
    "param2": "value2"
}
```

## Response Format

All responses follow this structure:

**Success:**
```json
{
    "success": true,
    "data": { /* response data */ }
}
```

**Error:**
```json
{
    "success": false,
    "error": "Error message"
}
```

---

## Public Endpoints

These endpoints can be called without authentication.

### Get Posts

Get paginated list of published posts.

**Action:** `getPosts`

**Parameters:**
- `page` (number, required) - Page number (starts at 1)

**Request:**
```json
{
    "action": "getPosts",
    "page": 1
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "posts": [
            {
                "postId": "1",
                "title": "Welcome to GetWordWisdom",
                "slug": "welcome-to-getwordwisdom",
                "content": "<p>Post content...</p>",
                "category": "Faith",
                "featuredImage": "https://...",
                "author": "Admin",
                "status": "published",
                "isFeatured": "true",
                "createdDate": "2024-01-01T00:00:00.000Z",
                "updatedDate": "2024-01-01T00:00:00.000Z"
            }
        ],
        "total": 1
    }
}
```

**Notes:**
- Only returns posts with `status = "published"`
- Posts per page defined by `POSTS_PER_PAGE` in Code.gs (default: 9)
- Posts ordered by `createdDate` DESC (newest first)

---

### Get Featured Posts

Get all featured posts for homepage.

**Action:** `getFeaturedPosts`

**Parameters:** None

**Request:**
```json
{
    "action": "getFeaturedPosts"
}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "postId": "1",
            "title": "Welcome Post",
            "slug": "welcome-post",
            "content": "<p>Content...</p>",
            "category": "Faith",
            "featuredImage": "https://...",
            "author": "Admin",
            "createdDate": "2024-01-01T00:00:00.000Z"
        }
    ]
}
```

**Notes:**
- Returns posts where `isFeatured = "true"` and `status = "published"`
- Limited to 3 posts
- Ordered by `createdDate` DESC

---

### Get Post by Slug

Get a single post by its URL slug.

**Action:** `getPostBySlug`

**Parameters:**
- `slug` (string, required) - Post URL slug

**Request:**
```json
{
    "action": "getPostBySlug",
    "slug": "welcome-to-getwordwisdom"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "postId": "1",
        "title": "Welcome to GetWordWisdom",
        "slug": "welcome-to-getwordwisdom",
        "content": "<p>Full content...</p>",
        "category": "Faith",
        "featuredImage": "https://...",
        "author": "Admin",
        "status": "published",
        "isFeatured": "true",
        "createdDate": "2024-01-01T00:00:00.000Z",
        "updatedDate": "2024-01-01T00:00:00.000Z"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": "Post not found"
}
```

**Notes:**
- Only returns published posts
- Returns 404 if post not found or is draft

---

### Get Posts by Category

Get posts filtered by category with pagination.

**Action:** `getPostsByCategory`

**Parameters:**
- `category` (string, required) - Category name
- `page` (number, required) - Page number

**Request:**
```json
{
    "action": "getPostsByCategory",
    "category": "Faith",
    "page": 1
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "posts": [ /* array of posts */ ],
        "total": 5
    }
}
```

**Notes:**
- Case-sensitive category matching
- Only returns published posts
- Same pagination as `getPosts`

---

### Get Category Counts

Get post count for each category.

**Action:** `getCategoryCounts`

**Parameters:** None

**Request:**
```json
{
    "action": "getCategoryCounts"
}
```

**Response:**
```json
{
    "success": true,
    "data": {
        "Faith": 10,
        "Devotionals": 25,
        "Christian Living": 8,
        "Teachings": 15,
        "Wisdom": 12
    }
}
```

**Notes:**
- Only counts published posts
- Returns 0 for categories with no posts

---

### Subscribe to Newsletter

Add email to subscriber list.

**Action:** `subscribe`

**Parameters:**
- `email` (string, required) - Subscriber email address

**Request:**
```json
{
    "action": "subscribe",
    "email": "user@example.com"
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "message": "Successfully subscribed!"
    }
}
```

**Error Responses:**
```json
{
    "success": false,
    "error": "Email is required"
}
```
```json
{
    "success": false,
    "error": "Invalid email address"
}
```
```json
{
    "success": false,
    "error": "Email already subscribed"
}
```

**Notes:**
- Validates email format
- Checks for existing subscriptions
- Sends welcome email via Gmail
- Sets status to "active"

---

### Submit Contact Form

Submit contact form message.

**Action:** `submitContact`

**Parameters:**
- `name` (string, required) - Sender name
- `email` (string, required) - Sender email
- `subject` (string, required) - Message subject
- `message` (string, required) - Message content

**Request:**
```json
{
    "action": "submitContact",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Question about devotionals",
    "message": "I have a question..."
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "message": "Message sent successfully!"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": "All fields are required"
}
```

**Notes:**
- Validates all fields are present
- Validates email format
- Sends email to `ADMIN_EMAIL` configured in Code.gs

---

## Admin Endpoints

These endpoints require admin authentication token.

### Admin Login

Authenticate admin user and get session token.

**Action:** `adminLogin`

**Parameters:**
- `email` (string, required) - Admin email
- `password` (string, required) - Admin password

**Request:**
```json
{
    "action": "adminLogin",
    "email": "admin@example.com",
    "password": "password123"
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "token": "YWRtaW5AZXhhbXBsZS5jb206MTcwNjgyNDgwMDAwMA==",
        "email": "admin@example.com"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": "Invalid credentials"
}
```

**Notes:**
- Token is base64 encoded: `email:timestamp`
- Token valid for 24 hours
- Store token for subsequent admin requests

---

### Verify Admin Session

Check if admin session token is still valid.

**Action:** `verifyAdminSession`

**Parameters:**
- `token` (string, required) - Admin session token

**Request:**
```json
{
    "action": "verifyAdminSession",
    "token": "YWRtaW5AZXhhbXBsZS5jb206MTcwNjgyNDgwMDAwMA=="
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "valid": true,
        "email": "admin@example.com"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": "Invalid or expired token"
}
```

**Notes:**
- Tokens expire after 24 hours
- Call this on admin page load to verify session

---

### Get All Posts (Admin)

Get all posts including drafts.

**Action:** `adminGetAllPosts`

**Parameters:**
- `token` (string, required) - Admin session token

**Request:**
```json
{
    "action": "adminGetAllPosts",
    "token": "YWRtaW5AZXhhbXBsZS5jb206MTcwNjgyNDgwMDAwMA=="
}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "postId": "1",
            "title": "Post Title",
            "slug": "post-title",
            "content": "<p>Content...</p>",
            "category": "Faith",
            "featuredImage": "https://...",
            "author": "Admin",
            "status": "published",
            "isFeatured": "true",
            "createdDate": "2024-01-01T00:00:00.000Z",
            "updatedDate": "2024-01-01T00:00:00.000Z"
        }
    ]
}
```

**Notes:**
- Returns ALL posts (published and draft)
- Requires valid admin token
- Ordered by `createdDate` DESC

---

### Save Post (Admin)

Create new post or update existing post.

**Action:** `adminSavePost`

**Parameters:**
- `token` (string, required) - Admin session token
- `postId` (string, optional) - Post ID (empty for new post)
- `title` (string, required) - Post title
- `slug` (string, required) - URL slug
- `content` (string, required) - Post content (HTML)
- `category` (string, required) - Category name
- `featuredImage` (string, required) - Image URL
- `author` (string, required) - Author name
- `status` (string, required) - "published" or "draft"
- `isFeatured` (string, required) - "true" or "false"

**Request (Create New):**
```json
{
    "action": "adminSavePost",
    "token": "...",
    "postId": "",
    "title": "New Post Title",
    "slug": "new-post-title",
    "content": "<p>Post content here...</p>",
    "category": "Faith",
    "featuredImage": "https://drive.google.com/...",
    "author": "Admin",
    "status": "published",
    "isFeatured": "false"
}
```

**Request (Update Existing):**
```json
{
    "action": "adminSavePost",
    "token": "...",
    "postId": "1",
    "title": "Updated Title",
    "slug": "updated-title",
    // ... other fields
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "message": "Post saved successfully",
        "postId": "1"
    }
}
```

**Notes:**
- If `postId` is empty, creates new post with auto-generated ID
- If `postId` exists, updates that post
- Updates `updatedDate` automatically
- If `isFeatured = "true"`, sends newsletter to all active subscribers
- Newsletter sent asynchronously to avoid timeout

---

### Delete Post (Admin)

Delete a post by ID.

**Action:** `adminDeletePost`

**Parameters:**
- `token` (string, required) - Admin session token
- `postId` (string, required) - Post ID to delete

**Request:**
```json
{
    "action": "adminDeletePost",
    "token": "...",
    "postId": "1"
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "message": "Post deleted successfully"
    }
}
```

**Error Response:**
```json
{
    "success": false,
    "error": "Post not found"
}
```

**Notes:**
- Permanently deletes post from sheet
- Cannot be undone
- Does not delete associated images from Drive

---

### Upload Image (Admin)

Upload image to Google Drive and get public URL.

**Action:** `adminUploadImage`

**Parameters:**
- `token` (string, required) - Admin session token
- `fileName` (string, required) - File name with extension
- `mimeType` (string, required) - MIME type (e.g., "image/jpeg")
- `base64Data` (string, required) - Base64 encoded image data

**Request:**
```json
{
    "action": "adminUploadImage",
    "token": "...",
    "fileName": "image.jpg",
    "mimeType": "image/jpeg",
    "base64Data": "/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "url": "https://drive.google.com/uc?export=view&id=1abc123..."
    }
}
```

**Notes:**
- Uploads to folder specified by `DRIVE_FOLDER_ID` in Code.gs
- Returns direct view URL for use in `<img>` tags
- File must be base64 encoded
- Recommended max size: 5MB

---

### Get All Subscribers (Admin)

Get all newsletter subscribers.

**Action:** `adminGetSubscribers`

**Parameters:**
- `token` (string, required) - Admin session token

**Request:**
```json
{
    "action": "adminGetSubscribers",
    "token": "..."
}
```

**Response:**
```json
{
    "success": true,
    "data": [
        {
            "subscriberId": "1",
            "email": "user@example.com",
            "status": "active",
            "dateSubscribed": "2024-01-01T00:00:00.000Z"
        }
    ]
}
```

**Notes:**
- Returns all subscribers (active and unsubscribed)
- Ordered by `dateSubscribed` DESC

---

### Toggle Subscriber Status (Admin)

Toggle subscriber between active and unsubscribed.

**Action:** `adminToggleSubscriber`

**Parameters:**
- `token` (string, required) - Admin session token
- `subscriberId` (string, required) - Subscriber ID

**Request:**
```json
{
    "action": "adminToggleSubscriber",
    "token": "...",
    "subscriberId": "1"
}
```

**Success Response:**
```json
{
    "success": true,
    "data": {
        "message": "Subscriber status updated",
        "newStatus": "unsubscribed"
    }
}
```

**Notes:**
- Toggles between "active" and "unsubscribed"
- Does not delete subscriber record

---

## Error Handling

### Common Errors

**Authentication Errors:**
```json
{
    "success": false,
    "error": "Invalid or expired token"
}
```

**Validation Errors:**
```json
{
    "success": false,
    "error": "Email is required"
}
```

**Not Found Errors:**
```json
{
    "success": false,
    "error": "Post not found"
}
```

**Server Errors:**
```json
{
    "success": false,
    "error": "Internal server error: [details]"
}
```

### HTTP Status Codes

All responses return HTTP 200 OK. Check the `success` field in JSON to determine success/failure.

---

## Rate Limits

### Google Apps Script Limits

- **Execution time:** 6 minutes max per request
- **URL Fetch calls:** 20,000 per day
- **Email sends:** 100/day (free), 1,500/day (Workspace)

### Recommended Best Practices

1. **Pagination:** Always paginate large datasets
2. **Caching:** Cache responses on frontend
3. **Debouncing:** Debounce search/filter operations
4. **Batch operations:** Combine multiple reads when possible
5. **Error handling:** Implement retry logic for transient errors

---

## Authentication Flow

### Frontend Implementation

```javascript
// 1. Login
const loginResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'adminLogin',
        email: 'admin@example.com',
        password: 'password123'
    })
});
const { success, data } = await loginResponse.json();
if (success) {
    sessionStorage.setItem('admin_token', data.token);
    sessionStorage.setItem('admin_email', data.email);
}

// 2. Verify on page load
const token = sessionStorage.getItem('admin_token');
const verifyResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'verifyAdminSession',
        token: token
    })
});

// 3. Use token for admin operations
const postsResponse = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        action: 'adminGetAllPosts',
        token: token
    })
});
```

---

## Testing the API

### Using curl

```bash
# Get posts
curl -X POST https://script.google.com/.../exec \
  -H "Content-Type: application/json" \
  -d '{"action":"getPosts","page":1}'

# Subscribe
curl -X POST https://script.google.com/.../exec \
  -H "Content-Type: application/json" \
  -d '{"action":"subscribe","email":"test@example.com"}'

# Admin login
curl -X POST https://script.google.com/.../exec \
  -H "Content-Type: application/json" \
  -d '{"action":"adminLogin","email":"admin@test.com","password":"password123"}'
```

### Using Postman

1. Create new request
2. Method: POST
3. URL: Your Apps Script deployment URL
4. Headers: `Content-Type: application/json`
5. Body (raw JSON):
   ```json
   {
       "action": "getPosts",
       "page": 1
   }
   ```
6. Send

---

## Debugging

### Enable Logging

In Code.gs, add logging:

```javascript
Logger.log('Action:', action);
Logger.log('Parameters:', JSON.stringify(params));
```

View logs:
1. Apps Script Editor
2. Click "Executions" (left sidebar)
3. Click on execution to see logs

### Common Issues

**CORS errors:**
- Ensure deployment "Who has access" is set to "Anyone"
- Redeploy if recently changed

**Empty responses:**
- Check sheet names match exactly
- Verify SHEET_ID is correct
- Check data exists in sheets

**Authentication failures:**
- Verify admin credentials in Admins sheet
- Check for extra spaces in cells
- Ensure password matches exactly

---

## Version History

### v1.0.0 (Current)
- Initial API implementation
- Public endpoints for posts, categories, subscribe, contact
- Admin endpoints for full CRUD operations
- Image upload to Google Drive
- Newsletter system

---

## Support

For API issues:
1. Check Apps Script execution logs
2. Verify request format matches documentation
3. Test with curl or Postman first
4. Review [DEPLOYMENT.md](DEPLOYMENT.md) for configuration

---

**API documentation complete. Happy coding! 🚀**
