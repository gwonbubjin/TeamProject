document.addEventListener('DOMContentLoaded', function() {
    // 폼 요소 가져오기
    const signupForm = document.getElementById('signupForm');
    const nameInput = document.getElementById('name');
    const userIdInput = document.getElementById('userId');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const birthdateInput = document.getElementById('birthdate');
    const phoneInput = document.getElementById('phone');
    const favoriteTeamSelect = document.getElementById('favoriteTeam');
    const emailInput = document.getElementById('email');
    const checkDuplicateBtn = document.getElementById('checkDuplicate');
    
    // 에러 메시지 요소
    const nameError = document.getElementById('nameError');
    const userIdError = document.getElementById('userIdError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const birthdateError = document.getElementById('birthdateError');
    const phoneError = document.getElementById('phoneError');
    
    // 아이디 중복 확인 여부
    let isIdChecked = false;
    
    // 아이디 중복 확인 버튼 클릭 이벤트
    checkDuplicateBtn.addEventListener('click', function() {
        const userId = userIdInput.value.trim();
        
        if (userId === '') {
            userIdError.textContent = '아이디를 입력해주세요.';
            return;
        }
        
        if (userId.length < 4) {
            userIdError.textContent = '아이디는 4자 이상이어야 합니다.';
            return;
        }
        
        // 서버에 중복 확인 요청
        fetch('/check_id.jsp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${encodeURIComponent(userId)}`
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('서버 응답이 올바르지 않습니다.');
            }
            return response.text();
        })
        .then(data => {
            if (data === 'duplicate') {
                userIdError.textContent = '이미 사용 중인 아이디입니다.';
                userIdError.style.color = '#d9230f';
                isIdChecked = false;
            } else if (data === 'available') {
                userIdError.textContent = '사용 가능한 아이디입니다.';
                userIdError.style.color = '#4CAF50';
                isIdChecked = true;
            } else {
                throw new Error('알 수 없는 응답입니다.');
            }
        })
        .catch(error => {
            console.error('중복 확인 오류:', error);
            userIdError.textContent = '서버 오류가 발생했습니다. 다시 시도해주세요.';
            userIdError.style.color = '#d9230f';
        });
    });
    
    // 아이디 입력 필드가 변경되면 중복 확인 초기화
    userIdInput.addEventListener('input', function() {
        isIdChecked = false;
        userIdError.style.color = '#d9230f';
        userIdError.textContent = '';
    });
    
    // 폼 제출 이벤트
    signupForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 에러 메시지 초기화
        nameError.textContent = '';
        userIdError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        birthdateError.textContent = '';
        phoneError.textContent = '';
        
        // 폼 데이터 가져오기
        const name = nameInput.value.trim();
        const userId = userIdInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const birthdate = birthdateInput.value;
        const phone = phoneInput.value.trim();
        const favoriteTeam = favoriteTeamSelect.value;
        const email = emailInput.value.trim();
        
        // 유효성 검사
        let isValid = true;
        
        // 이름 검사
        if (name === '') {
            nameError.textContent = '이름을 입력해주세요.';
            isValid = false;
        }
        
        // 아이디 검사
        if (userId === '') {
            userIdError.textContent = '아이디를 입력해주세요.';
            isValid = false;
        } else if (userId.length < 4) {
            userIdError.textContent = '아이디는 4자 이상이어야 합니다.';
            isValid = false;
        } else if (!isIdChecked) {
            userIdError.textContent = '아이디 중복 확인을 해주세요.';
            isValid = false;
        }
        
        // 비밀번호 검사
        if (password === '') {
            passwordError.textContent = '비밀번호를 입력해주세요.';
            isValid = false;
        } else if (password.length < 8) {
            passwordError.textContent = '비밀번호는 8자 이상이어야 합니다.';
            isValid = false;
        } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
            passwordError.textContent = '비밀번호는 영문과 숫자를 포함해야 합니다.';
            isValid = false;
        }
        
        // 비밀번호 확인 검사
        if (confirmPassword === '') {
            confirmPasswordError.textContent = '비밀번호 확인을 입력해주세요.';
            isValid = false;
        } else if (password !== confirmPassword) {
            confirmPasswordError.textContent = '비밀번호가 일치하지 않습니다.';
            isValid = false;
        }
        
        // 생년월일 검사
        if (birthdate === '') {
            birthdateError.textContent = '생년월일을 입력해주세요.';
            isValid = false;
        }
        
        // 휴대폰 번호 검사
        if (phone === '') {
            phoneError.textContent = '휴대폰 번호를 입력해주세요.';
            isValid = false;
        } else if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
            phoneError.textContent = '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-0000-0000)';
            isValid = false;
        }
        
        // 이메일 검사 (선택 사항이므로 입력된 경우에만 검사)
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('올바른 이메일 형식이 아닙니다.');
            isValid = false;
        }
        
        // 유효성 검사 통과 시 fetch로 데이터 전송
        if (isValid) {
            // 요청 파라미터 구성
            const formData = new URLSearchParams();
            formData.append('name', name);
            formData.append('userId', userId);
            formData.append('password', password);
            formData.append('birth', birthdate);  // 요구사항에 맞게 birth로 전송
            formData.append('phone', phone);
            formData.append('team', favoriteTeam);  // 요구사항에 맞게 team으로 전송
            if (email) {
                formData.append('email', email);
            }
            
            // 회원가입 요청 전송
            fetch('/signup.jsp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString()
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('서버 응답이 올바르지 않습니다.');
                }
                return response.text();
            })
            .then(data => {
                if (data === 'success') {
                    alert('회원가입이 완료되었습니다.');
                    window.location.href = '../index.html';  // 메인 페이지로 이동
                } else {
                    alert('회원가입에 실패했습니다. ' + data);
                }
            })
            .catch(error => {
                console.error('회원가입 오류:', error);
                alert('서버 오류가 발생했습니다. 다시 시도해주세요.');
            });
        }
    });
    
    // 휴대폰 번호 자동 하이픈 추가
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^0-9]/g, '');
        
        if (value.length > 3 && value.length <= 7) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length > 7) {
            value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
        }
        
        e.target.value = value;
    });
});