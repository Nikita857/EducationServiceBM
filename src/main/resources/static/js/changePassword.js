/**
 * Функция для отправки данных смены пароля на сервер
 */
async function submitPasswordChange() {
    const form = document.getElementById('passwordChangeForm');

    // Собираем данные с формы
    const formData = {
        currentPassword: document.getElementById('currentPassword').value,
        newPassword: document.getElementById('newPassword').value,
        confirmPassword: document.getElementById('confirmPassword').value
    };

    // Валидация на клиенте
    if (!validatePasswordForm(formData)) {
        return;
    }

    try {

        // Отправляем запрос на сервер
        const response = await fetch('/api/user/change-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            showAlert('Пароль успешно изменен!', 'success');
            setTimeout(()=>{
                resetForm(); // Очищаем форму
                closeModal(); // Закрываем модальное окно если нужно
            }, 3000)
        } else {
            throw new Error(result.message || 'Ошибка при изменении пароля');
        }

    } catch (error) {
        console.error('Ошибка:', error);
        showAlert(error.message, 'error');
    }
}

/**
 * Валидация формы на клиенте
 */
function validatePasswordForm(formData) {
    // Проверяем что все поля заполнены
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        showAlert('Все поля обязательны для заполнения', 'error');
        return false;
    }

    // Проверяем что новый пароль и подтверждение совпадают
    if (formData.newPassword !== formData.confirmPassword) {
        showAlert('Новый пароль и подтверждение не совпадают', 'error');
        return false;
    }

    // Проверяем минимальную длину пароля
    if (formData.newPassword.length < 6) {
        showAlert('Новый пароль должен содержать минимум 6 символов', 'error');
        return false;
    }

    // Можно добавить дополнительную валидацию сложности пароля
    if (!isPasswordStrong(formData.newPassword)) {
        showAlert('Пароль должен содержать буквы, цифры и специальные символы', 'error');
        return false;
    }

    return true;
}

/**
 * Проверка сложности пароля
 */
function isPasswordStrong(password) {
    // Минимум 6 символов, хотя бы одна буква и одна цифра
    const strongRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    return strongRegex.test(password);
}





/**
 * Очистка формы
 */
function resetForm() {
    document.getElementById('passwordChangeForm').reset();
}

/**
 * Закрытие модального окна
 */
function closeModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
    if (modal) {
        modal.hide();
    }
}