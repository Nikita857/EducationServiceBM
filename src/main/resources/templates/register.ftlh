<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Регистрация</title>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/register.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/custom-alert.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
</head>
<body>
<div class="auth-container">
    <div class="auth-card">
        <div class="auth-header">
            <h3>Создайте аккаунт</h3>
            <p>Присоединяйтесь к BM Education</p>
        </div>

        <div class="card-body">
            <div id="generalError" class="alert alert-danger d-none"></div>

            <form id="registrationForm" novalidate>
                <div class="input-group has-validation">
                    <span class="input-group-text bg-transparent">
                        <i class="bi bi-person mx-1"></i>Имя
                    </span>
                    <input type="text" class="form-control" id="firstName" name="firstName"
                           placeholder="Введите ваше имя" required>
                    <div id="firstNameError" class="invalid-feedback"></div>
                </div>

                <div class="input-group has-validation">
                    <span class="input-group-text bg-transparent">
                        <i class="bi bi-person-badge mx-1"></i>Фамилия
                    </span>
                    <input type="text" class="form-control" id="lastName" name="lastName"
                           placeholder="Введите вашу фамилию" required>
                    <div id="lastNameError" class="invalid-feedback"></div>
                </div>

                <div class="input-group has-validation">
                    <span class="input-group-text bg-transparent">
                        <i class="bi bi-bank mx-1"></i>Отдел
                    </span>
                    <input type="text" class="form-control" id="department" name="department"
                           placeholder="Введите ваш отдел" required>
                    <div id="departmentError" class="invalid-feedback"></div>
                </div>

                <div class="input-group has-validation">
                    <span class="input-group-text bg-transparent">
                        <i class="bi bi-emoji-smile mx-1"></i></i>Должность
                    </span>
                    <input type="text" class="form-control" id="jobTitle" name="jobTitle"
                           placeholder="Введите вашу должность" required>
                    <div id="jobTitleError" class="invalid-feedback"></div>
                </div>

                <div class="d-flex flex-column mb-3 has-validation">
                    <div class="input-group mb-0">
                        <span class="input-group-text bg-transparent">
                            <i class="bi bi-at mx-1"></i>Логин
                        </span>
                        <input type="text" class="form-control" id="username" name="username"
                               placeholder="Придумайте уникальный логин" required>
                        <div id="usernameError" class="invalid-feedback w-100"></div>
                    </div>
                    <div class="form-text">От 5 до 50 символов, только буквы и цифры</div>
                </div>

                <div class="d-flex flex-column mb-3 has-validation">
                    <div class="input-group mb-0">
                        <span class="input-group-text bg-transparent">
                            <i class="bi bi-lock mx-1"></i>Пароль
                        </span>
                        <input type="password" class="form-control" id="password" name="password"
                               placeholder="Создайте надежный пароль" required>
                        <button type="button" class="password-toggle" onclick="togglePassword()">
                            <i class="bi bi-eye"></i>
                        </button>
                        <div id="passwordError" class="invalid-feedback w-100"></div>
                        <div class="password-strength">
                            <div class="password-strength-bar" id="passwordStrengthBar"></div>
                        </div>
                    </div>
                    <div class="password-requirements">
                        <div class="requirement mx-1" id="reqLength">
                            <i class="bi bi-check-circle"></i> Минимум 8 символов
                        </div>
                        <div class="requirement" id="reqUpperCase">
                            <i class="bi bi-check-circle mx-1"></i> Заглавные буквы
                        </div>
                        <div class="requirement mx-1" id="reqNumber">
                            <i class="bi bi-check-circle"></i> Цифры
                        </div>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary" id="submitButton">
                    <i class="bi bi-person-plus me-2"></i>Создать аккаунт
                </button>
            </form>

            <div class="auth-footer">
                <p class="mb-0">Уже есть аккаунт?
                    <a href="/login" class="auth-link">
                        Войти <i class="bi bi-arrow-right"></i>
                    </a>
                </p>
            </div>
        </div>
    </div>
</div>
<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
<script src="${app.static.host}/js/registerValidation.js"></script>
<script src="${staticHost}/js/auth/registerController.js"></script>
<script src="${app.static.host}/js/custom-alert.js"></script>
</body>
</html>
