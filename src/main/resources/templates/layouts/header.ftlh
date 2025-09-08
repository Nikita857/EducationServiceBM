<div id="custom-alert-container"></div>
<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <!-- Бренд и логотип -->
        <a class="navbar-brand d-flex align-items-center" href="/">
            <i class="bi bi-mortarboard-fill me-2"></i>
            BM Education
        </a>

        <!-- Кнопка для мобильных устройств -->
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                data-bs-target="#navbarMainContent" aria-controls="navbarMainContent"
                aria-expanded="false" aria-label="Переключить навигацию">
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Основное содержимое навигации -->
        <div class="collapse navbar-collapse" id="navbarMainContent">
            <!-- Основное меню -->
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link active" href="/">
                        <i class="bi bi-house-door me-1"></i>
                        Главная
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/">
                        <i class="bi bi-book me-1"></i>
                        Курсы
                    </a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/modules">
                        <i class="bi bi-collection me-1"></i>
                        Модули
                    </a>
                </li>
            </ul>

            <!-- Правая часть навигации -->
            <div class="d-flex align-items-center">
                <!-- Уведомления -->
                <div class="dropdown me-3">
                    <button class="btn btn-sm text-white position-relative" type="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-bell fs-5"></i>
                        <span class="badge-notification" style="display: none;"></span>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                        <li><h6 class="dropdown-header text-dark">Уведомления</h6></li>
                    </ul>
                </div>

                <!-- Профиль пользователя -->

                    <div class="dropdown">
                        <div class="user-info dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                            <img src="/avatars/${user.avatar}" alt="Аватар" class="user-avatar">
                            <span class="d-none d-md-inline">${user.firstName} ${user.lastName}</span>
                        </div>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <a class="dropdown-item text-dark" href="/cabinet/">
                                    <i class="bi bi-person-circle me-2"></i>Личный кабинет
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item text-danger" href="#" id="logoutButton">
                                    <i class="bi bi-box-arrow-right me-2"></i>Выход
                                </a>
                            </li>
                        </ul>
                    </div>
            </div>
        </div>
    </div>
</nav>
<script src="${springMacroRequestContext.contextPath}/js/notification.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/logoutScript.js"></script>