<!doctype html>
<html lang=ru data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/admin.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <title>Панель управления</title>
    <style>
        .tab-content {
            display: none;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .tab-content.active {
            display: block;
            opacity: 1;
            transform: translateY(0);
        }

        .tab-content.fade-in {
            animation: fadeInUp 0.5s ease;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    </style>
</head>
<body>
<div class="admin-layout">
    <!-- Header -->
    <header class="admin-header">
        <div class="header-left">
            <button class="btn btn-icon mobile-menu-btn" style="display: none;">
                <i class="bi bi-list"></i>
            </button>
            <h1 class="header-title">Панель управления</h1>
        </div>
        <div class="header-actions">
            <button class="btn btn-icon">
                <i class="bi bi-bell"></i>
            </button>
            <button class="btn btn-icon">
                <i class="bi bi-gear"></i>
            </button>
        </div>
    </header>

    <!-- Sidebar -->
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <a href="/" class="brand-logo">
                <i class="bi bi-mortarboard"></i>
                BM Education
            </a>
        </div>

        <nav class="sidebar-nav">
            <div class="nav-section">
                <h3 class="nav-title">Основное</h3>
                <div class="nav-item">
                    <a href="#" class="nav-link active" data-tab="dashboard-tab">
                        <i class="bi bi-speedometer2"></i>
                        Дашборд
                    </a>
                </div>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="requests-tab">
                        <i class="bi bi-journal-text"></i>
                        Заявки
                    </a>
                </div>
            </div>

            <div class="nav-section">
                <h3 class="nav-title">Контент</h3>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="courses-tab">
                        <i class="bi bi-book"></i>
                        Курсы
                    </a>
                </div>
                <div class="nav-item">
                    <a href="/admin/modules/create" class="nav-link" data-tab="modules-tab">
                        <i class="bi bi-collection"></i>
                        Модули
                    </a>
                </div>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="users-tab">
                        <i class="bi bi-people"></i>
                        Пользователи
                    </a>
                </div>
            </div>

            <div class="nav-section">
                <h3 class="nav-title">Система</h3>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="settings-tab">
                        <i class="bi bi-gear"></i>
                        Настройки
                    </a>
                </div>
                <div class="nav-item">
                    <a href="/logout" class="nav-link">
                        <i class="bi bi-box-arrow-right"></i>
                        Выход
                    </a>
                </div>
            </div>
        </nav>
    </aside>

    <!-- Main Content -->
    <main class="admin-main">
        <!-- Дашборд -->
        <div class="tab-content active" id="dashboard-tab">
            <!-- Statistics Section -->
            <section class="content-section">
                <div class="card-grid">
                    <div class="stat-card fade-in">
                        <div class="stat-header">
                            <div class="stat-icon">
                                <i class="bi bi-journal-text"></i>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3>${offers?size}</h3>
                            <p class="text-muted">Всего заявок</p>
                        </div>
                    </div>

                    <div class="stat-card fade-in">
                        <div class="stat-header">
                            <div class="stat-icon">
                                <i class="bi bi-book"></i>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3>${courses?size}</h3>
                            <p class="text-muted">Активных курсов</p>
                        </div>
                    </div>

                    <div class="stat-card fade-in">
                        <div class="stat-header">
                            <div class="stat-icon">
                                <i class="bi bi-people"></i>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3>${users?size}</h3>
                            <p class="text-muted">Пользователей</p>
                        </div>
                    </div>

                    <div class="stat-card fade-in">
                        <div class="stat-header">
                            <div class="stat-icon">
                                <i class="bi bi-collection"></i>
                            </div>
                        </div>
                        <div class="stat-content">
                            <h3>${modules?size}</h3>
                            <p class="text-muted">Модулей обучения</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Recent Activity Section -->
            <section class="content-section">
                <div class="section-header d-flex justify-content-between">
                    <h2 class="section-title">Последние заявки</h2>
                    <form action="/admin/{}">
                    </form>
                </div>

                <div class="data-table">
                    <div class="table-header">
                        <h3 class="table-title">Нерассмотреные заявки</h3>
                    </div>
                    <div class="table-content">
                        <#if uncheckedOffers?has_content>
                            <#list uncheckedOffers as offerItem>
                                <div class="table-row">
                                    <div>${offerItem_index+1}</div>
                                    <div>Пользователь: ${offerItem.user.firstName} ${offerItem.user.lastName}</div>
                                    <div>Отдел: ${offerItem.user.department}</div>
                                    <div>
                                        <span class="status-badge status-<#if offerItem.status == "PENDING">pending<#elseif offerItem.status == "REJECTED">rejected<#else>completed</#if>">
                                            <#if offerItem.status == "PENDING">
                                                Не рассмотрена
                                            <#elseif offerItem.status == "REJECTED">
                                                Отклонена
                                            <#elseif offerItem.status == "APPROVED">
                                                Принята
                                            <#else>
                                                Выполнена
                                            </#if>
                                        </span>
                                    </div>
                                    <div>${offerItem.createdAt}</div>
                                    <div class="action-buttons">
                                        <button class="btn btn-primary btn-sm btn-icon" onclick="getOfferDescription(${offerItem.id})">
                                            <i class="bi bi-eye"></i>
                                        </button>
                                        <button class="btn btn-sm btn-primary btn-update-offer"
                                                data-offer-id="${offerItem.id}"
                                                data-current-status="${offerItem.status}"
                                                data-current-response="Предварительный ответ">
                                            <i class="bi bi-pencil"></i>
                                        </button>
                                    </div>
                                </div>
                            </#list>
                        <#else>
                            <p class="text-center">Нерассмотреные заявки отсутствуют</p>
                        </#if>
                    </div>
                </div>
            </section>

            <!-- Quick Actions Section -->
            <section class="content-section">
                <div class="section-header">
                    <h2 class="section-title">Быстрые действия</h2>
                </div>

                <div class="card-grid">

                    <div class="stat-card">
                        <a href="#" class="nav-link" data-tab="courses-tab">
                            <div class="stat-header">
                                <div class="stat-icon">
                                    <i class="bi bi-plus-circle"></i>
                                </div>
                            </div>
                            <div class="stat-content">
                                <h4>Добавить курс</h4>
                                <p class="text-muted">Создать новый учебный курс</p>
                            </div>
                        </a>
                    </div>

                    <div class="stat-card">
                        <a href="#" class="nav-link" data-tab="modules-tab">
                            <div class="stat-header">
                                <div class="stat-icon">
                                    <i class="bi bi-plus-circle"></i>
                                </div>
                            </div>
                            <div class="stat-content">
                                <h4>Добавить модуль</h4>
                                <p class="text-muted">Создать новый модуль обучения</p>
                            </div>
                        </a>
                    </div>

                    <div class="stat-card">
                        <a href="#" class="nav-link" data-tab="users-tab">
                            <div class="stat-header">
                                <div class="stat-icon">
                                    <i class="bi bi-people"></i>
                                </div>
                            </div>
                            <div class="stat-content">
                                <h4>Управление пользователями</h4>
                                <p class="text-muted">Просмотр и управление пользователями</p>
                            </div>
                        </a>
                    </div>

                </div>
            </section>
        </div>

        <!-- Заявки -->
        <div class="tab-content" id="requests-tab">
            <section class="content-section">
                <h2 class="section-title">Управление заявками</h2>
                <div class="card">
                    <div class="card-body">
                        <p>Здесь будет контент для управления заявками...</p>
                        <p>Таблицы, фильтры, статусы заявок и т.д.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- Курсы -->
        <div class="tab-content" id="courses-tab">
            <div class="d-flex mb-4">
                <button class="btn btn-outline-primary mx-2" onclick="switchToView('showEditCourseView')">
                    <i class="bi bi-plus-circle me-1"></i>Добавить курс
                </button>
                <button class="btn btn-outline-primary" onclick="switchToView('showAddCourseView')">
                    <i class="bi bi-pencil me-1"></i>Редактировать курсы
                </button>
            </div>
            <div id="viewContainer">
                <div class="view-content showAddCourseView">
                    <#include 'admin/editCourses.ftlh'>
                </div>
                <div class="view-content showEditCourseView">
                    <#include 'admin/addCourse.ftlh'>
                </div>
            </div>
        </div>
        <!-- Модули -->
        <div class="tab-content" id="modules-tab">
            <section class="content-section">
                <h2 class="section-title">Управление модулями</h2>
                <div class="card">
                    <div class="card-body">
                        <p>Здесь будет контент для управления модулями...</p>
                        <p>Создание и редактирование учебных модулей.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- Пользователи -->
        <div class="tab-content" id="users-tab">
            <section class="content-section">
                <h2 class="section-title">Управление пользователями</h2>
                <div class="card">
                    <div class="card-body">
                        <p>Здесь будет контент для управления пользователями...</p>
                        <p>Список пользователей, роли, права доступа.</p>
                    </div>
                </div>
            </section>
        </div>

        <!-- Настройки -->
        <div class="tab-content" id="settings-tab">
            <section class="content-section">
                <h2 class="section-title">Настройки системы</h2>
                <div class="card">
                    <div class="card-body">
                        <p>Здесь будут настройки системы...</p>
                        <p>Конфигурация, параметры, системные настройки.</p>
                    </div>
                </div>
            </section>
        </div>
    </main>
</div>

<#--Модальное окно просмотра подробной информации о заявке-->
<div class="modal fade" id="offerContentModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="offerTitle">
                    <i class="bi bi-lightbulb me-2"></i>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
            </div>

            <form id="sendOffer">
                <div class="modal-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Тема</label>
                            <textarea type="text" name="topic" id="offerTopic" class="form-control"
                                      rows="1" required></textarea>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Описание</label>
                        <textarea name="description" class="form-control"
                                  minlength="50" maxlength="2000" rows="5" id="offerDescriptionBody"
                                  disabled
                                  required>
                        </textarea>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Модальное окно ответа администратора -->
<div class="modal fade" id="offerResponseModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header bg-primary text-white">
                <h5 class="modal-title">
                    <i class="bi bi-chat-dots me-2"></i>Обновление заявки
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
            </div>

            <form id="adminUpdateForm">
                <input type="hidden" id="offerId" name="id">

                <div class="modal-body">
                    <!-- Ответ администратора -->
                    <div class="mb-3">
                        <label class="form-label">Ответ пользователю</label>
                        <textarea name="response" class="form-control"
                                  placeholder="Введите ваш ответ пользователю..."
                                  rows="4" maxlength="2000"></textarea>
                        <div class="form-text">Максимум 2000 символов</div>
                    </div>

                    <!-- Выбор статуса -->
                    <div class="mb-3">
                        <label class="form-label">Статус заявки</label>
                        <select name="status" class="form-select" required>
                            <option value="">Выберите статус...</option>
                            <option value="APPROVED">Принята</option>
                            <option value="REJECTED">Отклонена</option>
                            <option value="COMPLETED">Выполнена</option>
                        </select>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="bi bi-x-circle me-2"></i>Отмена
                    </button>
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send me-2"></i>Обновить
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/js/bootstrap.bundle.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/jquery/3.7.1/jquery.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/adminOfferResponse.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-courses/adminAddCourse.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-courses/adminEditCourse.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Анимация статистики
        const statNumbers = document.querySelectorAll('.stat-content h3');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 30;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 30);
        });

        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const sidebar = document.querySelector('.admin-sidebar');

        if (mobileMenuBtn && sidebar) {
            mobileMenuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Переключение вкладок
        const navLinks = document.querySelectorAll('.nav-link[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');

        // Функция для переключения вкладок
        function switchTab(tabId) {
            // Скрываем все вкладки
            tabContents.forEach(tab => {
                tab.classList.remove('active');
            });

            // Показываем нужную вкладку
            const targetTab = document.getElementById(tabId);
            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.classList.add('fade-in');

                // Убираем класс анимации после завершения
                setTimeout(() => {
                    targetTab.classList.remove('fade-in');
                }, 500);
            }
        }

        // Обработчики кликов по ссылкам меню
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Убираем активный класс у всех ссылок
                navLinks.forEach(l => l.classList.remove('active'));

                // Добавляем активный класс к текущей ссылке
                this.classList.add('active');

                // Переключаем вкладку
                const targetTabId = this.getAttribute('data-tab');
                switchTab(targetTabId);
            });
        });

        // Инициализация первой вкладки
        const activeLink = document.querySelector('.nav-link.active[data-tab]');
        if (activeLink) {
            const initialTabId = activeLink.getAttribute('data-tab');
            switchTab(initialTabId);
        }
    });
</script>
</body>
</html>