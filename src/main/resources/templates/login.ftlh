<!DOCTYPE html>
<html data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Вход в систему</title>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/custom-alert.css">
</head>
<body>
<style>
    :root {
        --primary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
        --input-bg: rgba(255, 255, 255, 0.08);
        --card-bg: #1e293b;
    }

    body {
        background: #0f172a;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
        font-family: 'Inter', sans-serif;
    }

    .auth-container {
        width: 100%;
        max-width: 440px;
        animation: fadeIn 0.6s ease-out;
    }

    .auth-card {
        background: var(--card-bg);
        border: none;
        border-radius: 20px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    .auth-header {
        background: var(--primary-gradient);
        padding: 2.5rem 2rem;
        text-align: center;
        position: relative;
    }

    .auth-icon {
        width: 80px;
        height: 80px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.5rem;
        backdrop-filter: blur(10px);
        border: 2px solid rgba(255, 255, 255, 0.2);
    }

    .auth-icon i {
        font-size: 2.5rem;
        color: white;
    }

    .auth-header h3 {
        color: white;
        font-weight: 700;
        margin: 0;
        font-size: 1.75rem;
    }

    .auth-header p {
        color: rgba(255, 255, 255, 0.8);
        margin: 0.5rem 0 0;
    }

    .card-body {
        padding: 2.5rem 2rem;
    }

    .form-label {
        font-weight: 600;
        color: #e2e8f0;
        margin-bottom: 0.5rem;
    }

    .form-control {
        background: var(--input-bg);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        color: #e2e8f0;
        padding: 0.875rem 1.25rem;
        transition: all 0.3s ease;
    }

    .form-control:focus {
        background: rgba(255, 255, 255, 0.12);
        border-color: #6366f1;
        box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
        color: #e2e8f0;
    }

    .form-control::placeholder {
        color: #94a3b8;
    }

    .input-group {
        margin-bottom: 1.5rem;
    }

    .btn-primary {
        background: var(--primary-gradient);
        border: none;
        border-radius: 12px;
        padding: 1rem 2rem;
        font-weight: 600;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 0.5rem;
    }

    .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
    }

    .btn-primary:active {
        transform: translateY(0);
    }

    .auth-footer {
        text-align: center;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-link {
        color: #6366f1;
        text-decoration: none;
        font-weight: 600;
        transition: all 0.3s ease;
        display: inline-flex;
        align-items: center;
    }

    .auth-link:hover {
        color: #8b5cf6;
        transform: translateX(5px);
    }

    .auth-link i {
        margin-left: 0.5rem;
        transition: transform 0.3s ease;
    }

    .auth-link:hover i {
        transform: translateX(3px);
    }

    .password-toggle {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        z-index: 10;
    }

    .password-toggle:hover {
        color: #6366f1;
    }

    .input-group {
        position: relative;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 576px) {
        .auth-container {
            padding: 1rem;
        }

        .auth-header {
            padding: 2rem 1.5rem;
        }

        .card-body {
            padding: 2rem 1.5rem;
        }

        .auth-icon {
            width: 70px;
            height: 70px;
        }

        .auth-icon i {
            font-size: 2rem;
        }
    }

    .form-text {
        color: #94a3b8 !important;
        font-size: 0.875rem;
    }

    .alert {
        border: none;
        border-radius: 12px;
        padding: 1rem 1.5rem;
        margin-bottom: 1.5rem;
    }

    .alert-danger {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border-left: 4px solid #ef4444;
    }
</style>
<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h3>Войдите в свой аккаунт чтобы продолжить</h3>
        </div>

        <div class="card-body">
            <form action="/login" method="POST">
                <div class="mb-4">
                    <label for="username" class="form-label">Логин или Email</label>
                    <div class="input-group">
                        <input type="text" class="form-control" id="username" name="username" placeholder="Введите ваш логин или email" required>
                        <span class="input-group-text bg-transparent border-0">
                            <i class="bi bi-person"></i>
                        </span>
                    </div>
                    <div class="form-text">Используйте ваш корпоративный логин</div>
                </div>

                <div class="mb-4">
                    <label for="password" class="form-label">Пароль</label>
                    <div class="input-group" style="position: relative;">
                        <input type="password" class="form-control" id="password" name="password" placeholder="Введите ваш пароль" required>
                        <button type="button" class="password-toggle" onclick="togglePassword()">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                    <div class="form-text">Минимум 8 символов, включая цифры и буквы</div>
                </div>

<#--                <div class="form-check mb-4">-->
<#--                    <input class="form-check-input" type="checkbox" id="rememberMe" name="remember-me">-->
<#--                    <label class="form-check-label" for="rememberMe">-->
<#--                        Запомнить меня-->
<#--                    </label>-->
<#--                    <a href="/forgot-password" class="float-end auth-link" style="font-size: 0.875rem;">-->
<#--                        Забыли пароль?-->
<#--                    </a>-->
<#--                </div>-->

                <input type="hidden" name="_csrf" value="${_csrf.token}">

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Войти в систему
                </button>

                <#-- Показ ошибок аутентификации -->
                <#if error??>
                    <div class="alert alert-danger mt-2">
                        <i class="bi bi-exclamation-octagon me-2"></i>${error}<br>
                    </div>
                </#if>

                <#-- Сообщение о выходе -->
                <#if RequestParameters.logout??>
                    <div class="alert alert-success mt-2">
                        <i class="bi bi-exclamation-octagon me-2"></i>Вы успешно вышли из системы<br>
                    </div>
                </#if>

            </form>

            <div class="auth-footer">
                <p class="mb-0">Еще нет аккаунта?
                    <a href="/register" class="auth-link">
                        Создать аккаунт <i class="bi bi-arrow-right"></i>
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
<script src="${springMacroRequestContext.contextPath}/js/custom-alert.js"></script>
<script>
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

    // Валидация формы
    document.querySelector('form').addEventListener('submit', function(e) {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!username || !password) {
            e.preventDefault();
            alert('Пожалуйста, заполните все обязательные поля');
        }
    });
</script>
</body>
</html>