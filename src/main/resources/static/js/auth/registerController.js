document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            clearErrors();

            const formData = new FormData(registrationForm);
            const requestData = Object.fromEntries(formData.entries());

            try {
                const response = await fetch('/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });

                const result = await response.json();

                if (response.ok) {
                    // Успех: сервер вернул 200 OK, делаем редирект
                    window.location.href = result.redirect || '/';
                } else {
                    // Ошибка: сервер вернул 4xx или 5xx
                    if (response.status === 400 && result) {
                        // Ошибки валидации от сервера
                        displayErrors(result);
                    } else {
                        // Другие ошибки (например, 500)
                        showGeneralError(result.message || 'Произошла непредвиденная ошибка');
                    }
                }
            } catch (error) {
                showGeneralError('Не удалось связаться с сервером. Проверьте ваше интернет-соединение.');
            }
        });
    }

    function clearErrors() {
        const invalidInputs = registrationForm.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => input.classList.remove('is-invalid'));

        const errorFeedbacks = registrationForm.querySelectorAll('.invalid-feedback');
        errorFeedbacks.forEach(feedback => feedback.textContent = '');

        const generalError = document.getElementById('generalError');
        if(generalError) {
            generalError.classList.add('d-none');
            generalError.textContent = '';
        }
    }

    function displayErrors(errorData) {
        // ИСПРАВЛЕНО: Проверяем, вложены ли ошибки в другой объект (например, fieldErrors)
        const errors = errorData.fieldErrors || errorData;

        for (const fieldName in errors) {
            const input = document.getElementById(fieldName);
            const errorFeedback = document.getElementById(fieldName + 'Error');

            if (input) {
                input.classList.add('is-invalid');
            }

            if (errorFeedback) {
                errorFeedback.textContent = errors[fieldName];
            } else {
                // Если для поля нет своего блока, показываем в общем
                showGeneralError(`${fieldName}: ${errors[fieldName]}`);
            }
        }
    }

    function showGeneralError(message) {
        const generalError = document.getElementById('generalError');
         if(generalError) {
            generalError.textContent = message;
            generalError.classList.remove('d-none');
        }
    }
});
