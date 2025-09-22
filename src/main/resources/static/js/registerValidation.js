// Валидация пароля
document.getElementById('password').addEventListener('input', function() {
    const password = this.value;
    const strengthBar = document.getElementById('passwordStrengthBar');
    const requirements = {
        length: document.getElementById('reqLength'),
        upperCase: document.getElementById('reqUpperCase'),
        number: document.getElementById('reqNumber')
    };

    let strength = 0;

    // Проверка длины
    if (password.length >= 8) {
        strength += 33;
        requirements.length.classList.add('valid');
        requirements.length.innerHTML = '<i class="bi bi-check-circle"></i> Минимум 8 символов';
    } else {
        requirements.length.classList.remove('valid');
        requirements.length.innerHTML = '<i class="bi bi-circle"></i> Минимум 8 символов';
    }

    // Проверка заглавных букв
    if (/[A-Z]/.test(password)) {
        strength += 33;
        requirements.upperCase.classList.add('valid');
        requirements.upperCase.innerHTML = '<i class="bi bi-check-circle"></i> Заглавные буквы';
    } else {
        requirements.upperCase.classList.remove('valid');
        requirements.upperCase.innerHTML = '<i class="bi bi-circle"></i> Заглавные буквы';
    }

    // Проверка цифр
    if (/[0-9]/.test(password)) {
        strength += 34;
        requirements.number.classList.add('valid');
        requirements.number.innerHTML = '<i class="bi bi-check-circle"></i> Цифры';
    } else {
        requirements.number.classList.remove('valid');
        requirements.number.innerHTML = '<i class="bi bi-circle"></i> Цифры';
    }

    // Обновление полосы прогресса
    strengthBar.style.width = strength + '%';

    if (strength < 33) {
        strengthBar.style.background = '#ef4444';
    } else if (strength < 66) {
        strengthBar.style.background = '#f59e0b';
    } else {
        strengthBar.style.background = '#10b981';
    }
});



// Анимация элементов при загрузке
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-control');
    inputs.forEach((input, index) => {
        input.style.opacity = '0';
        input.style.transform = 'translateY(10px)';
        setTimeout(() => {
            input.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            input.style.opacity = '1';
            input.style.transform = 'translateY(0)';
        }, index * 100);
    });
});