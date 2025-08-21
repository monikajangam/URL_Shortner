# URL Shortener

A beginner-friendly URL shortener similar to Bitly, built with Node.js, Express.js, and an in-memory hashmap for storage.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Click Tracking**: Monitor how many times your links are clicked
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Validation**: Instant URL validation and error handling
- **Copy to Clipboard**: One-click copying of shortened URLs
- **Recent URLs**: View your recently shortened URLs
- **Mobile Responsive**: Works perfectly on all devices
- **No Database Required**: Uses in-memory storage for simplicity

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Storage**: In-memory HashMap (Map)
- **Styling**: Custom CSS with modern design
- **Icons**: Font Awesome
- **Fonts**: Inter (Google Fonts)

## 🎯 Usage

### Shortening URLs

1. Open the application in your browser
2. Paste a long URL in the input field
3. Click "Shorten" or press Enter
4. Copy the generated short URL

### API Endpoints

- `POST /api/shorten` - Create a short URL
- `GET /:shortUrl` - Redirect to original URL
- `GET /api/stats/:shortUrl` - Get URL statistics
- `GET /api/urls` - Get all URLs
- `GET /api/health` - Health check
- 

## 🏗️ Project Structure

```
url-shortener/
├── server.js          # Main server file
├── package.json       # Dependencies and scripts
├── README.md         # This file
└── public/           # Frontend files
    ├── index.html    # Main HTML page
    ├── styles.css    # CSS styles
    └── script.js     # Frontend JavaScript
```

## 🔧 How It Works

### Backend (server.js)

1. **URL Generation**: Creates 6-character random strings for short URLs
2. **Storage**: Uses JavaScript Map for in-memory storage
3. **Validation**: Validates URLs and adds protocol if missing
4. **Redirects**: Handles short URL redirections with click tracking
5. **API**: Provides RESTful endpoints for URL management

### Frontend (public/)

1. **User Interface**: Clean, modern design with smooth animations
2. **Form Handling**: Real-time validation and error handling
3. **API Integration**: Communicates with backend via fetch API
4. **Copy Functionality**: One-click URL copying with feedback
5. **Recent URLs**: Displays recently shortened URLs

##  Features in Detail

### URL Shortening
- Generates unique 6-character short URLs
- Validates input URLs
- Automatically adds `https://` if protocol is missing
- Prevents duplicate URLs

### Click Tracking
- Counts clicks for each shortened URL
- Displays click statistics
- Updates in real-time

### User Experience
- Loading states with spinners
- Error handling with user-friendly messages
- Smooth animations and transitions
- Keyboard shortcuts (Ctrl+Enter to submit, Esc to clear)
- Auto-focus on input field

### Responsive Design
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

##  Security Features

- **Input Validation**: Validates all URLs before processing
- **Error Handling**: Comprehensive error handling and user feedback
- **CORS**: Cross-origin resource sharing enabled
- **Helmet**: Security headers for Express.js



- Inspired by Bitly's URL shortening service



If you have any questions or need help, please open an issue on GitHub.

---

**Happy URL Shortening! 🎉**
