function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('.password-toggle i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('bi-eye');
        toggleIcon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('bi-eye-slash');
        toggleIcon.classList.add('bi-eye');
    }
}

// Добавляем анимацию при фокусе на инпуты
document.querySelectorAll('.form-control').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', function() {
        this.parentElement.style.transform = 'translateY(0)';
    });
});

// Функция для отображения сообщений (успех/ошибка)
function showAuthMessage(message, type) {
    const authMessageDiv = document.getElementById('authMessage');
    authMessageDiv.textContent = message;
    authMessageDiv.className = 'alert mt-2'; // Сброс классов
    if (type === 'success') {
        authMessageDiv.classList.add('alert-success');
        authMessageDiv.innerHTML = '<i class="bi bi-check-circle me-2"></i>' + message;
    } else if (type === 'error') {
        authMessageDiv.classList.add('alert-danger');
        authMessageDiv.innerHTML = '<i class="bi bi-exclamation-octagon me-2"></i>' + message;
    }
    authMessageDiv.style.display = 'block';
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
        showAuthMessage('Пожалуйста, заполните все обязательные поля', 'error');
        return;
    }

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const responseText = await response.text();
        const data = JSON.parse(responseText);

        console.log(data);

        if (response.ok) {
            // Успешная аутентификация

            showAuthMessage('Вход выполнен успешно!', 'success');
            // Перенаправление на главную страницу или страницу админки
            window.location.href = data.redirect ; // Или куда-то еще
        } else {
            // Проверяем, не заблокирован ли пользователь
            if (response.status === 429 && data.redirectUrl) {
                window.location.href = data.redirectUrl;
                return;
            }
            // Ошибка аутентификации
            showAuthMessage(data.message || 'Неверный логин или пароль', 'error');
        }
    } catch (error) {
        console.error('Ошибка при аутентификации:', error);
        showAuthMessage('Проверьте подключение к сети. Попробуйте позже.', 'error');
    }
});

// Обработка сообщений о выходе (если они есть в URL)
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('logout')) {
    showAuthMessage('Вы успешно вышли из системы', 'success');

}