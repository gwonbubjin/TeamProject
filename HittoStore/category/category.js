/**
 * 카테고리 페이지 JavaScript
 */

// 메인 페이지의 products 객체를 사용함
// 카테고리별 상품 데이터는 ../js/main.js에 정의되어 있음

// 카테고리 타입에 따른 제목 매핑
const categoryTitles = {
  glove: '글러브/미트',
  bat: '배트',
  ball: '야구공',
  clothing: '의류/잠바',
  shoes: '신발/스파이크',
  equipment: '장비용품'
};

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
  // URL에서 카테고리 타입 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const categoryType = urlParams.get('type') || 'glove'; // 기본값은 글러브/미트
  
  // 카테고리 제목 설정
  const categoryTitle = document.getElementById('category-title');
  categoryTitle.textContent = categoryTitles[categoryType] || '전체 상품';
  
  // 상품 로드
  loadProducts(categoryType);
  
  // 정렬 옵션 변경 이벤트
  const sortOptions = document.getElementById('sort-options');
  sortOptions.addEventListener('change', () => {
    loadProducts(categoryType, sortOptions.value);
  });
  
  // 뷰 모드 변경 이벤트
  const gridViewBtn = document.querySelector('.grid-view');
  const listViewBtn = document.querySelector('.list-view');
  const productList = document.querySelector('.product-list');
  
  gridViewBtn.addEventListener('click', () => {
    productList.classList.remove('list-view');
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
  });
  
  listViewBtn.addEventListener('click', () => {
    productList.classList.add('list-view');
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
  });
});

/**
 * 상품 로드 함수
 * @param {string} categoryType - 카테고리 타입
 * @param {string} sortBy - 정렬 옵션
 */
function loadProducts(categoryType, sortBy = 'popular') {
  // 카테고리 상품 데이터
  const categoryProducts = window.products ? window.products[categoryType] || [] : [];
  
  // 상품 정렬
  let sortedProducts = [...categoryProducts];
  
  // 정렬 처리
  switch(sortBy) {
    case 'newest':
      // 신상품 우선 정렬 (new 배지가 있는 상품)
      sortedProducts = sortedProducts.sort((a, b) => {
        const aIsNew = a.badges.some(badge => badge.text === 'NEW') ? 1 : 0;
        const bIsNew = b.badges.some(badge => badge.text === 'NEW') ? 1 : 0;
        return bIsNew - aIsNew;
      });
      break;
    case 'price-low':
      sortedProducts = sortedProducts.sort((a, b) => {
        // 문자열 형태의 가격을 숫자로 변환
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return aPrice - bPrice;
      });
      break;
    case 'price-high':
      sortedProducts = sortedProducts.sort((a, b) => {
        // 문자열 형태의 가격을 숫자로 변환
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return bPrice - aPrice;
      });
      break;
    default: // 인기순 (hot 태그가 있는 항목 우선)
      sortedProducts = sortedProducts.sort((a, b) => {
        const aIsHot = a.badges.some(badge => badge.text.toLowerCase().includes('hot') || 
                                           badge.text.includes('인기')) ? 1 : 0;
        const bIsHot = b.badges.some(badge => badge.text.toLowerCase().includes('hot') || 
                                           badge.text.includes('인기')) ? 1 : 0;
        return bIsHot - aIsHot;
      });
      break;
  }
  
  // 카테고리 데이터 변경
  window.products[categoryType] = sortedProducts;
  
  // 메인 페이지의 renderProducts 함수 사용
  if (typeof window.renderProducts === 'function') {
    // 상품 리스트 컨테이너 ID 변경
    const productContainer = document.getElementById('product-container');
    if (productContainer) {
      productContainer.id = 'product-list';
    }
    
    // 메인 페이지 렌더링 함수 호출
    window.renderProducts(categoryType);
  } else {
    // 메인 페이지의 renderProducts 함수가 없는 경우 대체 로직
    renderCategoryProducts(categoryType);
  }
}

/**
 * 카테고리 페이지용 상품 렌더링 함수 (fallback)
 * @param {string} category - 카테고리 타입
 */
function renderCategoryProducts(category) {
  const productContainer = document.getElementById('product-container');
  if (!productContainer) return;
  
  // 상품 목록 비우기
  productContainer.innerHTML = '';
  
  // 카테고리 상품 가져오기
  const categoryProducts = window.products ? window.products[category] || [] : [];
  
  // 상품이 없는 경우
  if (categoryProducts.length === 0) {
    productContainer.innerHTML = '<div class="no-products">상품이 없습니다.</div>';
    return;
  }
  
  // 상품 렌더링 (전체 상품 표시)
  categoryProducts.forEach(product => {
    const productCard = createProductCard(product);
    productContainer.appendChild(productCard);
  });
}

/**
 * 상품 카드 생성 함수 (fallback)
 * @param {Object} product - 상품 데이터
 * @returns {HTMLElement} - 상품 카드 요소
 */
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'item-card';
  
  // 배지 HTML 생성
  const badgesHTML = product.badges && product.badges.length > 0 
    ? product.badges.map(badge => `<span class="badge ${badge.type}">${badge.text}</span>`).join('') 
    : '';
  
  // 이미지 경로 수정 (상대 경로로)
  let imagePath = product.image;
  if (imagePath.startsWith('/')) {
    imagePath = '..' + imagePath;
  }
  
  // 상품 카드 HTML
  card.innerHTML = `
    <div class="product-image">
      <img src="${imagePath}" alt="${product.title}">
      <div class="product-badges">
        ${badgesHTML}
      </div>
      <div class="product-actions">
        <button class="wishlist-btn" onclick="toggleWishlist('${product.id}')">
          <i class="far fa-heart"></i>
        </button>
        <button class="cart-btn" onclick="addToCart('${product.id}')">
          <i class="fas fa-shopping-cart"></i>
        </button>
      </div>
    </div>
    <div class="product-info">
      <h3 class="product-title">${product.title}</h3>
      <div class="product-price">
        <span class="price-sale">${product.priceSale}원</span>
        <span class="price-normal">${product.priceNormal}원</span>
      </div>
      <div class="product-rating">
        <div class="stars">
          ${generateStarsHTML(product.rating || 4.5)}
        </div>
        <span class="review-count">(${product.reviews || Math.floor(Math.random() * 50) + 10})</span>
      </div>
      <div class="product-description-list">
        <p>- 최상급 품질의 소재 사용</p>
        <p>- 인체공학적 디자인으로 편안한 착용감</p>
        <p>- 내구성이 뛰어난 프리미엄 제품</p>
      </div>
      <button class="buy-now-btn">바로 구매</button>
    </div>
  `;
  
  return card;
}

/**
 * 별점 HTML 생성 함수
 * @param {number} rating - 평점 (0~5)
 * @returns {string} - 별점 HTML
 */
function generateStarsHTML(rating) {
  let starsHTML = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  
  // 꽉 찬 별
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<i class="fas fa-star"></i>';
  }
  
  // 반 별
  if (halfStar) {
    starsHTML += '<i class="fas fa-star-half-alt"></i>';
  }
  
  // 빈 별
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<i class="far fa-star"></i>';
  }
  
  return starsHTML;
}

/**
 * 가격 포맷 함수
 * @param {number} price - 가격
 * @returns {string} - 포맷된 가격
 */
function formatPrice(price) {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 위시리스트 토글 함수
 * @param {string} productId - 상품 ID
 */
function toggleWishlist(productId) {
  // 위시리스트 토글 기능 구현
  console.log(`위시리스트 토글: ${productId}`);
  alert('위시리스트에 추가되었습니다.');
}

/**
 * 장바구니 추가 함수
 * @param {string} productId - 상품 ID
 */
function addToCart(productId) {
  // 장바구니 추가 기능 구현
  console.log(`장바구니 추가: ${productId}`);
  alert('장바구니에 추가되었습니다.');
} 