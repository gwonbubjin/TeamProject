/**
 * HittoStore 베스트상품 페이지 JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  console.log("베스트상품 페이지 로드됨");
  
  // main.js의 products 객체가 로드되었는지 확인
  if (!window.products || Object.keys(window.products).length === 0) {
    console.warn("main.js에서 정의된 products 객체가 없거나 비어 있습니다. 기본 데이터를 설정합니다.");
    // 기본 베스트상품 데이터 설정
    setupDefaultBestProducts();
  } else {
    console.log("main.js에서 정의된 products 객체가 로드되었습니다:", Object.keys(window.products).length + "개 카테고리");
  }
  
  // 정렬 옵션 변경 이벤트
  const sortOptions = document.getElementById('sort-options');
  if (sortOptions) {
    sortOptions.addEventListener('change', function() {
      console.log('정렬 옵션 변경:', this.value);
      loadBestProducts(this.value);
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
  
  // 베스트상품 로드 (기본 정렬: 인기순)
  loadBestProducts('popular');
});

/**
 * 기본 베스트상품 데이터 설정
 */
function setupDefaultBestProducts() {
  // 카테고리별 데이터 구조
  window.products = {
    glove: [
      {
        id: 'g1',
        title: '모리모토 커브 스타일 내야 야구 글러브 11.75인치',
        image: '../images/glove1.jpg',
        badges: [{type: 'discount', text: '41%'}, {type: 'hot', text: 'HOT'}],
        priceSale: '99,000',
        priceNormal: '169,000'
      },
      {
        id: 'g2',
        title: 'BMC TRD PRO 올라운드 야구 글러브 블랙/탄 K11',
        image: '../images/glove2.jpg',
        badges: [{type: 'discount', text: '25%'}],
        priceSale: '179,000',
        priceNormal: '239,000'
      },
      {
        id: 'g3',
        title: '윌슨 A1500 내야 야구 3등급 글러브 11.75인치 레드',
        image: '../images/glove3.jpg',
        badges: [{type: 'discount', text: '15%'}],
        priceSale: '289,000',
        priceNormal: '340,000'
      }
    ],
    bat: [
      {
        id: 'b1',
        title: '이스턴 고스트 X 알루미늄 배트 33/30',
        image: '../images/bat1.jpg',
        badges: [{type: 'hot', text: '인기'}, {type: 'discount', text: '35%'}],
        priceSale: '260,000',
        priceNormal: '400,000'
      },
      {
        id: 'b2',
        title: '루이빌 메타 BBCOR 배트 33인치',
        image: '../images/bat2.jpg',
        badges: [{type: 'new', text: 'NEW'}],
        priceSale: '450,000',
        priceNormal: '520,000'
      }
    ],
    ball: [
      {
        id: 'bl1',
        title: '공인구 12개 세트',
        image: '../images/ball1.jpg',
        badges: [{type: 'new', text: 'NEW'}],
        priceSale: '48,000',
        priceNormal: '60,000'
      },
      {
        id: 'bl2',
        title: '연식 야구공 10개 세트',
        image: '../images/ball2.jpg',
        badges: [{type: 'hot', text: '인기'}],
        priceSale: '35,000',
        priceNormal: '45,000'
      }
    ],
    equipment: [
      {
        id: 'e1',
        title: '포수 마스크 프로용',
        image: '../images/best10.jpg',
        badges: [{type: 'new', text: 'NEW'}],
        priceSale: '140,000',
        priceNormal: '175,000'
      },
      {
        id: 'e2',
        title: '배팅 헬멧 양귀 프리미엄',
        image: '../images/best11.jpg',
        badges: [{type: 'hot', text: 'HOT'}],
        priceSale: '98,000',
        priceNormal: '135,000'
      }
    ],
    shoes: [
      {
        id: 's1',
        title: '프로 스파이크 신발',
        image: '../images/best9.png',
        badges: [{type: 'hot', text: 'BEST'}],
        priceSale: '175,000',
        priceNormal: '210,000'
      },
      {
        id: 's2',
        title: '프리미엄 야구화',
        image: '../images/best12.jpg',
        badges: [{type: 'discount', text: '30%'}],
        priceSale: '180,000',
        priceNormal: '260,000'
      }
    ],
    clothing: [
      {
        id: 'c1',
        title: '프로팀 레플리카 유니폼',
        image: '../images/best8.png',
        badges: [{type: 'discount', text: '25%'}],
        priceSale: '220,000',
        priceNormal: '295,000'
      },
      {
        id: 'c2',
        title: '야구 트레이닝 져지',
        image: '../images/best13.jpg',
        badges: [{type: 'new', text: 'NEW'}],
        priceSale: '89,000',
        priceNormal: '120,000'
      }
    ]
  };
}

/**
 * 모든 카테고리에서 베스트상품 추출
 * @returns {Array} - 베스트상품 배열
 */
function getAllBestProducts() {
  const bestProducts = [];
  
  // 메인 페이지에서 쓰는 것과 같은 베스트 상품 데이터 추가
  const mainBestProducts = [
    {
      id: 'best1',
      title: '프로용 최고급 글러브',
      image: '../images/best6.png',
      badges: [{type: 'new', text: 'NEW'}],
      priceSale: '55,000',
      priceNormal: '70,000',
      category: 'glove'
    },
    {
      id: 'best2',
      title: '알루미늄 베트 프리미엄',
      image: '../images/best7.png',
      badges: [{type: 'new', text: 'NEW'}, {type: 'hot', text: 'HOT'}],
      priceSale: '98,000',
      priceNormal: '135,000',
      category: 'bat'
    },
    {
      id: 'best3',
      title: '프로팀 레플리카 유니폼',
      image: '../images/best8.png',
      badges: [{type: 'discount', text: '25%'}],
      priceSale: '220,000',
      priceNormal: '295,000',
      category: 'clothing'
    },
    {
      id: 'best4',
      title: '프로 스파이크 신발',
      image: '../images/best9.png',
      badges: [{type: 'hot', text: 'BEST'}],
      priceSale: '175,000',
      priceNormal: '210,000',
      category: 'shoes'
    },
    {
      id: 'best5',
      title: '프로페셔널 야구 장비 가방',
      image: '../images/best15.jpg',
      badges: [{type: 'hot', text: '인기'}, {type: 'discount', text: '22%'}],
      priceSale: '78,000',
      priceNormal: '100,000',
      category: 'equipment'
    }
  ];
  
  // 메인 페이지의 고정 베스트 상품 추가
  mainBestProducts.forEach(product => {
    bestProducts.push(product);
  });
  
  console.log('베스트상품 총 개수:', bestProducts.length);
  return bestProducts;
}

/**
 * 베스트상품 로드 함수
 * @param {string} sortBy - 정렬 옵션
 */
function loadBestProducts(sortBy = 'popular') {
  // 모든 카테고리에서 베스트상품 가져오기
  const bestProductsList = getAllBestProducts();
  
  console.log('정렬 전 베스트상품 목록:', bestProductsList.map(p => p.title));
  
  // 정렬 처리
  switch(sortBy) {
    case 'popular':
      // 인기순 정렬 - mainBestProducts는 이미 인기순으로 정렬되어 있으므로 그대로 유지
      bestProductsList.sort((a, b) => {
        // ID가 best로 시작하는 경우 원래 순서 유지
        if (a.id && a.id.startsWith('best') && b.id && b.id.startsWith('best')) {
          return parseInt(a.id.replace('best', '')) - parseInt(b.id.replace('best', ''));
        }
        return 0; // 다른 상품은 순서 유지
      });
      break;
    case 'price-low':
      // 가격 낮은순 정렬
      bestProductsList.sort((a, b) => {
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return aPrice - bPrice;
      });
      break;
    case 'price-high':
      // 가격 높은순 정렬
      bestProductsList.sort((a, b) => {
        const aPrice = parseInt(a.priceSale.replace(/,/g, ''));
        const bPrice = parseInt(b.priceSale.replace(/,/g, ''));
        return bPrice - aPrice;
      });
      break;
    case 'discount':
      // 할인율 높은순 정렬
      bestProductsList.sort((a, b) => {
        const aDiscount = getDiscountRate(a.priceNormal, a.priceSale);
        const bDiscount = getDiscountRate(b.priceNormal, b.priceSale);
        return bDiscount - aDiscount;
      });
      break;
    default:
      // 기본값 - 인기순(원래 순서)
      break;
  }
  
  console.log('정렬 후 베스트상품 목록:', bestProductsList.map(p => p.title));
  
  // 베스트상품 렌더링
  renderBestProducts(bestProductsList);
}

/**
 * 베스트상품 렌더링 함수
 * @param {Array} products - 베스트상품 데이터 배열
 */
function renderBestProducts(products) {
  const productList = document.getElementById('best-product-list');
  if (!productList) {
    console.error('상품 목록 컨테이너(#best-product-list)를 찾을 수 없습니다.');
    return;
  }
  
  console.log('상품 렌더링 시작:', products ? products.length + '개 항목' : '데이터 없음');
  
  // 상품 목록 비우기
  productList.innerHTML = '';
  
  // 상품이 없는 경우
  if (products.length === 0) {
    console.error('렌더링할 베스트상품이 없습니다.');
    productList.innerHTML = '<p class="no-products">베스트상품이 없습니다.</p>';
    return;
  }
  
  // 베스트상품 렌더링
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
 * 이미지 경로 수정 함수
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
  
  // best숫자.png 또는 best숫자.jpg 형식인지 확인 (메인 페이지 베스트 상품)
  const bestImageRegex = /best\d+\.(png|jpg)/i;
  if (bestImageRegex.test(path)) {
    // images/ 포함 여부에 따라 경로 조정
    if (path.includes('images/')) {
      const newPath = '../' + path;
      console.log('베스트 이미지 경로 수정:', newPath);
      return newPath;
    } else {
      const newPath = '../images/' + path.replace(/^.*[\\\/]/, '');
      console.log('베스트 이미지 경로 추출:', newPath);
      return newPath;
    }
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