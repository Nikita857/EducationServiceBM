<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление модулями - Админ панель</title>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/adminModule.css">
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
                    <form id="moduleForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="courseId" class="form-label">Курс *</label>
                                <select class="form-select" id="courseId" required>
                                    <option value="">Выберите курс</option>
                                    <option value="1">Основы программирования</option>
                                    <option value="2">Веб-разработка</option>
                                    <option value="3">Базы данных</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="slug" class="form-label">Slug *</label>
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
                    <h2 class="card-title">
                        <i class="fas fa-list me-2"></i>
                        Список модулей
                    </h2>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Курс</th>
                                <th>URI</th>
                                <th>Название</th>
                                <th>Статус</th>
                                <th>Действия</th>
                            </tr>
                            </thead>
                            <tbody>
                            <#list modules as module>
                                <tr>
                                    <td>${module_index}</td>
                                    <td>${module.course.title}</td>
                                    <td>${module.slug}</td>
                                    <td>${module.title}</td>
                                    <td><span class="badge bg-success">Активен</span></td>
                                    <td>
                                        <a class="btn btn-primary dropdown-toggle" href="/admin/module/${module.id}/lessons}">
                                            Уроки модуля
                                        </a>
                                    </td>
                                    <td>
                                        <div class="action-buttons">
                                            <button class="btn btn-sm btn-outline-light btn-icon">
                                                <i class="fas fa-edit"></i>
                                            </button>
                                            <button class="btn btn-sm btn-outline-danger btn-icon">
                                                <i class="fas fa-trash"></i>
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
<script>
    // Обработка формы
    document.getElementById('moduleForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const courseId = document.getElementById('courseId').value;
        const slug = document.getElementById('slug').value;
        const title = document.getElementById('title').value;

        if (!courseId || !slug || !title) {
            alert('Пожалуйста, заполните все обязательные поля');
            return;
        }

        // Здесь будет логика отправки данных на сервер
        console.log('Данные модуля:', { courseId, slug, title });
        alert('Модуль успешно добавлен!');
        this.reset();
    });

    // Генерация slug из названия
    document.getElementById('title').addEventListener('input', function() {
        const title = this.value;
        const slugInput = document.getElementById('slug');

        if (!slugInput.value) {
            const slug = title.toLowerCase()
                .replace(/[^a-z0-9а-яё\s]/gi, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-+|-+$/g, '');
            slugInput.value = slug;
        }
    });
</script>
</body>
</html>