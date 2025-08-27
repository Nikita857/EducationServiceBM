document.getElementById('avatarUploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const fileInput = document.getElementById('avatarInput');
    if (fileInput.files.length === 0) {
        showAlert('Пожалуйста, выберите файл', 'error');
        return;
    }

    const file = fileInput.files[0];

    try {
        const formData = new FormData();
        formData.append('avatar', file);

        const response = await fetch('/api/profile/avatar', {
            method: 'POST',
            body: formData,
            headers: {
                // CSRF токен будет добавлен автоматически если используете Spring Security
            }
        });

        const result = await response.json();

        if (result.status === 'success') {
            // Обновляем превью
            document.getElementById('userAvatar').src = result.avatarUrl;
            showAlert(result.message, 'success');
        } else {
            throw new Error(result.message);
        }

    } catch (error) {
        console.error('Upload error:', error);
        showAlert(error.message, 'error');
    } finally {
        const submitButton = this.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.innerHTML = 'Загрузить';
            submitButton.disabled = false;
        }
    }
});