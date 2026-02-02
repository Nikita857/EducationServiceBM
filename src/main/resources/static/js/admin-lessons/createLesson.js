// Глобальные переменные
let modulesList = [];

// Инициализация формы
function initCreateLessonForm() {
    loadModules();
    bindFormEvents();
}

// Загрузка списка модулей
async function loadModules() {
    try {
        const response = await fetch('/admin/modules/json');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                modulesList = data.data;
                populateModulesSelect();
            }
        }
    } catch (error) {
        showAlert('Не удалось загрузить список модулей', 'error');
    }
}

// Заполнение select модулей
function populateModulesSelect() {
    const select = document.getElementById('moduleId');
    select.innerHTML = '<option value="">Выберите модуль</option>';

    modulesList.forEach(module => {
        const option = document.createElement('option');
        option.value = module.moduleId;
        if(module.moduleStatus === "ACTIVE") {
            option.textContent = `(Курс: ${module.courseName}) Модуль: ${module.moduleTitle}`;
        } else {
            option.textContent = `НЕАКТИВЕН (Курс: ${module.courseName}) Модуль: ${module.moduleTitle}`;
            option.disabled = true;
        }
        select.appendChild(option);
    });
}

// Привязка событий формы
function bindFormEvents() {
    const submitBtn = document.getElementById('submitLessonBtn');
    const form = document.getElementById('createLessonForm');

    if (submitBtn) {
        submitBtn.addEventListener('click', handleLessonSubmit);
    }

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLessonSubmit();
        });
    }

    // Очистка формы при закрытии модального окна
    const modal = document.getElementById('createLessonModal');
    if (modal) {
        modal.addEventListener('hidden.bs.modal', resetForm);
    }
}

// Обработчик отправки формы
async function handleLessonSubmit() {
    if (!validateLessonForm()) {
        return;
    }

    try {
        showLoading(true);

        const formData = new FormData();
        formData.append('file', document.getElementById('videoFile').files[0]);
        formData.append('moduleId', document.getElementById('moduleId').value);
        formData.append('title', document.getElementById('lessonTitle').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('shortDescription', document.getElementById('shortDescription').value);
        formData.append('testCode', document.getElementById('testCode').value);

        const response = await fetch('/admin/lesson/upload', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            handleSuccessResponse(result);
        } else {
            handleErrorResponse(result);
        }

    } catch (error) {
        showAlert('Произошла ошибка при создании урока', 'error');
    } finally {
        showLoading(false);
    }
}

// Валидация формы
function validateLessonForm() {
    const form = document.getElementById('createLessonForm');

    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }

    // Проверка размера файла (максимум 500MB)
    const fileInput = document.getElementById('videoFile');
    if (fileInput.files[0] && fileInput.files[0].size > 200 * 1024 * 1024) {
        showAlert('Размер файла не должен превышать 200MB', 'error');
        return false;
    }

    return true;
}

// Обработка успешного ответа
function handleSuccessResponse(result) {
    showAlert('Урок успешно создан!', 'success');

    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('createLessonModal'));
    modal.hide();

    void loadLessons()
}

// Обработка ошибки
function handleErrorResponse(result) {
    const errorMessage = result.message || 'Не удалось создать урок';
    showAlert(errorMessage, 'error');

    // Дополнительная обработка специфических ошибок
    if (result.message && result.message.includes('file')) {
        highlightFileInput();
    }
}

// Сброс формы
function resetForm() {
    document.getElementById('createLessonForm').reset();
    removeValidationStyles();
}

// Удаление стилей валидации
function removeValidationStyles() {
    const inputs = document.querySelectorAll('#createLessonForm .is-invalid');
    inputs.forEach(input => {
        input.classList.remove('is-invalid');
    });
}

// Подсветка поля файла
function highlightFileInput() {
    const fileInput = document.getElementById('videoFile');
    fileInput.classList.add('is-invalid');
}

// Показать/скрыть загрузку
function showLoading(show) {
    const submitBtn = document.getElementById('submitLessonBtn');
    if (submitBtn) {
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Создание...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus me-1"></i> Создать урок';
        }
    }
}

// Функция для открытия модального окна
function openCreateLessonModal() {
    // Загружаем модули если еще не загружены
    if (modulesList.length === 0) {
        loadModules();
    }

    const modal = new bootstrap.Modal(document.getElementById('createLessonModal'));
    modal.show();
}

// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    initCreateLessonForm();

    // Добавляем кнопку открытия модального окна если нужно
    const addButton = document.querySelector('[onclick="openCreateLessonModal()"]');
    if (addButton) {
        addButton.addEventListener('click', openCreateLessonModal);
    }
});

// CSS стили для формы
const formStyles = `
#createLessonModal .modal-content {
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-header {
    background: var(--primary-gradient);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-title {
    color: white;
    font-weight: 600;
}

#createLessonModal .form-select {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
}

#createLessonModal .form-select option {
    background-color: var(--card-bg);
    color: #e2e8f0;
}

#createLessonModal .form-control:focus,
#createLessonModal .form-select:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: #6366f1;
    box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
    color: #e2e8f0;
}

#createLessonModal .is-invalid {
    border-color: #ef4444 !important;
}

#createLessonModal .form-text {
    color: #94a3b8;
    font-size: 0.875rem;
}
`;

// Добавляем стили в документ
const styleSheet = document.createElement('style');
styleSheet.textContent = formStyles;
document.head.appendChild(styleSheet);

window.openCreateLessonModal = openCreateLessonModal;