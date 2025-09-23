<!doctype html>
<html lang=ru data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/admin.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/adminModule.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/custom-alert.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
<#--    <script src="https://cdn.tiny.cloud/1/7q79b4cg9k3a3qctp723vlt7l6n70oxa7l90sdaq5s0kf3bj/tinymce/8/tinymce.min.js" referrerpolicy="origin" crossorigin="anonymous"></script>-->
    <script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
    <script src="${springMacroRequestContext.contextPath}/webjars/jquery/3.7.1/jquery.min.js"></script>
    <script type="module" src="${springMacroRequestContext.contextPath}/js/admin-bundle.js"></script>

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
<div id="custom-alert-container"></div>
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
                    <a href="#" class="nav-link" data-tab="dashboard-tab">
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

                <div class="dropdown nav-item">
                    <button class="border-0 w-100 text-center text-muted nav-link bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-stack"></i> Курсы
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="nav-link" id="openAddModuleTab" data-tab="courses-add-tab" href="#">Добавление курса</a></li>
                        <li><a class="nav-link"  data-tab="courses-edit-tab" href="#">Редактирование курсов</a></li>
                    </ul>
                </div>
                <div class="dropdown nav-item">
                    <button class="border-0 w-100 text-center text-muted nav-link bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-stickies"></i> Модули
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="nav-link"  data-tab="modules-edit-tab" href="#" >Редактирование модулей</a></li>
                        <li><a class="nav-link"  data-tab="create-module-tab" href="#">Добавить модуль</a></li>
                    </ul>
                </div>
                <div class="dropdown nav-item">
                    <button class="border-0 w-100 text-center text-muted nav-link bg-transparent dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="bi bi-card-checklist"></i> Уроки
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="nav-link"  data-tab="lessons-edit-tab" href="#" onclick="loadLessons()">Редактирование уроков</a></li>
                        <li><a class="nav-link"  data-tab="create-lesson-test-tab" href="#">Сформировать тест по уроку</a></li>
                    </ul>
                </div>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="users-tab" onclick="loadUsers()">
                        <i class="bi bi-people"></i>
                        Пользователи
                    </a>
                </div>
                <div class="nav-item">
                    <a href="#" class="nav-link" data-tab="docs-tab" onclick="loadDocuments()">
                        <i class="bi bi-people"></i>
                        Документация
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
                    <a href="#" class="nav-link" id="logoutButton">
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
                            <h3>${offersTotal}</h3>
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
                            <h3>${courses}</h3>
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
                            <h3>${users}</h3>
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
                            <h3>${modules}</h3>
                            <p class="text-muted">Модулей обучения</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Recent Activity Section -->
            <section class="content-section">
                <#if offers != 0 >
                    <div class="alert alert-info" role="alert">
                        У вас есть не рассмотреные заявки - ${offers}
                    </div>
                </#if>
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

                    </div>
                </div>
            </section>
        </div>

        <!-- Добавление курса -->
        <div class="tab-content" id="courses-add-tab">
            <section class="content-section">
                <h2 class="section-title">Добавление курса</h2>
                <div class="card">
                    <div class="card-body">
                        <#include 'admin/addCourse.ftlh'>
                    </div>
                </div>
            </section>
        </div>
        <#-- Редактирование курса -->
        <div class="tab-content" id="courses-edit-tab">
            <section class="content-section">
                <h2 class="section-title">Редактирование курса</h2>
                <div class="card">
                    <div class="card-body">

                    </div>
                </div>
            </section>
        </div>

        <div class="tab-content" id="courses-add-tab">
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

        <#--Модули-->
        <div class="tab-content" id="create-module-tab">
            <section class="content-section">
                <h2 class="section-title">Добавление модуля</h2>
                <div class="card">
                    <div class="card-body">
                        <form id="createModuleForm">
                            <div class="mb-3">
                                <label for="moduleTitle" class="form-label">Название модуля</label>
                                <input type="text" class="form-control" id="moduleTitle" name="title" placeholder="Введите название модуля" required>
                            </div>
                            <div class="mb-3">
                                <label for="moduleSlug" class="form-label">URI (часть URL)</label>
                                <input type="text" class="form-control" id="moduleSlug" name="slug" placeholder="naprimer-takoi-uri" required>
                                <div class="form-text">Используйте латинские буквы, цифры и дефисы.</div>
                            </div>
                            <div class="mb-3">
                                <label for="moduleCourseId" class="form-label">Привязать к курсу</label>
                                <select class="form-select" id="moduleCourseId" name="courseId" required>
                                    <option value="" selected disabled>Выберите курс...</option>
                                    <!-- Курсы будут загружены динамически с помощью JS -->
                                </select>
                            </div>
                            <div class="d-flex justify-content-end">
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-plus-circle me-2"></i>Создать модуль
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </div>
        <div class="tab-content" id="modules-edit-tab">
            <section class="content-section">
                <div id="modulesContainer">
                    <div class="table-row">
                        <div colspan="7" class="text-center py-4 text-muted">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            Загрузка модулей...
                        </div>
                    </div>
                </div>
                <!-- Пагинация модулей -->
                <div class="pagination-container mt-3" id="modulesPagination"></div>
            </section>
        </div>

        <!-- Уроки -->
        <div class="tab-content" id="lessons-edit-tab">
            <section class="content-section">
                <!-- Строки с уроками будут добавляться через JavaScript -->
                <div id="lessonsContainer">
                    <div class="table-row">
                        <div colspan="7" class="text-center py-4 text-muted">
                            <i class="fas fa-spinner fa-spin me-2"></i>
                            Загрузка уроков...
                        </div>
                    </div>
                </div>
                <!-- Пагинация уроков -->
                <div class="pagination-container mt-3" id="lessonsPagination"></div>
            </section>
        </div>
        <div class="tab-content" id="create-lesson-test-tab">
            <section class="content-section">
                <div class="card bg-dark border-secondary">
                    <div class="card-header">
                        <h5 class="card-title mb-0">Генератор тестов</h5>
                    </div>
                    <div class="card-body">
                        <form id="testGeneratorForm">
                            <div id="questionsContainer" class="mb-3">
                                <!-- Вопросы будут добавляться динамически -->
                            </div>

                            <div class="d-flex justify-content-between">
                                <button type="button" class="btn btn-outline-secondary" id="addQuestionBtn">
                                    <i class="bi bi-plus-circle me-1"></i> Добавить вопрос
                                </button>
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-code-square me-1"></i> Сгенерировать код
                                </button>
                            </div>
                        </form>

                        <div class="mt-4" id="resultContainer" style="display: none;">
                            <label class="form-label">Сгенерированный код:</label>
                            <pre class="bg-black text-light p-3 rounded"><code id="generatedCode"></code></pre>
                            <button class="btn btn-success mt-2" onclick="copyToClipboard()">
                                <i class="bi bi-clipboard me-1"></i> Копировать код
                            </button>
                        </div>
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
                        <#--Here is injects users table from admin-users/getUsers.js-->
                    </div>
                </div>
            </section>
        </div>

        <!-- Документация -->
        <div class="tab-content" id="docs-tab">
            <section class="content-section">
                <h2 class="section-title">Управление документацией</h2>
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex align-items-center gap-2 flex-wrap mb-3">
                            <div class="filter-group">
                                <select class="form-select form-select-sm" id="courseFilterSelect" onchange="loadDocuments(1)">
                                    <option value="">Все курсы</option>
                                </select>
                            </div>
                            <div class="filter-group">
                                <select class="form-select form-select-sm" id="categoryFilterSelect" onchange="loadDocuments(1)">
                                    <option value="">Все категории</option>
                                </select>
                            </div>
                            <div class="page-size-selector">
                                <div class="input-group input-group-sm">
                                    <span class="input-group-text">Отображать</span>
                                    <select class="form-select" id="docsPageSizeSelect" onchange="changeDocsPerPage(this.value)">
                                        <option value="5">5</option>
                                        <option value="10">10</option>
                                        <option value="20">20</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="openCreateDocumentModal()">
                                <i class="bi bi-plus-circle me-1"></i>Новый документ
                            </button>
                        </div>
                        <div id="documentsContainer">
                            <!-- Documents table will be loaded here by JavaScript -->
                            <div class="table-row">
                                <div colspan="7" class="text-center py-4 text-muted">
                                    <i class="fas fa-spinner fa-spin me-2"></i>
                                    Загрузка документов...
                                </div>
                            </div>
                        </div>
                        <!-- Pagination for documents -->
                        <div class="pagination-container mt-3" id="documentsPagination"></div>
                    </div>
                </div>
            </section>
        </div>

        <!-- Настройки -->
        <div class="tab-content" id="settings-tab">
            <section class="content-section">
                <h2 class="section-title">Настройки системы</h2>
                <div class="card bg-transparent">
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
                        aria-label="Close"><i class="bi bi-x-lg"></i></button>
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
                    <i class="bi bi-chat-dots me-2"></i>Обновление заявки #<span id="responseOfferId"></span>
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>

            <form id="adminUpdateForm">
                <input type="hidden" id="offerId" name="id">

                <div class="modal-body">

                    <div class="mb-3">
                        <label for="responseDescription">Текст заявки</label>
                        <div class="card">
                            <div class="card-body" id="responseDescription">
                                <#--Сюда выводится текст заявки-->
                            </div>
                        </div>
                    </div>
                    <!-- Ответ администратора -->
                    <div class="mb-3">
                        <label class="form-label">Ответ пользователю</label>
                        <textarea id="responseText" name="response" class="form-control"
                                  placeholder="Введите ваш ответ пользователю..."
                                  rows="4" maxlength="2000"></textarea>
                        <div class="form-text">Максимум 2000 символов</div>
                    </div>

                    <!-- Выбор статуса -->
                    <div class="mb-3">
                        <label class="form-label">Статус заявки</label>
                        <select id="responseStatus" name="status" class="form-select bg-dark text-light" required>
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

<!-- Модальное окно редактирования пользователя -->
<div class="modal fade" id="editUserModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Редактирование пользователя</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="editUserId">

                <div class="row mb-3">
                    <div class="col-md-6">
                        <label class="form-label">Пользователь:</label>
                        <p class="form-control-plaintext fw-bold" id="editUserName"></p>
                    </div>
                    <div class="col-md-6">
                        <label class="form-label">Логин:</label>
                        <p class="form-control-plaintext" id="editUserUsername"></p>
                    </div>
                </div>

                <div class="row mb-3">
                    <div class="col-6">
                        <div class="mb-3">
                            <label class="form-label">Отдел:</label>
                            <input type="text" id="editUserDepartment" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Должность:</label>
                            <input type="text" id="editUserJobTitle" class="form-control">
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="mb-3">
                            <label class="form-label">Квалификация:</label>
                            <input type="text" id="editUserQualification" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Роль:</label>
                            <select id="editUserRole" class="form-select">
                                <option value="" selected>Выберите роль</option>
                                <option value="ROLE_ADMIN">Администратор</option>
                                <option value="ROLE_USER">Пользователь</option>
                            </select>
                        </div>
                        <input type="hidden" id="userIdForUpdate">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-primary" id="saveUserChangesBtn">Сохранить изменения</button>
            </div>
        </div>
    </div>
</div>

<#--Оболочка для интеграции модального окна просмотра изобржаения курса-->
<div id="img-view-modal"></div>


<!-- Модальноe окно для редактирования модулей -->
<div class="modal fade" id="editModuleModal" tabindex="-1" aria-labelledby="editModuleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editModuleModalLabel">Редактировать модуль</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editModuleForm">
                    <input type="hidden" id="editModuleId" name="moduleId">
                    <div class="mb-3">
                        <label for="editModuleTitle" class="form-label">Название модуля</label>
                        <input type="text" class="form-control" id="editModuleTitle" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label for="editModuleSlug" class="form-label">URI</label>
                        <input type="text" class="form-control" id="editModuleSlug" name="slug" required>
                    </div>
                    <div class="mb-3">
                        <label for="editModuleCourseId" class="form-label">Курс</label>
                        <select class="form-select" id="editModuleCourseId" name="courseId" required>
                            <!-- Courses will be loaded here -->
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                <button type="submit" form="editModuleForm" class="btn btn-primary">Сохранить изменения</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно редактирования уроков -->
<div class="modal fade" id="editLessonModal" tabindex="-1" aria-labelledby="editLessonModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="editLessonModalLabel">Редактировать урок</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="editLessonForm">
                    <input type="hidden" id="editLessonId" name="lessonId">
                    <div class="mb-3">
                        <label for="editLessonTitle" class="form-label">Название урока</label>
                        <input type="text" class="form-control" id="editLessonTitle" name="title" required>
                    </div>
                    <div class="mb-3">
                        <label for="editLessonVideoUrl" class="form-label">URL видео</label>
                        <input type="text" class="form-control" id="editLessonVideoUrl" name="videoUrl">
                    </div>
                    <div class="mb-3">
                        <label for="editLessonTextContent" class="form-label">Содержимое урока</label>
                        <textarea id="editLessonTextContent" name="textContent" class="form-control" rows="15"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                <button type="submit" form="editLessonForm" class="btn btn-primary">Сохранить изменения</button>
            </div>
        </div>
    </div>
</div>
<script src="${springMacroRequestContext.contextPath}/js/logoutScript.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/custom-alert.js"></script>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Анимация статистики
        const statNumbers = document.querySelectorAll('.stat-content h3');
        statNumbers.forEach(stat => {
            const target = parseInt(stat.textContent);
            if (isNaN(target)) return;
            let current = 0;
            const increment = Math.max(1, target / 30);

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

        // --- MODIFIED TAB LOGIC WITH LOCALSTORAGE ---
        const navLinks = document.querySelectorAll('.nav-link[data-tab]');
        const tabContents = document.querySelectorAll('.tab-content');

        function switchTab(tabId) {
            if (!tabId) return;

            // Hide all tabs and remove active class from links
            tabContents.forEach(tab => tab.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));

            // Show the target tab and set active class on the link
            const targetTab = document.getElementById(tabId);
            const targetLink = document.querySelector('.nav-link[data-tab="' + tabId + '"]');

            if (targetTab) {
                targetTab.classList.add('active');
                targetTab.classList.add('fade-in');
                setTimeout(() => {
                    targetTab.classList.remove('fade-in');
                }, 500);
            }
            if (targetLink) {
                targetLink.classList.add('active');
            }

            // Save the active tab to localStorage
            try {
                localStorage.setItem('lastActiveAdminTab', tabId);
            } catch (e) {
                console.error("Could not save tab to localStorage", e);
            }
        }

        // Add click event listeners to nav links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetTabId = this.getAttribute('data-tab');
                switchTab(targetTabId);
            });
        });

        // On page load, check localStorage for the last active tab
        let lastTabId = null;
        try {
            lastTabId = localStorage.getItem('lastActiveAdminTab');
        } catch (e) {
            console.error("Could not read tab from localStorage", e);
        }

        if (lastTabId && document.getElementById(lastTabId)) {
            switchTab(lastTabId);
        } else {
            // Default to the first tab if nothing is stored or tab is invalid
            const firstTab = document.querySelector('.nav-link[data-tab]');
            if (firstTab) {
                switchTab(firstTab.getAttribute('data-tab'));
            }
        }

        // Make switchTab globally available if it's needed elsewhere
        window.switchTab = switchTab;
    });
</script>
<!-- Форма создания урока -->
<div class="modal fade" id="createLessonModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Создать новый урок</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <form id="createLessonForm" enctype="multipart/form-data">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="moduleId" class="form-label">Модуль *</label>
                                <select class="form-select" id="moduleId" name="moduleId" required>
                                    <option value="">Выберите модуль</option>
                                    <!-- Модули будут загружены динамически -->
                                </select>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="lessonTitle" class="form-label">Название урока *</label>
                                <input type="text" class="form-control" id="lessonTitle" name="title"
                                       placeholder="Введите название урока" required maxlength="100">
                            </div>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label for="videoFile" class="form-label">Видео файл *</label>
                        <input type="file" class="form-control" id="videoFile" name="file"
                               accept="video/*" required>
                        <div class="form-text">Поддерживаемые форматы: MP4, AVI, MOV, MKV</div>
                    </div>

                    <div class="mb-3">
                        <label for="description" class="form-label">Описание</label>
                        <textarea class="form-control" id="description" name="description" rows="4"
                                  placeholder="Полное описание урока" maxlength="5000"></textarea>
                    </div>

                    <div class="mb-3">
                        <label for="shortDescription" class="form-label">Краткое описание *</label>
                        <input type="text" class="form-control" id="shortDescription" name="shortDescription"
                               placeholder="Краткое описание (до 50 символов)" required maxlength="50">
                    </div>

                    <div class="mb-3">
                        <label for="testCode" class="form-label">Код теста</label>
                        <textarea class="form-control" id="testCode" name="testCode" rows="6"
                                  placeholder="const questions = [ ... ];"
                                  style="font-family: 'Courier New', monospace;"></textarea>
                        <div class="form-text">JavaScript код теста в формате вопрос-ответ</div>
                    </div>

                    <div class="alert alert-info">
                        <i class="fas fa-info-circle me-2"></i>
                        Поля, помеченные *, обязательны для заполнения
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-primary" id="submitLessonBtn">
                    <i class="fas fa-plus me-1"></i> Создать урок
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно записи на курс -->
<div class="modal fade" id="enrollUserModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Запись пользователя на курс</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <p>Пользователь: <strong id="enrollUserName"></strong></p>
                <input type="hidden" id="enrollUserId">
                <div class="mb-3">
                    <label for="courseSelect" class="form-label">Выберите курс:</label>
                    <select class="form-select" id="courseSelect">
                        <option selected>Загрузка курсов...</option>
                    </select>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                <button type="button" class="btn btn-primary" onclick="confirmEnrollment()">Подтвердить</button>
            </div>
        </div>
    </div>
</div>

<!-- Модальное окно просмотра курсов пользователя -->
<div class="modal fade" id="viewUserCoursesModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Курсы пользователя: <span id="viewUserName"></span></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <ul id="userCoursesList" class="list-group"></ul>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>
<!-- Create Document Modal -->
<div class="modal fade" id="createDocumentModal" tabindex="-1" aria-labelledby="createDocumentModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="createDocumentModalLabel">Создать новый документ</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="createDocumentForm" enctype="multipart/form-data">
                    <div class="mb-3">
                        <label for="docName" class="form-label">Название</label>
                        <input type="text" class="form-control" id="docName" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="docTags" class="form-label">Теги (через запятую)</label>
                        <input type="text" class="form-control" id="docTags" name="tags">
                    </div>
                    <div class="mb-3">
                        <label for="docCourse" class="form-label">Курс</label>
                        <select class="form-select" id="docCourse" name="courseId" required>
                            <!-- Courses will be populated here by JS -->
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="docCategory" class="form-label">Категория</label>
                        <select class="form-select" id="docCategory" name="categoryId" required>
                            <!-- Categories will be populated here by JS -->
                        </select>
                    </div>
                    <div class="mb-3">
                        <label for="docTextContent" class="form-label">Краткое описаниме</label>
                        <textarea class="form-control" id="docTextContent" name="textContent" rows="5"></textarea>
                    </div>
                    <div class="mb-3">
                        <label for="docImageFile" class="form-label">Файл</label>
                        <input class="form-control" type="file" id="docImageFile" name="file">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                <button type="submit" class="btn btn-primary" form="createDocumentForm">Создать</button>
            </div>
        </div>
    </div>
</div>

</body>
</html>