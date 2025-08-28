<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="_csrf" content="${_csrf.token}"/>
    <!-- default header name is X-CSRF-TOKEN -->
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <title>Управление модулями - Админ панель</title>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/adminModule.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>
<body>
<div class="admin-layout">
    <!-- Header -->
    <header class="admin-header">
        <h1 class="header-title">Управление модулями</h1>
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="/">Главная</a></li>
                <li class="breadcrumb-item active" aria-current="page">Модули</li>
            </ol>
        </nav>
        <div class="header-actions">
            <span class="text-muted">Администратор</span>
        </div>
    </header>
    <!-- Main Content -->
    <main class="admin-main">
        <!-- Форма добавления модуля -->
        <section class="content-section">
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <i class="fas fa-plus-circle me-2"></i>
                        Добавить новый модуль
                    </h2>
                </div>
                <div class="card-body">
                    <form id="moduleForm" action="/admin/">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="courseId" class="form-label">Курс *</label>
                                <select class="form-select" id="courseId" required>
                                    <#list courses as course>
                                        <option value="${course.id}">${course.title}</option>
                                    </#list>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="slug" class="form-label">URI</label>
                                <input type="text" class="form-control" id="slug"
                                       placeholder="например, introduction-to-programming" required>
                                <div class="form-text text-muted">Уникальный идентификатор для URL</div>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="title" class="form-label">Название модуля *</label>
                            <input type="text" class="form-control" id="title"
                                   placeholder="Введите название модуля" required>
                        </div>
                        <div class="d-flex gap-2">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save me-2"></i>
                                Сохранить модуль
                            </button>
                            <button type="reset" class="btn btn-outline-light">
                                <i class="fas fa-times me-2"></i>
                                Очистить
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>

        <!-- Таблица модулей -->
        <section class="content-section">
            <div class="card">
                <div class="card-header">
                    <div class="d-flex justify-content-between">
                        <h2 class="card-title">
                            <i class="fas fa-list me-2"></i>
                            Список модулей
                        </h2>
                        <form action="/admin/modules" method="get">
                            <select name="courseId" id="" class="form-select" onchange="this.form.submit()">
                                <option value="" selected>Выберите курс</option>
                                <#list courses as course>
                                    <option value="${course.id}">${course.title}</option>
                                </#list>
                            </select>
                        </form>
                    </div>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>№</th>
                                <th>Курс</th>
                                <th>URI</th>
                                <th>Название</th>
                                <th>Статус</th>
                                <th>Действия</th>
                                <th>Уроки модуля</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#list modules as module>
                                <tr>
                                    <td>${module_index}</td>
                                    <td>${module.course.title}</td>
                                    <td>${module.slug}</td>
                                    <td>${module.title}</td>
                                    <#if module.status == "ACTIVE">
                                        <td><span class="badge bg-success" style="cursor: pointer" href="/admin/modules/updateStatus/${module.id}/setInactive" onclick="adminUpdateModuleStatus(${module.id}, 'INACTIVE')">Активен</span></td>
                                    <#else>
                                        <td><span class="badge bg-secondary" style="cursor: pointer" href="/admin/modules/updateStatus/${module.id}/setActive" onclick="adminUpdateModuleStatus(${module.id}, 'ACTIVE')">Неактивен</span></td>
                                    </#if>
                                    <td>
                                        <button class="btn btn-danger" onclick="deleteModule(${module.id})">
                                            <i class="bi bi-trash"></i> Удалить
                                        </button>
                                    </td>
                                    <td>
                                        <div class="col-md-6 d-flex align-items-end">
                                            <button type="button" class="btn btn-primary" onclick="loadLessons(${module.id})">
                                                <i class="fas fa-list me-2"></i>Показать уроки
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </#list>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/js/bootstrap.bundle.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-module/adminDeleteModule.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-module/adminUpdateModuleStatus.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-module/adminCreateModule.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/admin-module/getModuleLessons.js"></script>
</body>
</html>