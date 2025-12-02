from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
import json
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

WEBSITES_FILE = 'websites.json'

def load_websites():
    """Đọc danh sách websites từ file"""
    if os.path.exists(WEBSITES_FILE):
        with open(WEBSITES_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_websites(websites):
    """Lưu danh sách websites vào file"""
    with open(WEBSITES_FILE, 'w', encoding='utf-8') as f:
        json.dump(websites, f, ensure_ascii=False, indent=2)

def calculate_match_score(text, keywords):
    """Tính điểm match giữa text và keywords"""
    text_lower = text.lower()
    score = 0
    matched_keywords = []
    
    for keyword in keywords:
        keyword_lower = keyword.lower()
        if keyword_lower in text_lower:
            score += 1
            matched_keywords.append(keyword)
            # Bonus nếu keyword xuất hiện ở đầu
            if text_lower.startswith(keyword_lower):
                score += 0.5
    
    return score, matched_keywords

def search_website(url, keywords):
    """Tìm kiếm sản phẩm từ một website với độ chính xác cao"""
    results = []
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
        }
        
        response = requests.get(url, headers=headers, timeout=15)
        response.encoding = 'utf-8'
        soup = BeautifulSoup(response.text, 'html.parser')
        
        from urllib.parse import urljoin
        import re
        
        print(f"\n{'='*60}")
        print(f"Tìm kiếm: {' + '.join(keywords)} trên {url}")
        print(f"{'='*60}")
        
        # Tìm tất cả các thẻ có thể chứa sản phẩm
        potential_products = []
        
        # Tìm trong các container sản phẩm
        for container in soup.find_all(['div', 'article', 'li'], class_=re.compile(r'product|item|card', re.I)):
            # Lấy tất cả text trong container
            container_text = container.get_text(separator=' ', strip=True)
            
            # Tính điểm match
            score, matched = calculate_match_score(container_text, keywords)
            
            # Chỉ xét nếu match ít nhất 1 từ khóa
            if score == 0:
                continue
            
            # Tìm tiêu đề sản phẩm
            title = ''
            for tag in container.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'a']):
                text = tag.get_text(strip=True)
                if len(text) > 10 and len(text) < 200:
                    # Tính điểm cho title
                    title_score, title_matched = calculate_match_score(text, keywords)
                    if title_score > 0:
                        title = text
                        score = title_score  # Ưu tiên điểm từ title
                        break
            
            if not title:
                continue
            
            # Lấy link
            link = ''
            link_tag = container.find('a', href=True)
            if link_tag:
                href = link_tag.get('href')
                if href and not href.startswith('#') and not href.startswith('javascript:'):
                    link = urljoin(url, href)
            
            # Lấy hình ảnh
            image = ''
            img_tag = container.find('img')
            if img_tag:
                for attr in ['src', 'data-src', 'data-lazy-src', 'data-original', 'data-img', 'data-srcset']:
                    img_url = img_tag.get(attr)
                    if img_url:
                        # Lấy URL đầu tiên nếu là srcset
                        if ' ' in img_url:
                            img_url = img_url.split()[0]
                        if img_url and 'placeholder' not in img_url.lower() and 'loading' not in img_url.lower():
                            image = urljoin(url, img_url)
                            break
            
            # Lấy giá
            price = ''
            price_patterns = [
                r'(\d{1,3}(?:[.,]\d{3})+)\s*(?:đ|₫|vnd|vnđ)',
                r'(\d{1,3}(?:[.,]\d{3})+)',
            ]
            
            for pattern in price_patterns:
                match = re.search(pattern, container_text, re.I)
                if match:
                    price = match.group(1) + 'đ'
                    break
            
            potential_products.append({
                'title': title,
                'price': price,
                'image': image,
                'link': link,
                'source': url,
                'score': score,
                'matched_keywords': matched
            })
        
        # Sắp xếp theo điểm (cao nhất trước)
        potential_products.sort(key=lambda x: x['score'], reverse=True)
        
        # Lấy tất cả sản phẩm có điểm > 0
        filtered_products = [p for p in potential_products if p['score'] > 0]
        
        # Lọc và loại bỏ trùng lặp
        seen_titles = set()
        for product in filtered_products:
            # Chuẩn hóa title để so sánh
            normalized_title = re.sub(r'\s+', ' ', product['title'].lower().strip())
            
            if normalized_title not in seen_titles:
                seen_titles.add(normalized_title)
                results.append({
                    'title': product['title'],
                    'price': product['price'],
                    'image': product['image'],
                    'link': product['link'],
                    'source': url,
                    'description': ''
                })
                
                print(f"✓ [{product['score']:.1f}/{len(keywords)}] {product['title'][:60]}... - {product['price']}")
                
                if len(results) >= 20:
                    break
        
        print(f"\nTổng: {len(results)} sản phẩm\n")
                    
    except Exception as e:
        print(f"✗ Lỗi: {str(e)}\n")
    
    return results

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/style.css')
def style():
    return send_from_directory('.', 'style.css')

@app.route('/script.js')
def script():
    return send_from_directory('.', 'script.js')

@app.route('/api/search', methods=['POST'])
def search():
    """API endpoint để tìm kiếm"""
    data = request.json
    keywords = data.get('keywords', [])
    
    if not keywords:
        return jsonify({'error': 'Vui lòng nhập từ khóa'}), 400
    
    websites = load_websites()
    
    if not websites:
        return jsonify({'error': 'Chưa có website nào. Vui lòng thêm website!'}), 400
    
    all_results = []
    
    for website in websites:
        results = search_website(website['url'], keywords)
        all_results.extend(results)
    
    return jsonify({
        'success': True,
        'count': len(all_results),
        'results': all_results,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/api/websites', methods=['GET'])
def get_websites():
    """Lấy danh sách websites"""
    websites = load_websites()
    return jsonify({'websites': websites})

@app.route('/api/websites', methods=['POST'])
def add_website():
    """Thêm website mới"""
    data = request.json
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'Vui lòng nhập URL'}), 400
    
    if not url.startswith('http://') and not url.startswith('https://'):
        return jsonify({'error': 'URL không hợp lệ'}), 400
    
    websites = load_websites()
    
    # Kiểm tra trùng lặp
    for site in websites:
        if site['url'] == url:
            return jsonify({'error': 'Website này đã tồn tại'}), 400
    
    websites.append({'url': url})
    save_websites(websites)
    
    return jsonify({'success': True, 'message': 'Đã thêm website'})

@app.route('/api/websites/<int:index>', methods=['DELETE'])
def remove_website(index):
    """Xóa website"""
    websites = load_websites()
    
    if index < 0 or index >= len(websites):
        return jsonify({'error': 'Website không tồn tại'}), 404
    
    removed = websites.pop(index)
    save_websites(websites)
    
    return jsonify({'success': True, 'message': f'Đã xóa {removed["url"]}'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
