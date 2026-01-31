# Postman Testing Guide for GetWordWisdom API

This guide will help you test all endpoints of the GetWordWisdom API using Postman.

## Base URL
```
https://script.google.com/macros/s/AKfycbxjDELBxMngpSb7UDCQnya-fbgvkNXGptEmN6jaf4hb9FF2DKrkhFY8x9LLYGXnUIo2ig/exec
```

---

## 1. PUBLIC ENDPOINTS (GET Requests)

### 1.1 Get All Posts
**Method:** GET  
**URL:** `{{baseUrl}}?action=getPosts&page=1&perPage=9&origin=http://localhost:8000`

**Query Parameters:**
- `action`: `getPosts`
- `page`: `1` (page number)
- `perPage`: `9` (posts per page)
- `origin`: `http://localhost:8000`

**Expected Response:**
```json
{
  "posts": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalPosts": 15,
    "hasMore": true
  }
}
```

---

### 1.2 Get Featured Posts
**Method:** GET  
**URL:** `{{baseUrl}}?action=getFeaturedPosts&limit=5&origin=http://localhost:8000`

**Query Parameters:**
- `action`: `getFeaturedPosts`
- `limit`: `5`
- `origin`: `http://localhost:8000`

**Expected Response:**
```json
{
  "posts": [
    {
      "id": "...",
      "title": "...",
      "slug": "...",
      "excerpt": "...",
      "content": "...",
      "category": "Faith",
      "author": "GetWordWisdom Team",
      "featuredImage": "...",
      "featured": true,
      "published": true,
      "publishedDate": "2026-01-31T..."
    }
  ]
}
```

---

### 1.3 Get Post by Slug
**Method:** GET  
**URL:** `{{baseUrl}}?action=getPostBySlug&slug=walking-by-faith&origin=http://localhost:8000`

**Query Parameters:**
- `action`: `getPostBySlug`
- `slug`: `walking-by-faith` (post slug)
- `origin`: `http://localhost:8000`

**Expected Response:**
```json
{
  "post": {
    "id": "...",
    "title": "Walking by Faith",
    "slug": "walking-by-faith",
    "content": "...",
    "category": "Faith",
    ...
  }
}
```

---

### 1.4 Get Posts by Category
**Method:** GET  
**URL:** `{{baseUrl}}?action=getPostsByCategory&category=Faith&page=1&perPage=9&origin=http://localhost:8000`

**Query Parameters:**
- `action`: `getPostsByCategory`
- `category`: `Faith`
- `page`: `1`
- `perPage`: `9`
- `origin`: `http://localhost:8000`

**Expected Response:**
```json
{
  "posts": [...],
  "category": "Faith",
  "pagination": {...}
}
```

---

### 1.5 Get Category Counts
**Method:** GET  
**URL:** `{{baseUrl}}?action=getCategoryCounts&origin=http://localhost:8000`

**Query Parameters:**
- `action`: `getCategoryCounts`
- `origin`: `http://localhost:8000`

**Expected Response:**
```json
{
  "counts": {
    "Faith": 5,
    "Devotionals": 3,
    "Christian Living": 4,
    "Teachings": 2,
    "Wisdom": 1
  },
  "total": 15
}
```

---

## 2. FORM SUBMISSION ENDPOINTS (POST Requests)

### 2.1 Subscribe to Newsletter
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "subscribe",
  "email": "test@example.com",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Successfully subscribed to the newsletter!"
}
```

---

### 2.2 Submit Contact Form
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "submitContact",
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Website Feedback",
  "message": "Great website! I love the content.",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Your message has been sent successfully!"
}
```

---

## 3. ADMIN AUTHENTICATION (POST Requests)

### 3.1 Admin Login
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminLogin",
  "email": "admin@getwordwisdom.com",
  "password": "ChangeMe123!",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "success": true,
  "token": "1234567890abcdef...",
  "user": {
    "email": "admin@getwordwisdom.com",
    "role": "admin"
  }
}
```

**Note:** Save the `token` value for subsequent admin requests!

---

### 3.2 Verify Admin Session
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "verifyAdminSession",
  "token": "YOUR_TOKEN_HERE",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "valid": true,
  "user": {
    "email": "admin@getwordwisdom.com",
    "role": "admin"
  }
}
```

---

## 4. ADMIN POST MANAGEMENT (POST Requests - Requires Token)

### 4.1 Get All Posts (Admin)
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminGetAllPosts",
  "token": "YOUR_TOKEN_HERE",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "posts": [
    {
      "id": "...",
      "title": "...",
      "published": true,
      "featured": false,
      ...
    }
  ]
}
```

---

### 4.2 Save Post (Create/Update)
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminSavePost",
  "token": "YOUR_TOKEN_HERE",
  "postData": {
    "id": "",
    "title": "Test Post from Postman",
    "slug": "test-post-postman",
    "excerpt": "This is a test post created via Postman",
    "content": "Full content of the test post goes here...",
    "category": "Faith",
    "author": "Admin",
    "featuredImage": "",
    "featured": false,
    "published": true
  },
  "origin": "http://localhost:8000"
}
```

**Notes:**
- Leave `id` empty to create new post
- Include existing `id` to update post

**Expected Response:**
```json
{
  "success": true,
  "message": "Post saved successfully",
  "postId": "1234567890"
}
```

---

### 4.3 Delete Post
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminDeletePost",
  "token": "YOUR_TOKEN_HERE",
  "postId": "1234567890",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Post deleted successfully"
}
```

---

## 5. ADMIN SUBSCRIBER MANAGEMENT (POST Requests - Requires Token)

### 5.1 Get All Subscribers
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminGetSubscribers",
  "token": "YOUR_TOKEN_HERE",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "subscribers": [
    {
      "id": "...",
      "email": "subscriber@example.com",
      "subscribedDate": "2026-01-31T...",
      "status": "active"
    }
  ]
}
```

---

### 5.2 Toggle Subscriber Status
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminToggleSubscriber",
  "token": "YOUR_TOKEN_HERE",
  "subscriberId": "1234567890",
  "status": "inactive",
  "origin": "http://localhost:8000"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Subscriber status updated"
}
```

---

## 6. ADMIN IMAGE UPLOAD (POST Request - Requires Token)

### 6.1 Upload Image
**Method:** POST  
**URL:** `{{baseUrl}}`

**Headers:**
- `Content-Type`: `application/json`

**Body (raw JSON):**
```json
{
  "action": "adminUploadImage",
  "token": "YOUR_TOKEN_HERE",
  "base64Data": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "filename": "test-image.jpg",
  "origin": "http://localhost:8000"
}
```

**Notes:**
- `base64Data` should include the data URL prefix (e.g., `data:image/jpeg;base64,`)
- For testing, use a small image converted to base64

**Expected Response:**
```json
{
  "success": true,
  "imageUrl": "https://drive.google.com/uc?id=..."
}
```

---

## Setting Up Postman Environment

1. Create a new Environment in Postman
2. Add these variables:
   - `baseUrl`: `https://script.google.com/macros/s/AKfycbxjDELBxMngpSb7UDCQnya-fbgvkNXGptEmN6jaf4hb9FF2DKrkhFY8x9LLYGXnUIo2ig/exec`
   - `adminToken`: (empty initially, set after login)
   - `origin`: `http://localhost:8000`

3. After successful login, save the token:
   - Go to Tests tab in the login request
   - Add this script:
   ```javascript
   const response = pm.response.json();
   if (response.success && response.token) {
       pm.environment.set("adminToken", response.token);
   }
   ```

4. Use `{{baseUrl}}` and `{{adminToken}}` in your requests

---

## Quick Testing Checklist

- [ ] Test API health: `GET {{baseUrl}}?action=getPosts`
- [ ] Get featured posts
- [ ] Get posts by category
- [ ] Subscribe to newsletter
- [ ] Submit contact form
- [ ] Admin login (save token)
- [ ] Verify admin session
- [ ] Get all posts (admin)
- [ ] Create new post
- [ ] Update existing post
- [ ] Delete post
- [ ] Get subscribers
- [ ] Toggle subscriber status
- [ ] Upload image

---

## Common Errors

### CORS Error
If you see CORS errors, make sure:
- You've included the `origin` parameter in your requests
- The origin is in the `ALLOWED_ORIGINS` list in Code.gs
- You've redeployed the Apps Script after changes

### Authentication Error
```json
{
  "error": "Unauthorized"
}
```
- Your token is invalid or expired
- Login again to get a fresh token

### Invalid Action Error
```json
{
  "error": "Invalid action or method not allowed"
}
```
- Check that you're using the correct HTTP method (GET vs POST)
- Verify the `action` parameter is correct

---

## Production Testing

To test against production (Vercel), replace the `origin` parameter:
```
"origin": "https://getwordwisdom.vercel.app"
```

Make sure this origin is in the `ALLOWED_ORIGINS` list in your Code.gs file.
