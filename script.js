const API_URL = 'http://localhost:5000/api';
let allResults = [];
let activeShopFilters = new Set();

document.addEventListener('DOMContentLoaded', () => {
    loadWebsites();
    
    document.getElementById('searchBtn').addEventListener('click', performSearch);
    document.getElementById('addWebsiteBtn').addEventListener('click', addWebsite);
    document.getElementById('sortSelect').addEventListener('change', applyFiltersAndSort);
    
    // Toggle sidebar
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const mainContent = document.querySelector('.main-content');
    const overlay = document.getElementById('overlay');
    
    function toggleSidebarState() {
        const isActive = sidebar.classList.contains('active');
        
        if (isActive) {
            // Đóng sidebar
            sidebar.classList.remove('active');
            mainContent.classList.remove('shifted');
            overlay.classList.remove('active');
            
            // Đổi icon và text
            toggleBtn.querySelector('i').className = 'fas fa-bars';
            toggleBtn.querySelector('.toggle-btn-text').textContent = 'Menu';
            toggleBtn.style.left = '0';
        } else {
            // Mở sidebar
            sidebar.classList.add('active');
            mainContent.classList.add('shifted');
            overlay.classList.add('active');
            
            // Đổi icon và text
            toggleBtn.querySelector('i').className = 'fas fa-times';
            toggleBtn.querySelector('.toggle-btn-text').textContent = 'Đóng';
            toggleBtn.style.left = '360px';
        }
    }
    
    toggleBtn.addEventListener('click', toggleSidebarState);
    overlay.addEventListener('click', toggleSidebarState);
    
    // Enter để tìm kiếm
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    // Enter để thêm website
    document.getElementById('websiteUrl').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addWebsite();
    });
});

async function loadWebsites() {
    try {
        const response = await fetch(`${API_URL}/websites`);
        const data = await response.json();
        
        const websiteList = document.getElementById('websiteList');
        
        if (data.websites.length === 0) {
            websiteList.innerHTML = `
                <div class="empty-state-sidebar">
                    <i class="fas fa-store" style="font-size: 48px; color: var(--primary-light); margin-bottom: 12px;"></i>
                    <p style="color: var(--gray); font-size: 14px; text-align: center;">Chưa có shop nào<br>Hãy thêm shop để bắt đầu!</p>
                </div>
            `;
            return;
        }
        
        websiteList.innerHTML = data.websites.map((site, index) => `
            <div class="website-item">
                <div class="website-name">${escapeHtml(site.url)}</div>
                <button class="btn-delete" onclick="removeWebsite(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Lỗi khi tải danh sách websites:', error);
    }
}

async function addWebsite() {
    const url = document.getElementById('websiteUrl').value.trim();
    
    if (!url) {
        alert('Vui lòng nhập URL website!');
        return;
    }
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('URL phải bắt đầu bằng http:// hoặc https://');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/websites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url })
        });
        
        const data = await response.json();
        
        if (data.success) {
            document.getElementById('websiteUrl').value = '';
            loadWebsites();
        } else {
            alert(data.error || 'Có lỗi xảy ra!');
        }
    } catch (error) {
        console.error('Lỗi khi thêm website:', error);
        alert('Có lỗi xảy ra khi thêm website!');
    }
}

async function removeWebsite(index) {
    if (!confirm('Bạn có chắc muốn xóa website này?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/websites/${index}`, {
            method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
            loadWebsites();
        } else {
            alert(data.error || 'Có lỗi xảy ra!');
        }
    } catch (error) {
        console.error('Lỗi khi xóa website:', error);
        alert('Có lỗi xảy ra khi xóa website!');
    }
}

async function performSearch() {
    const searchInput = document.getElementById('searchInput').value.trim();
    
    if (!searchInput) {
        alert('Vui lòng nhập tên sản phẩm!');
        return;
    }
    
    // Tách từ khóa thành mảng
    const keywords = searchInput.split(' ').filter(k => k.length > 0);
    
    showLoading(true);
    
    try {
        const response = await fetch(`${API_URL}/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keywords })
        });
        
        const data = await response.json();
        
        if (data.error) {
            document.getElementById('results').innerHTML = 
                `<div class="no-results">${escapeHtml(data.error)}</div>`;
            return;
        }
        
        allResults = data.results || [];
        activeShopFilters.clear();
        
        if (allResults.length > 0) {
            createShopFilters();
            document.getElementById('filterSection').style.display = 'block';
        } else {
            document.getElementById('filterSection').style.display = 'none';
        }
        
        displayResults(allResults);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm:', error);
        document.getElementById('results').innerHTML = 
            '<div class="no-results">Có lỗi xảy ra khi tìm kiếm.<br>Vui lòng thử lại!</div>';
    } finally {
        showLoading(false);
    }
}

function getShopName(url) {
    try {
        const urlObj = new URL(url);
        let shopName = urlObj.hostname.replace('www.', '').split('.')[0];
        return shopName.charAt(0).toUpperCase() + shopName.slice(1);
    } catch (e) {
        return 'Shop';
    }
}

function createShopFilters() {
    const shops = [...new Set(allResults.map(r => r.source))];
    const shopFiltersDiv = document.getElementById('shopFilters');
    
    shopFiltersDiv.innerHTML = shops.map(shop => {
        const shopName = getShopName(shop);
        return `<button class="shop-filter-btn" data-shop="${escapeHtml(shop)}">${shopName}</button>`;
    }).join('');
    
    // Add click handlers
    shopFiltersDiv.querySelectorAll('.shop-filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const shop = btn.dataset.shop;
            if (activeShopFilters.has(shop)) {
                activeShopFilters.delete(shop);
                btn.classList.remove('active');
            } else {
                activeShopFilters.add(shop);
                btn.classList.add('active');
            }
            applyFiltersAndSort();
        });
    });
}

function applyFiltersAndSort() {
    let filtered = [...allResults];
    
    // Apply shop filters
    if (activeShopFilters.size > 0) {
        filtered = filtered.filter(r => activeShopFilters.has(r.source));
    }
    
    // Apply sorting
    const sortBy = document.getElementById('sortSelect').value;
    
    if (sortBy === 'price-asc' || sortBy === 'price-desc') {
        filtered.sort((a, b) => {
            const priceA = parsePrice(a.price);
            const priceB = parsePrice(b.price);
            return sortBy === 'price-asc' ? priceA - priceB : priceB - priceA;
        });
    }
    
    displayResults(filtered);
}

function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const match = priceStr.match(/[\d.,]+/);
    if (!match) return 0;
    return parseFloat(match[0].replace(/[.,]/g, ''));
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    
    if (!results || results.length === 0) {
        resultsDiv.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <h3>Không tìm thấy sản phẩm</h3>
                <p>Thử từ khóa khác hoặc thêm website mới</p>
            </div>
        `;
        return;
    }
    
    const productsHtml = results.map(result => {
        const shopName = getShopName(result.source);
        
        return `
        <div class="product-card">
            <div class="product-badge-shop">${shopName}</div>
            
            <div class="product-image-wrapper">
                ${result.image ? 
                    `<img src="${escapeHtml(result.image)}" alt="${escapeHtml(result.title)}" class="product-image" onerror="this.parentElement.innerHTML='<div class=\\'product-no-image\\'>🎁</div>'">` 
                    : '<div class="product-no-image">🎁</div>'}
            </div>
            
            <div class="product-info">
                <h3 class="product-title">${escapeHtml(result.title)}</h3>
                
                <div class="product-price-wrapper">
                    ${result.price ? 
                        `<div class="product-price-main">${escapeHtml(result.price)}</div>` 
                        : '<div class="product-price-main">Liên hệ</div>'}
                </div>
                
                <div class="product-footer">
                    <div class="product-rating">
                        <i class="fas fa-star"></i>
                        <span>5.0</span>
                    </div>
                    <a href="${escapeHtml(result.link)}" target="_blank" class="product-btn">
                        Xem ngay
                    </a>
                </div>
            </div>
        </div>
    `}).join('');
    
    resultsDiv.innerHTML = productsHtml;
}

function showLoading(show) {
    document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    document.getElementById('results').style.display = show ? 'none' : 'block';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
