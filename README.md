# 🛍️ Price Compare - Multi-Store Product Price Comparison Tool

A powerful web application that helps you compare product prices across multiple e-commerce websites simultaneously, enabling you to find the best deals quickly and efficiently. Built with Flask (Python) backend and vanilla JavaScript frontend.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Python](https://img.shields.io/badge/python-3.7+-green)
![License](https://img.shields.io/badge/license-MIT-orange)

## � Key  Features

- � **Semart Search Engine**: Search products across multiple stores with a single query
- � **Dynoamic Store Management**: Add/remove e-commerce websites on the fly
- 📊 **Real-time Price Comparison**: Display prices from different stores side by side
- 🎯 **Advanced Filtering**: Filter by store and sort by price (ascending/descending)
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI/UX**: Beautiful gradient design with purple-pink theme
- ⚡ **Fast Performance**: Efficient web scraping with BeautifulSoup4
- 🔄 **Live Updates**: Real-time product data fetching
- 💾 **Persistent Storage**: Store management saved in JSON format
- 🎭 **Smooth Animations**: CSS transitions and hover effects

## 📸 Screenshots

### Desktop View
- 5-column product grid layout
- Sidebar navigation for store management
- Advanced search and filter controls

### Mobile View
- 2-column responsive grid
- Touch-friendly interface
- Overlay sidebar navigation

## 🚀 Installation & Setup

### Prerequisites

- **Python**: Version 3.7 or higher
- **pip**: Python package manager (usually comes with Python)
- **Modern Web Browser**: Chrome, Firefox, Safari, or Edge

### Installation Steps

1. **Clone or Download the Project**
   ```bash
   git clone <repository-url>
   cd price-compare
   ```

2. **Install Required Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
   
   This will install:
   - `Flask==3.0.0` - Web framework
   - `Flask-CORS==4.0.0` - Cross-Origin Resource Sharing
   - `requests==2.31.0` - HTTP library
   - `beautifulsoup4==4.12.2` - HTML parsing

3. **Run the Application**
   
   **Option A: Using Python directly**
   ```bash
   python app.py
   ```
   
   **Option B: Using batch file (Windows CMD)**
   ```bash
   start.bat
   ```
   
   **Option C: Using PowerShell script (Windows)**
   ```powershell
   .\start.ps1
   ```

4. **Access the Application**
   
   Open your web browser and navigate to:
   ```
   http://localhost:5000
   ```
   
   The server will start on port 5000 by default.

### Quick Start Scripts

**Windows (CMD) - start.bat:**
```batch
@echo off
python app.py
pause
```

**Windows (PowerShell) - start.ps1:**
```powershell
python app.py
Read-Host "Press Enter to exit"
```

## 📖 User Guide

### 1. Adding E-commerce Websites

**Step-by-step:**

1. Click the **Menu** button (☰) on the left side of the screen
2. The sidebar will slide open, revealing the store management panel
3. Enter the full URL of the e-commerce website in the input field
   - Example: `https://www.amazon.com`
   - Example: `https://www.ebay.com`
   - Must include `http://` or `https://`
4. Click the **"+ Add Shop"** button
5. The website will appear in the list below
6. You can add multiple stores for comprehensive price comparison

**Removing a Store:**
- Click the trash icon (🗑️) next to any store in the list
- Confirm the deletion when prompted

### 2. Searching for Products

**Basic Search:**

1. Enter the product name in the search box
   - Example: "iPhone 15 Pro"
   - Example: "Samsung Galaxy S24"
   - Example: "MacBook Air M2"
2. Click the **"Search"** button or press **Enter**
3. The system will display a loading spinner while fetching data
4. Results will appear in a 5-column grid layout

**Search Tips:**
- Use specific product names for better results
- Include model numbers when possible
- Try different keyword combinations if no results appear
- The system searches all added stores simultaneously

### 3. Filtering & Sorting Results

**Filter by Store:**
- After search results appear, filter buttons will show at the top
- Click on a store name to view only products from that store
- Click again to deselect and show all results
- Multiple stores can be selected simultaneously

**Sort Options:**
- **Most Relevant**: Default sorting based on keyword match score
- **Price: Low to High**: Cheapest products first
- **Price: High to Low**: Most expensive products first

### 4. Viewing Product Details

**Product Card Information:**
- **Store Badge**: Shows which store the product is from (top-left corner)
- **Product Image**: Visual representation of the product
- **Product Title**: Name of the product (2 lines max)
- **Price**: Displayed in local currency
- **Rating**: Shows 5.0 stars (placeholder)
- **"View Now" Button**: Opens the product page in a new tab

**Interaction:**
- Hover over a card to see elevation effect
- Click the "View Now" button to visit the store's product page
- The link opens in a new browser tab for easy comparison

### 5. Sidebar Navigation

**Toggle Sidebar:**
- Click the menu button to open/close the sidebar
- On desktop: Sidebar pushes content to the right when open
- On mobile: Sidebar overlays the content with a backdrop
- Click the backdrop or close button to dismiss

**Sidebar Features:**
- Logo and branding at the top
- Store management section
- Add new stores
- View and delete existing stores
- Scrollable list for many stores

## 🏗️ Project Structure

```
price-compare/
├── app.py                 # Flask backend server (API & web scraping)
├── index.html             # Main HTML structure
├── style.css              # CSS styling and responsive layout
├── script.js              # Frontend JavaScript logic
├── requirements.txt       # Python dependencies
├── websites.json          # Persistent store list (auto-generated)
├── start.bat             # Windows CMD startup script
├── start.ps1             # Windows PowerShell startup script
└── README.md             # This documentation file
```

### File Descriptions

**app.py** (Backend - 200+ lines)
- Flask web server setup
- RESTful API endpoints
- Web scraping logic with BeautifulSoup
- HTML parsing and data extraction
- Keyword matching algorithm
- JSON file management

**index.html** (Frontend Structure - 130+ lines)
- Semantic HTML5 markup
- Sidebar navigation
- Search interface
- Filter controls
- Product grid container
- Font Awesome icons integration

**style.css** (Styling - 1000+ lines)
- CSS Grid layout system
- Responsive breakpoints
- Custom color scheme (CSS variables)
- Animations and transitions
- Sidebar styling
- Product card design
- Mobile-first approach

**script.js** (Frontend Logic - 300+ lines)
- API communication
- DOM manipulation
- Event handling
- Search functionality
- Filter and sort logic
- Dynamic content rendering
- Error handling

**websites.json** (Data Storage)
- JSON array of store objects
- Auto-created on first store addition
- Persistent storage between sessions
- Example structure:
  ```json
  [
    {"url": "https://store1.com"},
    {"url": "https://store2.com"}
  ]
  ```

## 🔧 Technical Deep Dive

### Backend Architecture (app.py)

#### Flask Server Setup
```python
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup

app = Flask(__name__)
CORS(app)  # Enable cross-origin requests
```

#### API Endpoints

**1. GET /** - Serve Main Page
```python
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')
```

**2. GET /api/websites** - Retrieve Store List
```python
@app.route('/api/websites', methods=['GET'])
def get_websites():
    websites = load_websites()
    return jsonify({'websites': websites})
```

**3. POST /api/websites** - Add New Store
```python
@app.route('/api/websites', methods=['POST'])
def add_website():
    data = request.json
    url = data.get('url', '').strip()
    # Validation and storage logic
    return jsonify({'success': True})
```

**4. DELETE /api/websites/:id** - Remove Store
```python
@app.route('/api/websites/<int:index>', methods=['DELETE'])
def remove_website(index):
    websites = load_websites()
    removed = websites.pop(index)
    save_websites(websites)
    return jsonify({'success': True})
```

**5. POST /api/search** - Search Products
```python
@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    keywords = data.get('keywords', [])
    # Web scraping and data aggregation
    return jsonify({'results': all_results})
```

#### Web Scraping Algorithm

**Step 1: Fetch HTML Content**
```python
headers = {
    'User-Agent': 'Mozilla/5.0 ...',
    'Accept': 'text/html,application/xhtml+xml...'
}
response = requests.get(url, headers=headers, timeout=15)
soup = BeautifulSoup(response.text, 'html.parser')
```

**Step 2: Find Product Containers**
```python
for container in soup.find_all(['div', 'article', 'li'], 
                               class_=re.compile(r'product|item|card', re.I)):
    container_text = container.get_text(separator=' ', strip=True)
```

**Step 3: Calculate Match Score**
```python
def calculate_match_score(text, keywords):
    score = 0
    for keyword in keywords:
        if keyword.lower() in text.lower():
            score += 1
            if text.lower().startswith(keyword.lower()):
                score += 0.5  # Bonus for exact match at start
    return score
```

**Step 4: Extract Product Data**
```python
# Title extraction
title = container.find(['h1', 'h2', 'h3', 'h4', 'a']).get_text(strip=True)

# Price extraction with regex
price_pattern = r'(\d{1,3}(?:[.,]\d{3})+)\s*(?:đ|₫|vnd|$)'
price = re.search(price_pattern, container_text).group(1)

# Image extraction
img_tag = container.find('img')
image = img_tag.get('src') or img_tag.get('data-src')

# Link extraction
link = urljoin(url, container.find('a').get('href'))
```

**Step 5: Sort and Return Results**
```python
potential_products.sort(key=lambda x: x['score'], reverse=True)
return filtered_products[:20]  # Top 20 results
```

### Frontend Architecture (script.js)

#### API Communication Layer

**Fetch Wrapper Functions:**
```javascript
async function loadWebsites() {
    const response = await fetch(`${API_URL}/websites`);
    const data = await response.json();
    renderWebsiteList(data.websites);
}

async function performSearch() {
    const keywords = searchInput.split(' ').filter(k => k.length > 0);
    const response = await fetch(`${API_URL}/search`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ keywords })
    });
    const data = await response.json();
    displayResults(data.results);
}
```

#### State Management

**Global State Variables:**
```javascript
let allResults = [];              // All search results
let activeShopFilters = new Set(); // Selected store filters
const API_URL = 'http://localhost:5000/api';
```

#### Event Handling

**Search Events:**
```javascript
// Button click
document.getElementById('searchBtn').addEventListener('click', performSearch);

// Enter key press
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});
```

**Sidebar Toggle:**
```javascript
function toggleSidebarState() {
    const isActive = sidebar.classList.contains('active');
    if (isActive) {
        sidebar.classList.remove('active');
        toggleBtn.querySelector('i').className = 'fas fa-bars';
        toggleBtn.style.left = '0';
    } else {
        sidebar.classList.add('active');
        toggleBtn.querySelector('i').className = 'fas fa-times';
        toggleBtn.style.left = '360px';
    }
}
```

#### Dynamic Content Rendering

**Product Card Generation:**
```javascript
function displayResults(results) {
    const productsHtml = results.map(result => {
        const shopName = getShopName(result.source);
        return `
            <div class="product-card">
                <div class="product-badge-shop">${shopName}</div>
                <div class="product-image-wrapper">
                    <img src="${result.image}" class="product-image">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${result.title}</h3>
                    <div class="product-price-main">${result.price}</div>
                    <div class="product-footer">
                        <div class="product-rating">
                            <i class="fas fa-star"></i>
                            <span>5.0</span>
                        </div>
                        <a href="${result.link}" class="product-btn">
                            View Now
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    document.getElementById('results').innerHTML = productsHtml;
}
```

#### Filter and Sort Logic

**Shop Filtering:**
```javascript
function applyFiltersAndSort() {
    let filtered = [...allResults];
    
    // Apply shop filters
    if (activeShopFilters.size > 0) {
        filtered = filtered.filter(r => activeShopFilters.has(r.source));
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sortSelect').value;
    if (sortBy === 'price-asc') {
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortBy === 'price-desc') {
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }
    
    displayResults(filtered);
}
```

### CSS Architecture (style.css)

#### CSS Variables (Design Tokens)

```css
:root {
    /* Primary Colors */
    --primary: #8b5cf6;           /* Purple */
    --primary-dark: #7c3aed;      /* Dark Purple */
    --primary-light: #a78bfa;     /* Light Purple */
    --secondary: #ec4899;         /* Pink */
    
    /* Utility Colors */
    --accent: #06b6d4;            /* Cyan */
    --success: #10b981;           /* Green */
    --danger: #f43f5e;            /* Red */
    
    /* Background Colors */
    --dark: #0f172a;              /* Dark Blue */
    --dark-card: #1e293b;         /* Card Background */
    --dark-hover: #334155;        /* Hover State */
    
    /* Text Colors */
    --gray: #94a3b8;              /* Gray Text */
    --white: #f8fafc;             /* White Text */
}
```

#### Grid Layout System

**Desktop (5 columns):**
```css
.results {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
}
```

**Responsive Breakpoints:**
```css
/* Large Desktop (>1600px) - 5 columns */
@media (max-width: 1600px) {
    .results { grid-template-columns: repeat(4, 1fr); }
}

/* Desktop (1280-1600px) - 4 columns */
@media (max-width: 1280px) {
    .results { grid-template-columns: repeat(3, 1fr); }
}

/* Tablet (768-1024px) - 2 columns */
@media (max-width: 1024px) {
    .results { grid-template-columns: repeat(2, 1fr); }
}

/* Mobile (<768px) - 2 columns */
@media (max-width: 768px) {
    .results { 
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }
}
```

#### Component Styling

**Product Card:**
```css
.product-card {
    background: rgba(30, 41, 59, 0.9);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(139, 92, 246, 0.15);
    border-radius: 12px;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    height: 100%;
}

.product-card:hover {
    transform: translateY(-4px);
    border-color: rgba(139, 92, 246, 0.4);
    box-shadow: 0 12px 24px rgba(139, 92, 246, 0.3);
}
```

**Sidebar Animation:**
```css
.sidebar {
    transform: translateX(-100%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.sidebar.active {
    transform: translateX(0);
}
```

#### Animations

**Fade In:**
```css
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
```

**Floating Effect:**
```css
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}
```

**Shimmer Effect:**
```css
@keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}
```

## 🎨 UI/UX Design

### Color Scheme

**Primary Gradient:**
- Start: `#8b5cf6` (Purple)
- End: `#ec4899` (Pink)
- Usage: Buttons, badges, highlights

**Background:**
- Base: `linear-gradient(135deg, #0f172a 0%, #1e293b 100%)`
- Cards: `rgba(30, 41, 59, 0.9)` with blur

**Text:**
- Primary: `#f8fafc` (White)
- Secondary: `#94a3b8` (Gray)
- Accent: `#a78bfa` (Light Purple)

### Typography

**Font Family:**
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Font Sizes:**
- Heading: 42px (Desktop), 24px (Mobile)
- Product Title: 13px
- Price: 20px
- Button: 12px

### Spacing System

**Padding:**
- Container: 40px (Desktop), 16px (Mobile)
- Card: 12px
- Button: 8px 16px

**Gap:**
- Grid: 20px (Desktop), 12px (Mobile)
- Flex: 8px

### Component Hierarchy

```
App Container
├── Overlay (Mobile only)
├── Sidebar
│   ├── Header (Logo)
│   ├── Store Management
│   │   ├── Add Form
│   │   └── Store List
│   └── Toggle Button
└── Main Content
    ├── Search Section
    │   ├── Icon
    │   ├── Title
    │   └── Search Box
    ├── Filter Section
    │   ├── Shop Filters
    │   └── Sort Dropdown
    └── Results Section
        ├── Loading Spinner
        ├── Empty State
        └── Product Grid
            └── Product Cards
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### 1. Module Not Found Error

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
```bash
pip install -r requirements.txt
```

#### 2. Port Already in Use

**Error:**
```
OSError: [Errno 48] Address already in use
```

**Solution:**
Change port in `app.py`:
```python
if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change to 5001 or any available port
```

#### 3. No Products Found

**Possible Causes:**
- Website structure changed
- Website blocks scraping
- Invalid URL format
- Network connectivity issues

**Solutions:**
- Verify the website URL is correct
- Try different keywords
- Check if the website requires login
- Add more stores to increase results

#### 4. Images Not Loading

**Causes:**
- Lazy loading on source website
- Relative image URLs
- CORS restrictions
- Broken image links

**Solutions:**
- Images may load after clicking "View Now"
- Some websites protect images
- Try different stores

#### 5. Slow Search Performance

**Causes:**
- Multiple stores being scraped
- Slow network connection
- Large HTML pages

**Solutions:**
- Reduce number of stores
- Use faster internet connection
- Wait for results to load completely

#### 6. Sidebar Not Opening

**Solution:**
- Hard refresh: `Ctrl + Shift + R`
- Clear browser cache
- Check browser console for errors

#### 7. CSS Not Loading

**Solution:**
```bash
# Clear browser cache
# Or add cache-busting parameter
<link rel="stylesheet" href="style.css?v=2">
```

## 📝 Important Notes

### Legal & Ethical Considerations

⚠️ **Important:**
- This tool is for **personal use and educational purposes only**
- Respect the Terms of Service of each website
- Do not send excessive requests (rate limiting)
- Some websites may block web scraping
- Always check robots.txt before scraping
- Consider using official APIs when available

### Limitations

- **Dynamic Content**: Websites using JavaScript rendering may not work
- **Authentication**: Cannot scrape pages requiring login
- **Rate Limiting**: Too many requests may result in IP blocking
- **Structure Changes**: Website redesigns may break scraping
- **CAPTCHA**: Cannot bypass CAPTCHA challenges

### Best Practices

✅ **Do:**
- Use reasonable request intervals
- Respect robots.txt
- Cache results when possible
- Handle errors gracefully
- Test with a few stores first

❌ **Don't:**
- Spam requests
- Scrape personal data
- Violate Terms of Service
- Use for commercial purposes without permission
- Overload servers

## 🔒 Security Considerations

### Input Validation

**URL Validation:**
```python
if not url.startswith('http://') and not url.startswith('https://'):
    return jsonify({'error': 'Invalid URL'}), 400
```

**XSS Prevention:**
```javascript
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
```

### CORS Configuration

```python
from flask_cors import CORS
CORS(app)  # Enable for development
```

**Production:** Configure specific origins:
```python
CORS(app, origins=['https://yourdomain.com'])
```

## 🚀 Performance Optimization

### Backend Optimization

**1. Request Timeout:**
```python
response = requests.get(url, timeout=15)  # 15 second timeout
```

**2. Limit Results:**
```python
return filtered_products[:20]  # Top 20 results only
```

**3. Efficient Parsing:**
```python
# Use specific selectors instead of searching entire DOM
containers = soup.find_all('div', class_='product-item', limit=50)
```

### Frontend Optimization

**1. Debounce Search:**
```javascript
let searchTimeout;
function debouncedSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 500);
}
```

**2. Lazy Loading Images:**
```html
<img loading="lazy" src="image.jpg">
```

**3. Minimize DOM Manipulation:**
```javascript
// Build HTML string first, then insert once
resultsDiv.innerHTML = productsHtml;
```

## 🎯 Future Enhancements

### Planned Features

- [ ] **Search History**: Save and recall previous searches
- [ ] **Price Tracking**: Monitor price changes over time
- [ ] **Price Alerts**: Notify when price drops below threshold
- [ ] **Export Results**: Download comparison as CSV/Excel
- [ ] **Multi-language Support**: i18n implementation
- [ ] **Dark/Light Mode**: Theme switcher
- [ ] **Favorites**: Save products for later
- [ ] **Advanced Filters**: Brand, category, rating filters
- [ ] **Price Charts**: Visualize price trends
- [ ] **Browser Extension**: Quick search from any page
- [ ] **Mobile App**: Native iOS/Android apps
- [ ] **API Integration**: Use official store APIs
- [ ] **User Accounts**: Save preferences and history
- [ ] **Social Sharing**: Share deals with friends
- [ ] **Coupon Integration**: Find and apply discount codes

### Technical Improvements

- [ ] **Caching**: Redis for faster repeated searches
- [ ] **Database**: PostgreSQL for better data management
- [ ] **Queue System**: Celery for background scraping
- [ ] **Docker**: Containerization for easy deployment
- [ ] **CI/CD**: Automated testing and deployment
- [ ] **Monitoring**: Error tracking with Sentry
- [ ] **Analytics**: User behavior tracking
- [ ] **SEO**: Meta tags and sitemap
- [ ] **PWA**: Progressive Web App features
- [ ] **WebSockets**: Real-time updates

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make Your Changes**
4. **Commit Your Changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
5. **Push to the Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Contribution Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation
- Test your changes
- Write meaningful commit messages

### Areas for Contribution

- Bug fixes
- New features
- Documentation improvements
- UI/UX enhancements
- Performance optimizations
- Test coverage
- Translations

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2024 Price Compare

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support & Contact

### Getting Help

- **Issues**: Report bugs on GitHub Issues
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: support@pricecompare.com (if applicable)

### Useful Links

- **Documentation**: This README
- **Demo**: [Live Demo Link]
- **Repository**: [GitHub Repository]
- **Changelog**: See commit history

## 🙏 Acknowledgments

### Technologies Used

- **Flask** - Python web framework
- **BeautifulSoup4** - HTML parsing
- **Requests** - HTTP library
- **Font Awesome** - Icon library
- **Google Fonts** - Inter font family

### Inspiration

This project was inspired by the need for a simple, open-source price comparison tool that respects user privacy and doesn't require accounts or tracking.

## 📊 Project Statistics

- **Lines of Code**: ~1,500+
- **Files**: 8 core files
- **Languages**: Python, JavaScript, HTML, CSS
- **Dependencies**: 4 Python packages
- **Supported Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Yes (Responsive)

---


