document.addEventListener('DOMContentLoaded', function() {
    // 로그인 모달 관련 요소
    const loginModalOverlay = document.querySelector('.login-modal-overlay');
    const closeModalBtn = document.getElementById('close-modal');
    const loginForm = document.getElementById('loginForm');
    const userIdInput = document.getElementById('user-id');
    const userPasswordInput = document.getElementById('user-password');
    const loginErrorMessage = document.getElementById('login-error-message');
    
    // 로그인 모달 열기 함수 (전역에 등록)
    window.openLoginModal = function() {
        if (loginModalOverlay) {
            loginModalOverlay.classList.add('show');
        }
    };
    
    // 로그인 모달 닫기 함수
    window.closeLoginModal = function() {
        if (loginModalOverlay) {
            loginModalOverlay.classList.remove('show');
        }
    };
    
    // 닫기 버튼 이벤트
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            closeLoginModal();
        });
    }
    
    // 모달 외부 클릭 시 닫기
    if (loginModalOverlay) {
        loginModalOverlay.addEventListener('click', function(e) {
            if (e.target === loginModalOverlay) {
                closeLoginModal();
            }
        });
    }
    
    // 회원가입 링크 클릭 이벤트
    const signupLink = document.querySelector('.signup-link');
    if (signupLink) {
        signupLink.addEventListener('click', function(e) {
            e.preventDefault();
            // 현재 경로에 따라 회원가입 페이지 경로 조정
            const currentPath = window.location.pathname;
            if (currentPath.includes('/mypage/')) {
                window.location.href = '../signup/signup.html';
            } else {
                window.location.href = 'signup/signup.html';
            }
        });
    }
    
    // 로그인 폼 제출 이벤트
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 입력값 가져오기
            const userId = userIdInput.value.trim();
            const password = userPasswordInput.value;
            
            // 간단한 유효성 검사
            if (!userId || !password) {
                if (loginErrorMessage) {
                    loginErrorMessage.textContent = '아이디와 비밀번호를 모두 입력해주세요.';
                    loginErrorMessage.style.display = 'block';
                }
                return;
            }
            
            // 간단한 로컬 로그인 처리 (테스트용)
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userId', userId);
            
            // 로그인 후 처리
            closeLoginModal();
            alert('로그인 되었습니다.');
            
            // 페이지 새로고침
            location.reload();
        });
    }
});

// 페이지 로드시 로그인 상태 확인 및 상단 메뉴 업데이트
document.addEventListener('DOMContentLoaded', function() {
    updateLoginStatus();
    
    // ESC 키 누를 때 모달 닫기 이벤트
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const loginModalOverlay = document.querySelector('.login-modal-overlay');
            if (loginModalOverlay && loginModalOverlay.classList.contains('show')) {
                closeLoginModal();
            }
        }
    });
});

// 로그인 상태 업데이트 함수
function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userId = localStorage.getItem('userId');
    
    // 상단 메뉴 로그인/로그아웃 상태 업데이트
    const loginLinks = document.querySelectorAll('a[onclick*="openLoginModal"]');
    loginLinks.forEach(link => {
        if (isLoggedIn) {
            link.textContent = '로그아웃';
            link.setAttribute('onclick', 'logout(); return false;');
        } else {
            link.textContent = '로그인';
            link.setAttribute('onclick', 'openLoginModal(); return false;');
        }
    });
    
    // 사용자 이름 표시
    if (isLoggedIn && userId) {
        const userNameLink = document.querySelector('.top-menu-right a:nth-child(2)');
        if (userNameLink) {
            userNameLink.textContent = userId + '님';
            
            // 현재 경로에 따라 마이페이지 링크 조정
            const currentPath = window.location.pathname;
            if (currentPath.includes('/mypage/')) {
                userNameLink.setAttribute('href', './mypage.html');
            } else {
                userNameLink.setAttribute('href', 'mypage/mypage.html');
            }
        }
    }
    
    // 로그인 필요한 UI 요소 업데이트
    const loginRequiredElement = document.getElementById('login-required');
    const mypageContainerElement = document.getElementById('mypage-container');
    
    if (loginRequiredElement && mypageContainerElement) {
        if (isLoggedIn) {
            loginRequiredElement.style.display = 'none';
            mypageContainerElement.style.display = 'grid';
            
            // 프로필 이름 업데이트
            const profileNameElement = document.getElementById('profile-name');
            if (profileNameElement && userId) {
                profileNameElement.textContent = userId + '님';
            }
        } else {
            loginRequiredElement.style.display = 'block';
            mypageContainerElement.style.display = 'none';
        }
    }
}

// 로그아웃 함수 전역으로 등록
window.logout = function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    alert('로그아웃 되었습니다.');
    
    // 페이지 새로고침
    location.reload();
};
