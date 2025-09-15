document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.getElementById('registrationForm');

    if (registrationForm) {
        registrationForm.addEventListener('submit', async function (event) {
            event.preventDefault();

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
                    showAlert('Регистрация прошла успешно!', 'success');
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                } else {
                    if (result.errors) {
                        const errorMessages = Object.values(result.errors).join('\n');
                        showAlert('Ошибка валидации:\n' + errorMessages, 'error');
                    } else {
                        showAlert(result.message || 'Ошибка при регистрации', 'error');
                    }
                }
            } catch (error) {
                showAlert('Произошла ошибка при отправке данных', 'error');
            }
        });
    }
});
