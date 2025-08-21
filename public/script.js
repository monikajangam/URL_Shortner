// DOM Elements
const shortenForm = document.getElementById('shortenForm');
const originalUrlInput = document.getElementById('originalUrl');
const shortenBtn = document.getElementById('shortenBtn');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const error = document.getElementById('error');
const shortUrlInput = document.getElementById('shortUrl');
const copyBtn = document.getElementById('copyBtn');
const originalUrlDisplay = document.getElementById('originalUrlDisplay');
const clickCount = document.getElementById('clickCount');
const errorMessage = document.getElementById('errorMessage');
const recentUrls = document.getElementById('recentUrls');
const urlsList = document.getElementById('urlsList');

// State
let recentUrlsData = [];

// Event Listeners
shortenForm.addEventListener('submit', handleShortenUrl);
copyBtn.addEventListener('click', copyToClipboard);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadRecentUrls();
});

// Handle URL shortening
async function handleShortenUrl(e) {
    e.preventDefault();
    
    const originalUrl = originalUrlInput.value.trim();
    
    if (!originalUrl) {
        showError('Please enter a URL to shorten');
        return;
    }
    
    // Show loading state
    showLoading();
    hideError();
    hideResult();
    
    try {
        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ originalUrl })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to shorten URL');
        }
        
        // Show result
        showResult(data);
        
        // Add to recent URLs
        addToRecentUrls(data);
        
        // Clear input
        originalUrlInput.value = '';
        
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

// Show loading state
function showLoading() {
    loading.classList.remove('hidden');
    shortenBtn.disabled = true;
    shortenBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Shortening...';
}

// Hide loading state
function hideLoading() {
    loading.classList.add('hidden');
    shortenBtn.disabled = false;
    shortenBtn.innerHTML = '<i class="fas fa-cut"></i> Shorten';
}

// Show result
function showResult(data) {
    shortUrlInput.value = data.shortUrl;
    originalUrlDisplay.textContent = data.originalUrl;
    clickCount.textContent = '0';
    result.classList.remove('hidden');
    
    // Scroll to result
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide result
function hideResult() {
    result.classList.add('hidden');
}

// Show error
function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    
    // Scroll to error
    error.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide error
function hideError() {
    error.classList.add('hidden');
}

// Copy to clipboard
async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(shortUrlInput.value);
        
        // Show success feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
        
    } catch (err) {
        // Fallback for older browsers
        shortUrlInput.select();
        document.execCommand('copy');
        
        // Show success feedback
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        copyBtn.style.background = '#28a745';
        
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
            copyBtn.style.background = '';
        }, 2000);
    }
}

// Load recent URLs
async function loadRecentUrls() {
    try {
        const response = await fetch('/api/urls');
        const data = await response.json();
        
        if (response.ok && data.urls.length > 0) {
            recentUrlsData = data.urls;
            displayRecentUrls();
        }
    } catch (err) {
        console.error('Failed to load recent URLs:', err);
    }
}

// Display recent URLs
function displayRecentUrls() {
    if (recentUrlsData.length === 0) return;
    
    urlsList.innerHTML = '';
    
    // Show only the last 5 URLs
    const recentUrlsToShow = recentUrlsData.slice(-5).reverse();
    
    recentUrlsToShow.forEach(urlData => {
        const urlItem = createUrlItem(urlData);
        urlsList.appendChild(urlItem);
    });
    
    recentUrls.classList.remove('hidden');
}

// Create URL item element
function createUrlItem(urlData) {
    const urlItem = document.createElement('div');
    urlItem.className = 'url-item';
    
    const shortUrlCode = urlData.shortUrl.split('/').pop();
    
    urlItem.innerHTML = `
        <div class="url-item-header">
            <a href="${urlData.shortUrl}" target="_blank" class="short-url">
                ${urlData.shortUrl}
            </a>
            <span class="click-count">${urlData.clicks} clicks</span>
        </div>
        <div class="original-url">${urlData.originalUrl}</div>
    `;
    
    return urlItem;
}

// Add URL to recent URLs
function addToRecentUrls(data) {
    const urlData = {
        shortUrl: data.shortUrl,
        originalUrl: data.originalUrl,
        clicks: 0,
        createdAt: new Date().toISOString()
    };
    
    recentUrlsData.push(urlData);
    
    // Keep only last 10 URLs
    if (recentUrlsData.length > 10) {
        recentUrlsData = recentUrlsData.slice(-10);
    }
    
    displayRecentUrls();
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

// Add some nice animations
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on page load
    const elements = document.querySelectorAll('.shortener-card, .feature-card');
    
    elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Add input validation
originalUrlInput.addEventListener('input', () => {
    const url = originalUrlInput.value.trim();
    
    if (url && !isValidUrl(url)) {
        originalUrlInput.style.borderColor = '#dc3545';
    } else {
        originalUrlInput.style.borderColor = '#e1e5e9';
    }
});

// URL validation helper
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        // If URL doesn't have protocol, try adding https://
        try {
            new URL('https://' + string);
            return true;
        } catch (_) {
            return false;
        }
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + Enter to submit form
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement === originalUrlInput) {
            handleShortenUrl(new Event('submit'));
        }
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        originalUrlInput.value = '';
        hideError();
        hideResult();
        originalUrlInput.focus();
    }
});

// Add auto-focus on page load
window.addEventListener('load', () => {
    originalUrlInput.focus();
});
