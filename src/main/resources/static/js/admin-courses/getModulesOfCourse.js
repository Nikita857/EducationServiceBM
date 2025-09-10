// Глобальные переменные
let currentCourse = null;
let courseModules = [];

// Функция открытия модального окна с модулями курса
async function openCourseModulesModal(courseId) {
    try {
        console.log(`Загрузка модулей для курса: ${courseId}`);

        // Загружаем модули курса
        const response = await fetch(`/admin/courses/${courseId}/modules`);
        if (!response.ok) throw new Error('Ошибка загрузки модулей курса');

        const data = await response.json();
        if (!data.success) showAlert(data.message || 'Модулей нет', 'info');

        courseModules = data.modules || [];
        currentCourse = { id: courseId, name: data.modules[0].courseName};

        // Рендерим модальное окно
        renderCourseModulesModal();

        // Показываем модальное окно
        const modalElement = document.getElementById('courseModulesModal');
        if (!modalElement) {
            throw new Error('Модальное окно модулей не найдено');
        }

        const modal = new bootstrap.Modal(modalElement);
        modal.show();

    } catch (error) {
        console.error('Ошибка открытия модального окна модулей:', error);
    }
}

// Функция рендеринга модального окна
function renderCourseModulesModal() {
    const modalContainer = document.getElementById('courseModulesModal');

    if (!modalContainer) {
        // Создаем модальное окно если его нет
        createModulesModalElement();
        return;
    }

    // Заполняем заголовок
    const modalTitle = modalContainer.querySelector('.modal-title');
    if (modalTitle) {
        modalTitle.textContent = `Модули курса: ${currentCourse.name}`;
    }

    if(courseModules.length > 0) {
        document.getElementById('modulesCount').innerText = `Модулей: ${courseModules.length}`
    }

    // Заполняем список модулей
    const modulesList = modalContainer.querySelector('#modulesList');
    if (modulesList) {
        modulesList.innerHTML = courseModules.length > 0 ?
            renderModulesList() :
            '<div class="text-center py-4 text-muted">Модули не найдены</div>';
    }
}

// Функция рендеринга списка модулей
function renderModulesList() {
    return courseModules.map((module, index) => `
        <div class="module-item" data-module-id="${module.moduleId}">
            <div class="module-header d-flex justify-content-between align-items-center">
                <div class="module-info">
                    <h6 class="module-title mb-1">${module.order || index + 1}. ${escapeHtml(module.moduleTitle || 'Без названия')}</h6>
                    <small class="text-muted">ID: ${module.moduleId} • ${module.lessonsCount || 0} уроков</small>
                </div>
                <div class="module-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editModule(${module.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <a class="btn btn-sm btn-outline-danger" href="/admin/modules">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
            <hr class="my-2">
        </div>
    `).join('');
}

// Функция создания элемента модального окна
function createModulesModalElement() {
    const modalHTML = `
        <div class="modal fade" id="courseModulesModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Модули курса</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted" id="modulesCount">Модулей: 0</span>
                            <a class="btn btn-success btn-sm" href="/admin/modules">
                                <i class="fas fa-plus me-1"></i> Добавить модуль
                            </a>
                        </div>
                        
                        <div id="modulesList" class="modules-list">
                            <div class="text-center py-4 text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                Загрузка модулей...
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" onclick="manageCourse(${currentCourse?.id})">
                            Управление курсом
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Добавляем модальное окно в body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    renderCourseModulesModal();
}

// Вспомогательные функции
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'Не указано';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    } catch (e) {
        return dateString;
    }
}

// Функции действий (заглушки)
function addNewModule() {
    console.log('Добавление нового модуля для курса:', currentCourse?.id);
    alert(`Добавление модуля для курса: ${currentCourse?.name}`);
}

function editModule(moduleId) {
    console.log('Редактирование модуля:', moduleId);
    showAlert(`Редактирование модуля: ${moduleId}`, 'info');
}

function manageCourse(courseId) {
    console.log('Управление курсом:', courseId);
    // Переход на страницу управления курсом
    window.location.href = `/admin/courses/${courseId}/edit`;
}

// Обновляем функцию в основном скрипте для вызова модального окна
function showCourseModules(courseId, courseName) {
    openCourseModulesModal(courseId, courseName);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для закрытия модального окна
    document.addEventListener('hidden.bs.modal', function(event) {
        if (event.target.id === 'courseModulesModal') {
            // Очищаем данные при закрытии
            currentCourse = null;
            courseModules = [];
        }
    });
});

window.addNewModule = addNewModule;
window.editModule = editModule;
window.manageCourse = manageCourse;
window.showCourseModules = showCourseModules;
