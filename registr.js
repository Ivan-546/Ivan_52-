class UserManager {
    constructor() {
        this.userKey = 'maison_user';
        this.usersKey = 'maison_users';
    }
    
    registerUser(userData) {
        let users = this.getAllUsers();
        
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'Email уже зарегистрирован' };
        }
        
        const newUser = {
            id: Date.now(),
            ...userData,
            registeredAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem(this.usersKey, JSON.stringify(users));
        
        const userToStore = { ...newUser };
        delete userToStore.password;
        localStorage.setItem(this.userKey, JSON.stringify(userToStore));
        
        return { success: true, message: 'Регистрация успешна!', user: userToStore };
    }
    
    getAllUsers() {
        const users = localStorage.getItem(this.usersKey);
        return users ? JSON.parse(users) : [];
    }
}

const userManager = new UserManager();

document.addEventListener('DOMContentLoaded', function() {
    const registrForm = document.getElementById('registrForm');
    if (!registrForm) return;
    
    registrForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('registrEmail').value.trim();
        const password = document.getElementById('registrPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const phone = document.getElementById('phone').value.trim();
        const agreeTerms = document.querySelector('input[name="agreeTerms"]').checked;
        
        if (!fullName || !email || !password || !confirmPassword) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Пожалуйста, введите корректный email');
            return;
        }
        
        if (password.length < 6) {
            alert('Пароль должен содержать минимум 6 символов');
            return;
        }
        
        if (password !== confirmPassword) {
            alert('Пароли не совпадают');
            return;
        }
        
        if (!agreeTerms) {
            alert('Пожалуйста, согласитесь с условиями');
            return;
        }
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'flex';
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.random() * 30;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';
            progressPercentage.textContent = Math.floor(progress) + '%';
        }, 200);
        
        setTimeout(() => {
            clearInterval(progressInterval);
            progress = 100;
            progressFill.style.width = '100%';
            progressPercentage.textContent = '100%';
            
            const userData = {
                name: fullName,
                email: email,
                password: password,
                phone: phone || 'не указан'
            };
            
            const result = userManager.registerUser(userData);
            
            if (result.success) {
                const successModal = document.getElementById('successModal');
                const successMessage = document.getElementById('successMessage');
                successMessage.textContent = `Спасибо, ${result.user.name}! Ваш аккаунт создан и вы авторизированы.`;
                successModal.classList.add('show');
                
                document.getElementById('registrForm').reset();
                progressFill.style.width = '0%';
                progressPercentage.textContent = '0%';
                
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
            } else {
                alert('Ошибка: ' + result.message);
                progressFill.style.width = '0%';
                progressPercentage.textContent = '0%';
                
                submitBtn.disabled = false;
                btnText.style.display = 'block';
                btnLoader.style.display = 'none';
            }
        }, 2000);
    });
    
    const registrPassword = document.getElementById('registrPassword');
    const confirmPassword = document.getElementById('confirmPassword');
    
    if (registrPassword) {
        registrPassword.addEventListener('input', () => {
            validatePasswords();
        });
    }
    
    if (confirmPassword) {
        confirmPassword.addEventListener('input', () => {
            validatePasswords();
        });
    }
    
    registrForm.addEventListener('input', () => {
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('registrEmail').value.trim();
        const password = document.getElementById('registrPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const agreeTerms = document.querySelector('input[name="agreeTerms"]').checked;
        
        let filledFields = 0;
        const totalFields = 5;
        
        if (fullName) filledFields++;
        if (email) filledFields++;
        if (password) filledFields++;
        if (confirmPassword) filledFields++;
        if (agreeTerms) filledFields++;
        
        const progressPercent = (filledFields / totalFields) * 100;
        document.getElementById('progressFill').style.width = progressPercent + '%';
        document.getElementById('progressPercentage').textContent = Math.floor(progressPercent) + '%';
    });
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const body = document.body;
            const currentTheme = body.classList.contains('light-theme') ? 'light' : 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            body.classList.remove('dark-theme', 'light-theme');
            body.classList.add(newTheme + '-theme');
            
            localStorage.setItem('theme', newTheme);
            
            themeToggle.textContent = newTheme === 'dark' ? '🌙' : '☀️';
        });
    }
});

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function goToLogin() {
    window.location.href = 'login.html';
}

function validatePasswords() {
    const password = document.getElementById('registrPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password && confirmPassword && password !== confirmPassword) {
        document.getElementById('confirmPassword').style.borderColor = '#ff6b6b';
    } else if (password && confirmPassword && password === confirmPassword) {
        document.getElementById('confirmPassword').style.borderColor = '#51cf66';
    } else {
        document.getElementById('confirmPassword').style.borderColor = '#333';
    }
}

document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 't') {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) themeToggle.click();
    }
    if (e.key === 'Enter') {
        const registrForm = document.getElementById('registrForm');
        if (registrForm) registrForm.dispatchEvent(new Event('submit'));
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Пользователь ушёл со страницы регистрации');
    } else {
        console.log('Пользователь вернулся на страницу регистрации');
    }
});

window.addEventListener('load', () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.classList.add(savedTheme + '-theme');
    
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';
    }

    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 300);
});
