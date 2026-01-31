# GetWordWisdom

A premium Christian blog platform for sharing faith, wisdom, and daily devotionals. Built with vanilla HTML, CSS, and JavaScript, powered by Google Apps Script and Google Sheets as a backend.

![GetWordWisdom](https://img.shields.io/badge/Christian-Blog-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## 🙏 Mission

GetWordWisdom exists to share the timeless truths of God's Word with believers around the world. We provide accessible, meaningful content that encourages spiritual growth, strengthens faith, and inspires believers to live out their calling in Christ.

> *"For the Lord gives wisdom; from his mouth come knowledge and understanding." - Proverbs 2:6*

## ✨ Features

### Public Features
- 📖 **Blog System** - Full-featured blog with categories, featured posts, and pagination
- 🙏 **Daily Devotionals** - Dedicated section for daily spiritual content
- 📧 **Newsletter** - Email subscription system with automated welcome emails
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- 🔍 **Categories** - Organized content by Faith, Devotionals, Christian Living, Teachings, and Wisdom
- 📤 **Social Sharing** - Share posts to Twitter, Facebook, LinkedIn, or copy link
- 📞 **Contact Form** - Easy way for visitors to reach out

### Admin Features
- 🔐 **Secure Login** - Token-based authentication for admins
- ✍️ **Post Management** - Create, edit, and delete blog posts with rich content
- 🖼️ **Image Upload** - Direct upload to Google Drive with automatic URL generation
- ⭐ **Featured Posts** - Toggle featured status for homepage display
- 📊 **Subscriber Management** - View and manage newsletter subscribers
- 📬 **Automated Newsletters** - Automatically send newsletters when featuring a post
- 📈 **Dashboard** - Clean admin interface with post and subscriber overview

## 🛠️ Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom properties, Grid, Flexbox
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **Responsive Design** - Mobile-first approach

### Backend
- **Google Apps Script** - RESTful API endpoints
- **Google Sheets** - Database with 3 sheets (Posts, Subscribers, Admins)
- **Google Drive** - Image hosting and storage
- **Gmail API** - Email delivery for newsletters and notifications

## 📁 Project Structure

```
getwordwisdom/
├── index.html                 # Homepage
├── about/
│   └── index.html            # About page
├── blog/
│   ├── index.html            # Blog listing
│   └── post.html             # Single post view
├── categories/
│   └── index.html            # Categories browser
├── devotionals/
│   └── index.html            # Devotionals listing
├── subscribe/
│   └── index.html            # Newsletter subscription
├── contact/
│   └── index.html            # Contact form
├── admin/
│   ├── login.html            # Admin login
│   └── index.html            # Admin dashboard
├── styles/
│   ├── main.css              # Base styles, typography, components
│   ├── home.css              # Homepage styles
│   ├── about.css             # About page styles
│   ├── blog.css              # Blog listing styles
│   ├── post.css              # Single post styles
│   ├── categories.css        # Categories page styles
│   ├── devotionals.css       # Devotionals styles
│   ├── subscribe.css         # Subscribe page styles
│   ├── contact.css           # Contact form styles
│   ├── admin-login.css       # Admin login styles
│   └── admin.css             # Admin dashboard styles
├── js/
│   ├── config.js             # Configuration constants
│   ├── api.js                # API communication layer
│   ├── utils.js              # Utility functions
│   ├── home.js               # Homepage functionality
│   ├── blog.js               # Blog listing functionality
│   ├── post.js               # Single post functionality
│   ├── categories.js         # Categories functionality
│   ├── devotionals.js        # Devotionals functionality
│   ├── subscribe.js          # Subscription form handling
│   ├── contact.js            # Contact form handling
│   ├── admin-login.js        # Admin authentication
│   └── admin.js              # Admin dashboard functionality
├── google-apps-script/
│   └── Code.gs               # Backend API (Google Apps Script)
├── DEPLOYMENT.md             # Comprehensive deployment guide
└── README.md                 # This file
```

## 🚀 Quick Start

### Prerequisites
- Google Account (for Sheets, Drive, Apps Script)
- Static web hosting (Netlify, Vercel, GitHub Pages, etc.)
- Basic understanding of Google Apps Script

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd getwordwisdom
   ```

2. **Set up Google Sheets**
   - Create a new Google Sheet
   - Create 3 sheets: `Posts`, `Subscribers`, `Admins`
   - Add column headers as specified in `DEPLOYMENT.md`
   - Add your admin credentials to `Admins` sheet

3. **Set up Google Drive**
   - Create a folder for image uploads
   - Set sharing to "Anyone with the link" (Viewer)
   - Note the folder ID

4. **Deploy Google Apps Script**
   - Copy code from `/google-apps-script/Code.gs`
   - Create new Apps Script project
   - Update configuration (Sheet ID, Folder ID)
   - Deploy as web app with "Anyone" access
   - Note the deployment URL

5. **Configure Frontend**
   - Update `/js/config.js` with your API URL
   ```javascript
   const CONFIG = {
       API_URL: 'YOUR_APPS_SCRIPT_URL_HERE',
       // ... rest of config
   };
   ```

6. **Deploy Frontend**
   - Push to GitHub and deploy via Netlify/Vercel, or
   - Upload files to your hosting provider

7. **Test Everything**
   - Follow the testing checklist in `DEPLOYMENT.md`

For detailed step-by-step instructions, see **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## 📖 Usage

### Creating Blog Posts

1. Navigate to `/admin/login.html`
2. Log in with admin credentials
3. Click "Create New Post"
4. Fill in post details:
   - Title (auto-generates slug)
   - Category
   - Content
   - Author name
   - Upload featured image
5. Set as Featured (optional)
6. Set status to "Published"
7. Click "Save Post"

### Managing Subscribers

1. In admin dashboard, click "Subscribers" tab
2. View all subscribers with status
3. Toggle status to unsubscribe users
4. Monitor subscription stats

### Sending Newsletters

Newsletters are automatically sent when you:
1. Create or edit a post
2. Set "Featured" to Yes
3. Save the post

All active subscribers will receive an email with the post preview.

## 🎨 Customization

### Colors

Edit CSS variables in `/styles/main.css`:

```css
:root {
    --color-primary: #2c3e50;      /* Primary color */
    --color-secondary: #8b7355;    /* Secondary color */
    --color-accent: #c9a66b;       /* Accent color */
    --color-text: #333333;         /* Text color */
    --color-text-light: #666666;   /* Light text */
    --color-bg: #ffffff;           /* Background */
    --color-bg-light: #f8f9fa;     /* Light background */
}
```

### Categories

Edit categories in `/js/config.js`:

```javascript
CATEGORIES: [
    'Faith',
    'Devotionals',
    'Christian Living',
    'Teachings',
    'Wisdom'
    // Add more as needed
]
```

### Pagination

Change posts per page in `/js/config.js`:

```javascript
POSTS_PER_PAGE: 9  // Change to 6, 12, etc.
```

## 🔒 Security Considerations

### Current Implementation
- ⚠️ **Passwords stored in plain text** in Google Sheets
- Token-based admin sessions
- Google Apps Script handles CORS automatically
- Session tokens stored in sessionStorage (expires on tab close)

### Recommended Improvements
1. **Implement password hashing** (bcrypt, Argon2)
2. **Add HTTPS requirement** for admin pages
3. **Implement rate limiting** for login attempts
4. **Add CSRF protection** for forms
5. **Regular security audits** of Google Sheets permissions

## 📊 Database Schema

### Posts Sheet
```
postId | title | slug | content | category | featuredImage | author | status | isFeatured | createdDate | updatedDate
```

### Subscribers Sheet
```
subscriberId | email | status | dateSubscribed
```

### Admins Sheet
```
email | passwordHash | role
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue describing the bug
2. **Suggest Features** - Open an issue with your idea
3. **Submit Pull Requests** - Fork, make changes, and submit PR
4. **Improve Documentation** - Fix typos, add examples
5. **Share the Project** - Star the repo and share with others

### Development Guidelines
- Follow existing code style
- Test thoroughly before submitting PR
- Update documentation for new features
- Keep commits atomic and well-described

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙌 Acknowledgments

- Built for the glory of God
- Inspired by the need for accessible Christian content
- Thanks to all contributors and users

## 📧 Contact

For questions, suggestions, or support:
- Use the contact form on the website
- Open an issue on GitHub
- Email: [your-email@example.com]

## 🗺️ Roadmap

### Version 1.0 (Current)
- ✅ Basic blog functionality
- ✅ Admin dashboard
- ✅ Newsletter system
- ✅ Responsive design

### Version 1.1 (Planned)
- [ ] Password hashing implementation
- [ ] Rich text editor for posts
- [ ] Image optimization
- [ ] Search functionality
- [ ] Comments system

### Version 2.0 (Future)
- [ ] User accounts
- [ ] Multi-author support
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] API documentation

## 📚 Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Deployment Guide](DEPLOYMENT.md)

## 💬 Support

If you find this project helpful, please:
- ⭐ Star the repository
- 🐛 Report bugs you find
- 💡 Suggest new features
- 🙏 Pray for the ministry
- 📢 Share with other Christian ministries

---

**"Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom."**  
*- Colossians 3:16*

Made with ❤️ and faith for the Kingdom of God.
