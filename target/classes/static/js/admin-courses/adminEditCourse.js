document.addEventListener('DOMContentLoaded', function() {
    // Выбор всех чекбоксов
    const selectAll = document.getElementById('selectAll');
    const courseCheckboxes = document.querySelectorAll('.course-checkbox');

    selectAll.addEventListener('change', function() {
        courseCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
        });
    });

    // Редактирование полей в реальном времени
    const editableFields = document.querySelectorAll('[contenteditable="true"], .category-select, .level-select, .status-select');

    editableFields.forEach(field => {
        if (field.hasAttribute('contenteditable')) {
            // Для contenteditable полей
            field.addEventListener('blur', function() {
                saveFieldChange(this);
            });

            field.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.blur();
                }
            });
        } else {
            // Для select полей
            field.addEventListener('change', function() {
                saveFieldChange(this);
            });
        }
    });

    // Поиск и фильтрация
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');

    [searchInput, categoryFilter, statusFilter].forEach(filter => {
        filter.addEventListener('input', applyFilters);
    });

    // Массовые действия
    document.getElementById('applyMassAction').addEventListener('click', function() {
        const action = document.getElementById('massAction').value;
        const selectedCourses = Array.from(courseCheckboxes)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.dataset.courseId);

        if (selectedCourses.length === 0) {
            alert('Выберите хотя бы один курс');
            return;
        }

        if (!action) {
            alert('Выберите действие');
            return;
        }

        if (confirm(`Применить действие "${action}" к ${selectedCourses.length} курсам?`)) {
            // Здесь будет AJAX запрос для массового действия
            console.log('Массовое действие:', action, 'Курсы:', selectedCourses);
        }
    });

    // Кнопки действий
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.dataset.courseId;
            openCourseEditor(courseId);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const courseId = this.dataset.courseId;
            deleteCourse(courseId);
        });
    });
});

function saveFieldChange(field) {
    const courseId = field.dataset.courseId;
    const fieldName = field.dataset.field;
    let value;

    if (field.hasAttribute('contenteditable')) {
        value = field.textContent.trim();
    } else {
        value = field.value;
    }

    // Валидация
    if (fieldName === 'slug') {
        value = value.replace('/courses/', '').trim();
        if (!/^[a-z0-9-]+$/.test(value)) {
            alert('URL может содержать только латинские буквы, цифры и дефисы');
            field.focus();
            return;
        }
    }

    // AJAX запрос для сохранения
    console.log('Сохранение:', { courseId, field: fieldName, value });

    // Здесь будет fetch запрос к серверу
    fetch('/admin/courses/update-field', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            courseId: courseId,
            field: fieldName,
            value: value
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Изменения сохранены', 'success');
            } else {
                showNotification('Ошибка сохранения', 'error');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            showNotification('Ошибка сети', 'error');
        });
}

function applyFilters() {
    const searchText = document.getElementById('courseSearch').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const status = document.getElementById('statusFilter').value;

    document.querySelectorAll('.course-row').forEach(row => {
        const title = row.querySelector('.course-title').textContent.toLowerCase();
        const rowCategory = row.querySelector('.category-select').value;
        const rowStatus = row.querySelector('.status-select').value;

        const matchesSearch = title.includes(searchText);
        const matchesCategory = !category || rowCategory === category;
        const matchesStatus = !status || rowStatus === status;

        row.style.display = (matchesSearch && matchesCategory && matchesStatus) ? '' : 'none';
    });
}

function openCourseEditor(courseId) {
    // Открытие полной формы редактирования
    console.log('Открытие редактора курса:', courseId);
    // window.location.href = `/admin/courses/edit/${courseId}`;
}

function deleteCourse(courseId) {
    if (confirm('Вы уверены, что хотите удалить этот курс?')) {
        // AJAX запрос для удаления
        console.log('Удаление курса:', courseId);

        fetch(`/admin/courses/delete/${courseId}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showNotification('Курс удален', 'success');
                    document.querySelector(`[data-course-id="${courseId}"]`).remove();
                } else {
                    showNotification('Ошибка удаления', 'error');
                }
            });
    }
}

function showNotification(message, type) {
    // Реализация уведомлений
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
    alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
    document.body.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function showAddCourseForm() {
    // Переключение на форму добавления курса
    console.log('Показать форму добавления курса');
    // Реализация переключения между таблицей и формой
}