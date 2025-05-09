// HittoStore 커뮤니티 JavaScript 파일

document.addEventListener('DOMContentLoaded', function() {
  // 인기 게시물 효과
  initPopularPosts();
  
  // 페이지네이션 기능
  initPagination();
  
  // 게시판 메뉴 활성화
  initBoardMenu();
  
  // 검색 기능 초기화
  initSearch();
});

// 인기 게시물 효과 초기화
function initPopularPosts() {
  const popularItems = document.querySelectorAll('.popular-post-item');
  
  popularItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
}

// 페이지네이션 기능 초기화
function initPagination() {
  const pageLinks = document.querySelectorAll('.page-link');
  
  pageLinks.forEach(link => {
    if (!link.parentElement.classList.contains('disabled')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 현재 활성화된 페이지 비활성화
        const currentActive = document.querySelector('.page-item.active');
        if (currentActive) {
          currentActive.classList.remove('active');
        }
        
        // 클릭한 페이지 활성화
        if (!this.parentElement.classList.contains('prev-page') && 
            !this.parentElement.classList.contains('next-page')) {
          this.parentElement.classList.add('active');
        }
        
        // 여기에 페이지 로드 로직 추가 (AJAX 또는 페이지 이동)
        // 실제 구현에서는 페이지 번호에 따라 게시물 데이터를 가져와 표시
        
        // 스크롤을 게시판 상단으로 이동
        const boardHeader = document.querySelector('.board-header');
        if (boardHeader) {
          boardHeader.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  });
}

// 게시판 메뉴 활성화 기능
function initBoardMenu() {
  const menuItems = document.querySelectorAll('.community-menu-item a');
  
  // URL에서 현재 페이지 확인하여 해당 메뉴 활성화
  const currentPath = window.location.pathname;
  
  menuItems.forEach(item => {
    const itemPath = item.getAttribute('href');
    
    // 경로가 일치하면 active 클래스 추가
    if (itemPath && currentPath.includes(itemPath)) {
      item.classList.add('active');
    }
    
    // 클릭 이벤트 리스너 추가
    item.addEventListener('click', function() {
      menuItems.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // URL에 매칭되는 메뉴 없으면 첫 번째 메뉴 활성화
  if (!document.querySelector('.community-menu-item a.active') && menuItems.length > 0) {
    menuItems[0].classList.add('active');
  }
}

// 검색 기능 초기화
function initSearch() {
  const searchForm = document.querySelector('.search-form');
  
  if (searchForm) {
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const searchSelect = document.querySelector('.search-select');
      const searchInput = document.querySelector('.search-input');
      
      if (!searchInput.value.trim()) {
        alert('검색어를 입력해주세요.');
        searchInput.focus();
        return;
      }
      
      // 검색 파라미터 구성
      const searchType = searchSelect ? searchSelect.value : 'title';
      const searchText = searchInput.value.trim();
      
      // 여기에 실제 검색 처리 로직 추가
      console.log(`검색 타입: ${searchType}, 검색어: ${searchText}`);
      
      // 검색 결과 페이지로 이동 또는 AJAX로 검색 결과 로드
      // 테스트용 alert
      alert(`"${searchText}" 검색 결과입니다.`);
    });
  }
}

// 글쓰기 버튼 기능
function writePost() {
  // 로그인 상태 확인
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    alert('로그인 후 이용 가능합니다.');
    openLoginModal();
    return;
  }
  
  // 글쓰기 페이지로 이동 
  // 실제 구현에서는 아래 주석 해제
  // window.location.href = 'write.html';
  
  // 테스트용 alert
  alert('글쓰기 페이지로 이동합니다.');
}

// 로그인 모달 열기 함수
function openLoginModal() {
  const modalContainer = document.getElementById('modal-container');
  
  // components/login-modal.html 불러오기
  fetch('../components/login-modal.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('모달을 불러오는데 실패했습니다.');
      }
      return response.text();
    })
    .then(html => {
      // 모달 HTML 삽입
      modalContainer.innerHTML = html;
      
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
      }
    })
    .catch(error => {
      console.error('모달 로딩 오류:', error);
      alert('로그인 모달을 불러오는데 실패했습니다.');
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

// 로그인 상태 업데이트 함수
function updateLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userId = localStorage.getItem('userId');
  const loginLink = document.querySelector('.top-menu-right a:first-child');
  
  if (isLoggedIn && loginLink) {
    loginLink.textContent = '로그아웃';
    loginLink.setAttribute('onclick', 'logout(); return false;');
    
    // 로그인 사용자 이름 표시
    if (userId) {
      const userLinks = document.querySelectorAll('.top-menu-right a');
      if (userLinks.length > 1) {
        userLinks[1].textContent = userId + '님';
      }
    }
  } else if (loginLink) {
    loginLink.textContent = '로그인';
    loginLink.setAttribute('onclick', 'openLoginModal(); return false;');
  }
}

// 로그아웃 함수
function logout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userId');
  alert('로그아웃 되었습니다.');
  updateLoginStatus();
  // 현재 페이지 새로고침
  location.reload();
}

// 페이지 로드시 로그인 상태 확인
document.addEventListener('DOMContentLoaded', function() {
  updateLoginStatus();
}); 