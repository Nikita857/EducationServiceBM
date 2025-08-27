<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/adminAddModule.css">
    <title>Document</title>
</head>
<body>
<div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <a href="#" class="brand-logo">
                <i class="bi bi-code-slash"></i>
                <span>EduAdmin</span>
            </a>
        </div>

        <div class="nav-section">
            <h3 class="nav-title">Основное</h3>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-speedometer2"></i>
                    <span>Дашборд</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-journals"></i>
                    <span>Курсы</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link active">
                    <i class="bi bi-collection"></i>
                    <span>Модули</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-people"></i>
                    <span>Пользователи</span>
                </a>
            </div>
        </div>

        <div class="nav-section">
            <h3 class="nav-title">Контент</h3>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-file-earmark-text"></i>
                    <span>Материалы</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-question-circle"></i>
                    <span>Тесты</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-chat-left-text"></i>
                    <span>Комментарии</span>
                </a>
            </div>
        </div>

        <div class="nav-section">
            <h3 class="nav-title">Настройки</h3>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-gear"></i>
                    <span>Общие</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-credit-card"></i>
                    <span>Платежи</span>
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="bi bi-box-arrow-right"></i>
                    <span>Выход</span>
                </a>
            </div>
        </div>
    </aside>

    <!-- Header -->
    <header class="admin-header">
        <h1 class="header-title">Добавление модуля</h1>
        <div class="header-actions">
            <button class="btn btn-sm btn-primary">
                <i class="bi bi-bell"></i>
            </button>
            <div class="dropdown">
                <button class="btn btn-sm btn-primary dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="bi bi-person-circle"></i>
                    Администратор
                </button>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="#">Профиль</a></li>
                    <li><a class="dropdown-item" href="#">Настройки</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#">Выйти</a></li>
                </ul>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="admin-main">
        <div class="content-section">
            <div class="section-header">
                <h2 class="section-title">Новый модуль</h2>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary">
                        <i class="bi bi-arrow-left"></i> Назад
                    </button>
                </div>
            </div>

            <div class="form-container">
                <form id="moduleForm">
                    <!-- Основная информация -->
                    <div class="form-section">
                        <h3 class="form-section-title">
                            <i class="bi bi-info-circle"></i>
                            Основная информация
                        </h3>

                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <label for="moduleTitle" class="form-label">Название модуля</label>
                                <input type="text" class="form-control" id="moduleTitle" placeholder="Введите название модуля" required>
                                <div class="char-counter">
                                    <span id="titleCounter">0</span>/100 символов
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="moduleSlug" class="form-label">URL-адрес</label>
                                <input type="text" class="form-control" id="moduleSlug" placeholder="avtomatizaciya-testirovaniya" required>
                                <div class="char-counter">
                                    <span id="slugCounter">0</span>/50 символов
                                </div>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label for="moduleDescription" class="form-label">Краткое описание</label>
                            <textarea class="form-control" id="moduleDescription" rows="3" placeholder="Опишите кратко содержание модуля"></textarea>
                            <div class="char-counter">
                                <span id="descriptionCounter">0</span>/255 символов
                            </div>
                        </div>

                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <label for="moduleCourse" class="form-label">Курс</label>
                                <select class="form-control" id="moduleCourse" required>
                                    <option value="">Выберите курс</option>
                                    <option value="1">Основы программирования</option>
                                    <option value="2">Веб-разработка</option>
                                    <option value="3">Мобильная разработка</option>
                                    <option value="4">Data Science</option>
                                </select>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="moduleOrder" class="form-label">Порядковый номер</label>
                                <input type="number" class="form-control" id="moduleOrder" min="1" value="1" required>
                            </div>
                        </div>
                    </div>

                    <!-- Содержание модуля -->
                    <div class="form-section">
                        <h3 class="form-section-title">
                            <i class="bi bi-journal-text"></i>
                            Содержание модуля
                        </h3>

                        <div class="mb-4">
                            <label for="moduleContent" class="form-label">Содержание модуля</label>
                            <textarea class="form-control" id="moduleContent" rows="6" placeholder="Детальное описание модуля, учебный материал..."></textarea>
                            <div class="char-counter">
                                <span id="contentCounter">0</span>/5000 символов
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label">Загрузка материалов</label>
                            <div class="image-upload" id="uploadArea">
                                <i class="bi bi-cloud-arrow-up" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                                <p>Перетащите файлы сюда или нажмите для загрузки</p>
                                <small class="text-muted">Максимальный размер файла: 10MB</small>
                                <img src="" class="image-preview" id="imagePreview" alt="Превью">
                            </div>
                            <input type="file" id="fileInput" style="display: none;" accept=".pdf,.doc,.docx,.zip">
                        </div>
                    </div>

                    <!-- Настройки -->
                    <div class="form-section">
                        <h3 class="form-section-title">
                            <i class="bi bi-gear"></i>
                            Настройки модуля
                        </h3>

                        <div class="row mb-4">
                            <div class="col-md-6 mb-3">
                                <label class="form-label">Статус модуля</label>
                                <div class="module-status">
                                    <span class="text-muted">Неактивно</span>
                                    <label class="status-toggle">
                                        <input type="checkbox" id="moduleStatus">
                                        <span class="toggle-slider"></span>
                                    </label>
                                    <span class="text-success">Активно</span>
                                </div>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="moduleDifficulty" class="form-label">Сложность</label>
                                <select class="form-control" id="moduleDifficulty">
                                    <option value="beginner">Начальный</option>
                                    <option value="intermediate" selected>Средний</option>
                                    <option value="advanced">Продвинутый</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-4">
                            <label class="form-label">Доступность</label>
                            <div class="form-check mb-2">
                                <input class="form-check-input" type="checkbox" id="freeAccess" checked>
                                <label class="form-check-label" for="freeAccess">
                                    Бесплатный модуль
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="certificateIncluded">
                                <label class="form-check-label" for="certificateIncluded">
                                    Выдавать сертификат после завершения
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Действия -->
                    <div class="d-flex justify-content-end gap-3">
                        <button type="button" class="btn btn-light">
                            <i class="bi bi-x-circle"></i> Отменить
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-plus-circle"></i> Создать модуль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Счетчики символов
        const titleInput = document.getElementById('moduleTitle');
        const slugInput = document.getElementById('moduleSlug');
        const descriptionInput = document.getElementById('moduleDescription');
        const contentInput = document.getElementById('moduleContent');

        const titleCounter = document.getElementById('titleCounter');
        const slugCounter = document.getElementById('slugCounter');
        const descriptionCounter = document.getElementById('descriptionCounter');
        const contentCounter = document.getElementById('contentCounter');

        function updateCounter(element, counter, max) {
            const length = element.value.length;
            counter.textContent = length;

            if (length > max * 0.9) {
                counter.style.color = '#ef4444';
            } else if (length > max * 0.75) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#94a3b8';
            }
        }

        titleInput.addEventListener('input', () => updateCounter(titleInput, titleCounter, 100));
        slugInput.addEventListener('input', () => updateCounter(slugInput, slugCounter, 50));
        descriptionInput.addEventListener('input', () => updateCounter(descriptionInput, descriptionCounter, 255));
        contentInput.addEventListener('input', () => updateCounter(contentInput, contentCounter, 5000));

        // Генерация slug из title
        titleInput.addEventListener('blur', function() {
            if (slugInput.value === '') {
                const slug = titleInput.value
                    .toLowerCase()
                    .replace(/\s+/g, '-')
                    .replace(/[^\w\-]+/g, '')
                    .replace(/\-\-+/g, '-')
                    .replace(/^-+/, '')
                    .replace(/-+$/, '');
                slugInput.value = slug;
                updateCounter(slugInput, slugCounter, 50);
            }
        });

        // Загрузка файлов
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const imagePreview = document.getElementById('imagePreview');

        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });

        fileInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imagePreview.src = e.target.result;
                        imagePreview.style.display = 'block';
                    }
                    reader.readAsDataURL(file);
                } else {
                    imagePreview.style.display = 'none';
                    uploadArea.querySelector('p').textContent = `Файл: ${file.name}`;
                }
            }
        });

        // Drag and drop для загрузки файлов
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.borderColor = '#6366f1';
            this.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        });

        uploadArea.addEventListener('dragleave', function() {
            this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            this.style.backgroundColor = 'transparent';
        });

        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            this.style.backgroundColor = 'transparent';

            const file = e.dataTransfer.files[0];
            if (file) {
                fileInput.files = e.dataTransfer.files;
                const event = new Event('change');
                fileInput.dispatchEvent(event);
            }
        });

        // Обработка формы
        document.getElementById('moduleForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Здесь будет код для отправки данных формы
            alert('Модуль успешно создан!');
        });
    });
</script>
</body>
</html>