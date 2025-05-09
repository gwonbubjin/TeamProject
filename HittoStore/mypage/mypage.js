// 마이페이지 자바스크립트 코드

document.addEventListener('DOMContentLoaded', function() {
  // 로그인 상태 확인
  checkLoginStatus();
  
  // 로그인 상태에 따라 페이지 내용 표시
  updatePageContent();
  
  // 최근 본 상품 데이터 가져오기
  loadRecentViewedProducts();
  
  // 이벤트 리스너 등록
  initEventListeners();
  
  // 모달 관련 전역 함수 등록
  window.openLoginModal = openLoginModal;
  window.closeLoginModal = closeLoginModal;
});

// 로그인 모달 열기 함수
function openLoginModal() {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) {
    console.error('모달 컨테이너가 존재하지 않습니다.');
    return;
  }
  
  // 마이페이지에서는 한 단계 위로 올라가야 함
  fetch('../components/login-modal.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('모달을 불러오는데 실패했습니다. 응답 상태: ' + response.status);
      }
      return response.text();
    })
    .then(html => {
      // 모달 HTML 삽입
      modalContainer.innerHTML = html;
      
      // CSS와 JS 경로 수정
      const cssLinks = modalContainer.querySelectorAll('link');
      cssLinks.forEach(link => {
        if (link.getAttribute('href') === 'components/login-modal.css') {
          link.setAttribute('href', '../components/login-modal.css');
        }
      });
      
      const scripts = modalContainer.querySelectorAll('script');
      scripts.forEach(script => {
        if (script.getAttribute('src') === 'components/login-modal.js') {
          script.setAttribute('src', '../components/login-modal.js');
        }
      });
      
      // 모달 표시
      const loginModalOverlay = document.querySelector('.login-modal-overlay');
      if (loginModalOverlay) {
        loginModalOverlay.classList.add('show');
        
        // 모달 내의 스크립트가 실행될 수 있도록 동적으로 추가된 스크립트 실행
        const scripts = modalContainer.querySelectorAll('script');
        scripts.forEach(script => {
          const newScript = document.createElement('script');
          Array.from(script.attributes).forEach(attr => 
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.textContent = script.textContent;
          script.parentNode.replaceChild(newScript, script);
        });
        
        // 닫기 버튼 이벤트 연결
        const closeModalBtn = document.getElementById('close-modal');
        if (closeModalBtn) {
          closeModalBtn.addEventListener('click', closeLoginModal);
        }
        
        // 모달 바깥 영역 클릭 시 닫기
        loginModalOverlay.addEventListener('click', function(e) {
          if (e.target === loginModalOverlay) {
            closeLoginModal();
          }
        });
        
        // ESC 키 누를 때 모달 닫기
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && loginModalOverlay.classList.contains('show')) {
            closeLoginModal();
          }
        });
        
        // 로그인 폼 제출 이벤트 처리
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
          loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const userId = document.getElementById('user-id').value;
            const password = document.getElementById('user-password').value;
            
            // 간단한 로그인 처리
            if (userId && password) {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('userId', userId);
              closeLoginModal();
              updatePageContent();
              checkLoginStatus();
              
              // 로그인 성공 메시지
              alert('로그인 되었습니다.');
            } else {
              const errorMsg = document.getElementById('login-error-message');
              if (errorMsg) {
                errorMsg.textContent = '아이디와 비밀번호를 입력해주세요.';
                errorMsg.style.display = 'block';
              }
            }
          });
        }
      }
    })
    .catch(error => {
      console.error('모달 로딩 오류:', error);
      alert('로그인 모달을 불러오는데 실패했습니다: ' + error.message);
    });
}

// 로그인 모달 닫기 함수
function closeLoginModal() {
  const loginModalOverlay = document.querySelector('.login-modal-overlay');
  if (loginModalOverlay) {
    loginModalOverlay.classList.remove('show');
    
    // 애니메이션 완료 후 모달 HTML 제거
    setTimeout(() => {
      const modalContainer = document.getElementById('modal-container');
      if (modalContainer) {
        modalContainer.innerHTML = '';
      }
    }, 300);
  }
}

// 로그인 상태 확인 함수
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');
  
  // 페이지 상단 로그인/로그아웃 버튼 상태 업데이트
  const loginLink = document.querySelector('.top-menu-right a:first-child');
  const userNameLink = document.querySelector('.top-menu-right a:nth-child(2)');
  
  if (isLoggedIn && loginLink && userNameLink) {
    loginLink.textContent = '로그아웃';
    loginLink.setAttribute('onclick', 'logout(); return false;');
    
    if (userId) {
      userNameLink.textContent = userId + '님';
      userNameLink.setAttribute('href', './mypage.html');
    }
  }
  
  return isLoggedIn;
}

// 페이지 컨텐츠 업데이트 함수
function updatePageContent() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');
  
  const loginRequiredElement = document.getElementById('login-required');
  const mypageContainerElement = document.getElementById('mypage-container');
  
  if (isLoggedIn) {
    // 로그인된 경우
    if (loginRequiredElement) loginRequiredElement.style.display = 'none';
    if (mypageContainerElement) mypageContainerElement.style.display = 'grid';
    
    // 사용자 이름 표시
    const profileNameElement = document.getElementById('profile-name');
    if (profileNameElement && userId) {
      profileNameElement.textContent = userId + '님';
    }
    
    // 장바구니 수량 업데이트
    updateCartCount();
    
    // 주문 내역 가져오기 (실제로는 서버에서 가져와야 함)
    // loadOrderHistory();
  } else {
    // 로그인되지 않은 경우
    if (loginRequiredElement) loginRequiredElement.style.display = 'block';
    if (mypageContainerElement) mypageContainerElement.style.display = 'none';
  }
}

// 최근 본 상품 목록 로드 함수
function loadRecentViewedProducts() {
  // 실제 구현에서는 localStorage나 서버에서 최근 본 상품 목록을 가져와야 함
  // 여기서는 예시 데이터를 사용
  
  // 이 예시 구현은 실제 데이터 없이 UI만 표시
  console.log('최근 본 상품 로드됨');
}

// 장바구니 수량 업데이트
function updateCartCount() {
  // 실제 구현에서는 localStorage나 서버에서 장바구니 상품 수를 가져와야 함
  const cartCount = 3; // 예시 데이터
  
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// 이벤트 리스너 초기화
function initEventListeners() {
  // 정보수정 버튼 클릭
  const editProfileBtn = document.querySelector('.edit-profile-btn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      alert('회원 정보 수정 페이지로 이동합니다.');
      // window.location.href = 'edit-profile.html'; // 실제 구현시 주석 해제
    });
  }
  
  // 주문취소 버튼 클릭
  const cancelOrderBtns = document.querySelectorAll('.action-btn');
  cancelOrderBtns.forEach(btn => {
    if (btn.textContent === '주문취소') {
      btn.addEventListener('click', function() {
        const confirmed = confirm('주문을 취소하시겠습니까?');
        if (confirmed) {
          alert('주문이 취소되었습니다.');
          // 실제 구현시 서버에 취소 요청 보내기
        }
      });
    } else if (btn.textContent === '배송조회') {
      btn.addEventListener('click', function() {
        alert('배송 조회 페이지로 이동합니다.');
        // window.location.href = 'delivery-tracking.html'; // 실제 구현시 주석 해제
      });
    }
  });
  
  // 상품 클릭 이벤트
  const productItems = document.querySelectorAll('.product-item');
  productItems.forEach(item => {
    item.addEventListener('click', function() {
      alert('상품 상세 페이지로 이동합니다.');
      // 실제 구현시 상품 상세 페이지로 이동 코드 추가
    });
  });
}

// 로그아웃 함수
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  alert('로그아웃 되었습니다.');
  
  // 페이지 새로고침
  window.location.reload();
} 