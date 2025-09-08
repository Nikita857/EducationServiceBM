// Глобальные переменные для хранения данных
let currentEditingUser = null;

// Функция открытия модального окна редактирования
async function openEditUserModal(userId) {
    try {
        // Загружаем данные пользователя
        const userResponse = await fetch(`/admin/user/${userId}`);
        if (!userResponse.ok) throw new Error('Ошибка загрузки данных пользователя');

        const userData = await userResponse.json();
        if (!userData.success) throw new Error(userData.message || 'Ошибка данных пользователя');

        currentEditingUser = userData.user;
        console.log(currentEditingUser);


        const modalElement = document.getElementById('editUserModal');
        if (!modalElement) {
            throw new Error('Модальное окно не найдено в DOM');
        }

        // Показываем модальное окно
        const modal = new bootstrap.Modal(modalElement);

        $('#editUserName').text(`${currentEditingUser.firstName} ${currentEditingUser.lastName}`);
        $('#editUserUsername').text(`${currentEditingUser.username}`);
        $('#editUserDepartment').val(`${currentEditingUser['department']}`);
        $('#editUserJobTitle').val(`${currentEditingUser['jobTitle']}`);
        $('#editUserQualification').val(`${currentEditingUser['qualification']}`);
        $('#userIdForUpdate').val(`${currentEditingUser['id']}`);

        modal.show();

    } catch (error) {
        console.error('Ошибка открытия модального окна:', error);
        showAlert('Не удалось открыть форму редактирования', 'error');
    }
}

// Сохранение изменений
async function saveUserChanges() {
    try {
        const formData = {
            userId: document.getElementById('userIdForUpdate').value,
            department: document.getElementById('editUserDepartment').value,
            jobTitle: document.getElementById('editUserJobTitle').value,
            qualification: document.getElementById('editUserQualification').value,
            role: document.getElementById('editUserRole').value
        };

        console.log(formData);

        const response = await fetch('/admin/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result);

        if (response.ok && result.success) {
            showAlert('Данные успешно обновлены!', 'success');

            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();

            // Обновляем таблицу пользователей
            loadUsers(currentPage);

        } else {
            // Обработка ошибок валидации
            if (result.errors) {
                displayValidationErrors(result.errors);
            } else {
                showAlert(result.error || 'Ошибка при сохранении данных', 'error');
            }
        }

    } catch (error) {
        console.error('Ошибка сохранения:', error);
        showAlert('Произошла ошибка при сохранении данных', 'error');
    }
}

// Функция для отображения ошибок валидации
function displayValidationErrors(errors) {
    let errorMessages = [];

    // Проходим по всем ошибкам и собираем сообщения
    for (const [field, message] of Object.entries(errors)) {
        errorMessages.push(`${getFieldDisplayName(field)}: ${message}`);
    }

    if (errorMessages.length > 0) {
        showAlert('Ошибки валидации:\n' + errorMessages.join('\n'), 'error');
    }
}

// Функция для получения читаемого имени поля
function getFieldDisplayName(field) {
    const fieldNames = {
        'userId': 'ID пользователя',
        'department': 'Отдел',
        'jobTitle': 'Должность',
        'qualification': 'Квалификация',
        'role': 'Роль'
    };

    return fieldNames[field] || field;
}

// Функция для получения CSRF токена
function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveUserChangesBtn').addEventListener('click', saveUserChanges);
});

// Обновите функцию editUser в основном скрипте
function editUser(userId) {
    openEditUserModal(userId);
}