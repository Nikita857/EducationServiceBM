
document.addEventListener('DOMContentLoaded', function () {
    // Используем делегирование событий для кнопок редактирования
    document.getElementById('modulesContainer').addEventListener('click', function (event) {
        const editButton = event.target.closest('.edit-module-btn');
        if (editButton) {
            const moduleId = editButton.dataset.moduleId;
            openEditModuleModal(moduleId);
        }
    });

    // Обработка отправки формы
    const editModuleForm = document.getElementById('editModuleForm');
    if (editModuleForm) {
        editModuleForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            await submitEditModuleForm();
        });
    }
});

async function openEditModuleModal(moduleId) {
    try {
        // 1. Получаем данные модуля
        const response = await fetch(`/admin/module/${moduleId}`);
        const data = await response.json();
        const module = data.module;


        // 2. Заполняем поля формы
        document.getElementById('editModuleId').value = module.moduleId;
        document.getElementById('editModuleTitle').value = module.moduleTitle;
        document.getElementById('editModuleSlug').value = module.moduleSlug;

        // 3. Загружаем и устанавливаем курс
        const courseSelect = document.getElementById('editModuleCourseId');
        await loadCoursesIntoSelect(courseSelect, module.courseName);

        // 4. Показываем модальное окно
        const modal = new bootstrap.Modal(document.getElementById('editModuleModal'));
        modal.show();

    } catch (error) {
        console.error('Ошибка при открытии модального окна:', error);
    }
}

async function submitEditModuleForm() {
    const form = document.getElementById('editModuleForm');
    const moduleId = document.getElementById('editModuleId').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModuleModal'));

    const formData = {
        moduleId: moduleId,
        name: document.getElementById('editModuleTitle').value,
        slug: document.getElementById('editModuleSlug').value,
        courseId: document.getElementById('editModuleCourseId').value
    };

    try {
        const response = await fetch(`/admin/modules/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('Модуль успешно обновлен!', 'success');
            modal.hide();
            // Обновляем таблицу модулей
            if (typeof loadModules === 'function') {
                loadModules(currentModulesPage || 1);
            }
        } else {
            if (result.errors) {
                const errorMessages = Object.values(result.errors).join('\n');
                showAlert('Ошибка валидации:\n' + errorMessages, 'error');
            } else {
                throw new Error(result.message || 'Не удалось обновить модуль.');
            }
        }
    } catch (error) {
        console.error('Ошибка при обновлении модуля:', error);
        showAlert('Ошибка: ' + error.message, 'error');
    }
}

// Загрузка списка курсов в select
async function loadCoursesIntoSelect(selectElement, selectedCourseTitle) {
    try {
        const response = await fetch('/admin/courses/all');
        if (!response.ok) {
            throw new Error('Не удалось загрузить список курсов.');
        }
        const data = await response.json();
        const courses = data.courses;

        selectElement.innerHTML = '<option value="">Выберите курс</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            if (course.title === selectedCourseTitle) {
                option.selected = true;
            }
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        selectElement.innerHTML = '<option value="">Ошибка загрузки курсов</option>';
    }
}

function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.content || document.querySelector('input[name="_csrf"]')?.value;
}

window.loadCoursesIntoSelect = loadCoursesIntoSelect;
window.submitEditModuleForm = submitEditModuleForm;
window.openEditModuleModal = openEditModuleModal;

