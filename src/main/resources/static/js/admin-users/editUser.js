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
        /******************************************
        * Добавить функционал для изменения ролей *
        * а то нейронка ебанашка нихуя не сделала *
        *******************************************/

        // Показываем модальное окно
        const modal = new bootstrap.Modal(modalElement);

        $('#editUserName').text(`${currentEditingUser.firstName} ${currentEditingUser.lastName}`);
        $('#editUserUsername').text(`${currentEditingUser.username}`);
        $('#editUserDepartment').val(`${currentEditingUser['department']}`);
        $('#editUserJobTitle').val(`${currentEditingUser['jobTitle']}`);
        $('#editUserQualification').val(`${currentEditingUser['qualification']}`);

        modal.show();

    } catch (error) {
        console.error('Ошибка открытия модального окна:', error);
        alert('Не удалось открыть форму редактирования');
    }
}

// Сохранение изменений
async function saveUserChanges() {
    try {
        const formData = {
            userId: document.getElementById('editUserId').value,
            department: document.getElementById('editUserDepartment').value,
            jobTitle: document.getElementById('editUserJobTitle').value,
            qualification: document.getElementById('editUserQualification').value
        };

        console.log(formData)

        const response = await fetch('/admin/users/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('Данные успешно обновлены!');

            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();

            // Обновляем таблицу пользователей
            loadUsers(currentPage);

        } else {
            alert(result.message || 'Ошибка при сохранении данных');
        }

    } catch (error) {
        console.error('Ошибка сохранения:', error);
        alert('Произошла ошибка при сохранении данных');
    }
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