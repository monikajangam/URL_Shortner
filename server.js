const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// In-memory storage using hashmap
const urlDatabase = new Map();
const shortUrlCounter = { count: 1000 }; // Start from 1000 for nicer looking URLs

// Helper function to generate short URL
function generateShortUrl() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let shortUrl = '';
    for (let i = 0; i < 6; i++) {
        shortUrl += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return shortUrl;
}

// Helper function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Routes

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create short URL
app.post('/api/shorten', (req, res) => {
    try {
        const { originalUrl } = req.body;
        
        if (!originalUrl) {
            return res.status(400).json({ 
                error: 'Original URL is required' 
            });
        }

        // Add protocol if missing
        let urlToShorten = originalUrl;
        if (!urlToShorten.startsWith('http://') && !urlToShorten.startsWith('https://')) {
            urlToShorten = 'https://' + urlToShorten;
        }

        // Validate URL
        if (!isValidUrl(urlToShorten)) {
            return res.status(400).json({ 
                error: 'Invalid URL format' 
            });
        }

        // Check if URL already exists
        for (let [shortUrl, data] of urlDatabase.entries()) {
            if (data.originalUrl === urlToShorten) {
                return res.json({
                    originalUrl: urlToShorten,
                    shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}`,
                    message: 'URL already shortened'
                });
            }
        }

        // Generate unique short URL
        let shortUrl;
        do {
            shortUrl = generateShortUrl();
        } while (urlDatabase.has(shortUrl));

        // Store in database
        urlDatabase.set(shortUrl, {
            originalUrl: urlToShorten,
            createdAt: new Date().toISOString(),
            clicks: 0
        });

        res.json({
            originalUrl: urlToShorten,
            shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}`,
            message: 'URL shortened successfully'
        });

    } catch (error) {
        console.error('Error shortening URL:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Redirect short URL to original URL
app.get('/:shortUrl', (req, res) => {
    try {
        const { shortUrl } = req.params;
        
        if (!urlDatabase.has(shortUrl)) {
            return res.status(404).json({ 
                error: 'Short URL not found' 
            });
        }

        const urlData = urlDatabase.get(shortUrl);
        
        // Increment click count
        urlData.clicks += 1;
        urlDatabase.set(shortUrl, urlData);

        // Redirect to original URL
        res.redirect(urlData.originalUrl);

    } catch (error) {
        console.error('Error redirecting URL:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get URL statistics
app.get('/api/stats/:shortUrl', (req, res) => {
    try {
        const { shortUrl } = req.params;
        
        if (!urlDatabase.has(shortUrl)) {
            return res.status(404).json({ 
                error: 'Short URL not found' 
            });
        }

        const urlData = urlDatabase.get(shortUrl);
        
        res.json({
            shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}`,
            originalUrl: urlData.originalUrl,
            clicks: urlData.clicks,
            createdAt: urlData.createdAt
        });

    } catch (error) {
        console.error('Error getting URL stats:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Get all URLs (for admin purposes)
app.get('/api/urls', (req, res) => {
    try {
        const urls = [];
        for (let [shortUrl, data] of urlDatabase.entries()) {
            urls.push({
                shortUrl: `${req.protocol}://${req.get('host')}/${shortUrl}`,
                originalUrl: data.originalUrl,
                clicks: data.clicks,
                createdAt: data.createdAt
            });
        }
        
        res.json({
            totalUrls: urls.length,
            urls: urls
        });

    } catch (error) {
        console.error('Error getting all URLs:', error);
        res.status(500).json({ 
            error: 'Internal server error' 
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        totalUrls: urlDatabase.size
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 URL Shortener server running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📋 All URLs: http://localhost:${PORT}/api/urls`);
});
