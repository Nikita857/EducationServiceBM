document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('moduleForm');

    form.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Валидация формы
        if (!validateForm()) {
            return;
        }

        try {
            // Сбор данных формы
            const formData = {
                courseId: document.getElementById('courseId').value,
                slug: document.getElementById('slug').value,
                title: document.getElementById('title').value
            };

            // Отправка данных на сервер
            const response = await fetch('/admin/modules/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken() // Если используется CSRF защита
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                showAlert('Модуль успешно сохранен!', 'success');
                form.reset(); // Очистка формы после успешного сохранения
            } else {
                const error = await response.json();
                showAlert(error.message || "Ошибки при создании модуля", 'error');
                console.log(error.errors)
            }

        } catch (error) {
            console.error('Ошибка:', error);
            showAlert('Произошла ошибка при отправке данных', 'error');
        }
    });

    // Валидация формы
    function validateForm() {
        const courseId = document.getElementById('courseId').value;
        const slug = document.getElementById('slug').value;
        const title = document.getElementById('title').value;

        if (!courseId) {
            showAlert('Пожалуйста, выберите курс', 'error');
            return false;
        }

        if (!slug) {
            showAlert('Пожалуйста, укажите URI модуля', 'error');
            return false;
        }

        if (!title) {
            showAlert('Пожалуйста, введите название модуля', 'error');
            return false;
        }

        // Валидация slug (только латинские буквы, цифры и дефисы)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug)) {
            showAlert('URI может содержать только латинские буквы в нижнем регистре, цифры и дефисы', 'error');
            return false;
        }

        return true;
    }

    // Получение CSRF токена (если используется Spring Security)
    function getCsrfToken() {
        return document.querySelector('meta[name="_csrf"]')?.content ||
            document.querySelector('input[name="_csrf"]')?.value;
    }

    

    // Автогенерация slug из названия (опционально)
    const titleInput = document.getElementById('title');
    const slugInput = document.getElementById('slug');

    titleInput.addEventListener('blur', function() {
        if (!slugInput.value) {
            generateSlugFromTitle();
        }
    });

    function generateSlugFromTitle() {
        const title = titleInput.value.trim();
        if (title) {
            const slug = title
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            slugInput.value = slug;
        }
    }
});