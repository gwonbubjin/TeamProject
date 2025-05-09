/**
 * HittoStore 신상품 페이지 JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("신상품 페이지 로드됨");
  
  // window.newProducts 데이터 확인
  if (!window.newProducts || window.newProducts.length === 0) {
    console.warn("main.js에서 정의된 window.newProducts가 없거나 비어 있습니다. 기본 데이터를 설정합니다.");
    window.newProducts = [
      {
        id: 'new1',
        title: '공인구 12개 세트 신제품',
        image: '../images/best10.jpg',
        badges: [{type: 'new', text: 'NEW'}, {type: 'hot', text: 'HOT'}],
        priceSale: '48,000',
        priceNormal: '60,000',
        category: 'ball'
      },
      {
        id: 'new2',
        title: '프로급 헬멧 신제품',
        image: '../images/best11.jpg',
        badges: [{type: 'new', text: 'NEW'}, {type: 'hot', text: 'HOT'}],
        priceSale: '128,000',
        priceNormal: '160,000',
        category: 'equipment'
      },
      {
        id: 'new3',
        title: '프로 배팅 장갑 신제품',
        image: '../images/best12.jpg',
        badges: [{type: 'new', text: 'NEW'}],
        priceSale: '89,000',
        priceNormal: '110,000',
        category: 'equipment'
      },
      {
        id: 'new4',
        title: '타자용 팔꿈치 보호대 신제품',
        image: '../images/best13.jpg',
        badges: [{type: 'discount', text: '15%'}, {type: 'new', text: 'NEW'}],
        priceSale: '145,000',
        priceNormal: '170,000',
        category: 'equipment'
      },
      {
        id: 'new5',
        title: '초경량 배팅 헬멧 프리미엄 신제품',
        image: '../images/best14.jpg',
        badges: [{type: 'new', text: 'NEW'}, {type: 'discount', text: '30%'}],
        priceSale: '112,000',
        priceNormal: '160,000',
        category: 'equipment'
      }
    ];
  } else {
    console.log("main.js에서 정의된 window.newProducts가 로드되었습니다:", window.newProducts.length + "개 항목");
  }
  
  // 정렬 옵션 변경 이벤트
  const sortOptions = document.getElementById('sort-options');
  if (sortOptions) {
    sortOptions.addEventListener('change', function() {
      console.log('정렬 옵션 변경:', this.value);
      loadNewProducts(this.value);
    });
  }
  
  // 뷰 모드 변경 이벤트
  const gridViewBtn = document.querySelector('.grid-view');
  const listViewBtn = document.querySelector('.list-view');
  const productList = document.querySelector('.product-list');
  
  if (gridViewBtn && listViewBtn && productList) {
    gridViewBtn.addEventListener('click', function() {
      productList.classList.remove('list-view');
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
    });
    
    listViewBtn.addEventListener('click', function() {
      productList.classList.add('list-view');
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
    });
  }
  
  // 신상품 로드 (기본 정렬: 신상품순)
  loadNewProducts('newest');
});

/**
 * 신상품 로드 함수
 * @param {string} sortBy - 정렬 옵션
 */
function loadNewProducts(sortBy = 'newest') {
  // newProducts 데이터는 main.js에 정의되어 있음
  if (!window.newProducts) {
    console.error('신상품 데이터를 찾을 수 없습니다.');
    return;
  }
  
  // 신상품 데이터 복사
  const newProductsList = [...window.newProducts];
  
  // 정렬 처리
  switch(sortBy) {
    case 'popular':
      // 인기순 정렬 (hot 배지가 있는 상품)
      newProductsList.sort((a, b) => {
        const aIsHot = a.badges && a.badges.some(badge => badge.text.toLowerCase().includes('hot') || 
                                           badge.text.includes('인기')) ? 1 : 0;
        const bIsHot = b.badges && b.badges.some(badge => badge.text.toLowerCase().includes('hot') || 
                                           badge.text.includes('인기')) ? 1 : 0;
        return bIsHot - aIsHot;
      });
      break;
    case 'price-low':
      // 가격 낮은순 정렬
      newProductsList.sort((a, b) => {
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return aPrice - bPrice;
      });
      break;
    case 'price-high':
      // 가격 높은순 정렬
      newProductsList.sort((a, b) => {
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return bPrice - aPrice;
      });
      break;
    default: // 신상품순 (기본값)
      // 이미 신상품 순으로 정렬되어 있으므로 추가 작업 필요 없음
      break;
  }
  
  // 신상품 렌더링
  renderNewProducts(newProductsList);
}

/**
 * 신상품 렌더링 함수
 * @param {Array} products - 신상품 데이터 배열
 */
function renderNewProducts(products) {
  const productList = document.getElementById('new-product-list');
  if (!productList) {
    console.error('상품 목록 컨테이너(#new-product-list)를 찾을 수 없습니다.');
    return;
  }
  
  console.log('상품 렌더링 시작:', products ? products.length + '개 항목' : '데이터 없음');
  
  // products가 제공되지 않은 경우 전역 데이터 사용
  if (!products) {
    products = window.newProducts || [];
    console.log('전역 데이터 사용:', products.length + '개 항목');
  }
  
  // 상품 목록 비우기
  productList.innerHTML = '';
  
  // 상품이 없는 경우
  if (products.length === 0) {
    console.error('렌더링할 상품이 없습니다.');
    productList.innerHTML = '<p class="no-products">신상품이 없습니다.</p>';
    return;
  }
  
  // 신상품 렌더링
  products.forEach(product => {
    console.log('상품 렌더링:', product.id, product.title);
    
    // 배지 HTML 생성
    let badgesHTML = '';
    if (product.badges && product.badges.length > 0) {
      badgesHTML = '<div class="product-badges">';
      product.badges.forEach(badge => {
        badgesHTML += `<span class="badge ${badge.type}">${badge.text}</span>`;
      });
      badgesHTML += '</div>';
    }
    
    // 이미지 경로 수정
    const imagePath = getFixedImagePath(product.image);
    console.log('이미지 경로:', product.image, '->', imagePath);
    
    // 할인율 계산
    const discountRate = getDiscountRate(product.priceNormal, product.priceSale);
    
    // 리뷰 수 생성 (랜덤)
    const reviewCount = Math.floor(Math.random() * 50) + 10;
    
    // 상품 아이템 요소 생성
    const productItem = document.createElement('div');
    productItem.className = 'product-item';
    productItem.innerHTML = `
      <div class="product-thumb">
        <img src="${imagePath}" alt="${product.title}" onerror="this.onerror=null; this.src='../images/logo.png'; console.error('이미지 로드 실패:', this.alt);">
        ${badgesHTML}
        <div class="product-actions">
          <button class="wishlist-btn" title="위시리스트에 추가">
            <i class="far fa-heart"></i>
          </button>
          <button class="cart-btn" title="장바구니에 추가">
            <i class="fas fa-shopping-cart"></i>
          </button>
        </div>
      </div>
      <div class="product-info">
        <h3 class="product-title">${product.title}</h3>
        <div class="product-price">
          <span class="price-sale">${product.priceSale}원</span>
          <span class="price-normal">${product.priceNormal}원</span>
          <span class="discount-rate">${discountRate}%</span>
        </div>
        <div class="product-rating">
          <span class="stars">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </span>
          <span class="review-count">(${reviewCount})</span>
        </div>
      </div>
    `;
    
    productList.appendChild(productItem);
  });
  
  console.log('상품 렌더링 완료');
  
  // 이벤트 리스너 다시 연결
  initProductEvents();
}

/**
 * 상품 이벤트 초기화 함수
 */
function initProductEvents() {
  console.log('상품 이벤트 초기화');
  
  // 위시리스트 버튼 이벤트
  const wishlistBtns = document.querySelectorAll('.wishlist-btn');
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('위시리스트 버튼 클릭');
      const icon = this.querySelector('i');
      icon.classList.toggle('far');
      icon.classList.toggle('fas');
      alert('위시리스트에 추가되었습니다.');
    });
  });
  
  // 장바구니 버튼 이벤트
  const cartBtns = document.querySelectorAll('.cart-btn');
  cartBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      console.log('장바구니 버튼 클릭');
      alert('장바구니에 추가되었습니다.');
      
      // 장바구니 카운트 업데이트
      const cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        const count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
      }
    });
  });
}

/**
 * 이미지 경로 수정 함수 (main.js에서 가져옴)
 * @param {string} path - 이미지 경로
 * @returns {string} - 수정된 이미지 경로
 */
function getFixedImagePath(path) {
  // 디버깅 - 경로 로깅
  console.log('원본 이미지 경로:', path);
  
  // 이미 ../images로 시작하는 경우 그대로 반환
  if (path.startsWith('../images/')) {
    console.log('수정 없이 반환:', path);
    return path;
  }
  
  // 경로에 images가 포함되어 있으면 처리
  if (path.includes('images/')) {
    // images/로 시작하는 경우
    if (path.startsWith('images/')) {
      const newPath = '../' + path;
      console.log('수정된 경로 1:', newPath);
      return newPath;
    }
    
    // /images/로 시작하는 경우
    if (path.includes('/images/')) {
      const newPath = '..' + path.substring(path.indexOf('/images/'));
      console.log('수정된 경로 2:', newPath);
      return newPath;
    }
  }
  
  // 그 외의 경우 (상대 경로가 아닌 경우)
  if (!path.startsWith('../') && !path.startsWith('/')) {
    const newPath = '../images/' + path;
    console.log('수정된 경로 3:', newPath);
    return newPath;
  }
  
  // 기본값 - 원래 경로 반환
  console.log('기본 반환:', path);
  return path;
}

/**
 * 할인율 계산 함수
 * @param {string} originalPrice - 원래 가격
 * @param {string} salePrice - 할인 가격
 * @returns {number} - 할인율 (%)
 */
function getDiscountRate(originalPrice, salePrice) {
  // 문자열에서 콤마 제거하고 숫자로 변환
  const original = parseInt(originalPrice.replace(/,/g, ''));
  const sale = parseInt(salePrice.replace(/,/g, ''));
  
  // 할인율 계산 및 반올림
  const discountRate = Math.round(((original - sale) / original) * 100);
  return discountRate;
} 