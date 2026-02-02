document.addEventListener('DOMContentLoaded', function () {

    const editLessonModal = new bootstrap.Modal(document.getElementById('editLessonModal'));
    const editLessonForm = document.getElementById('editLessonForm');

    // Инициализация TinyMCE
    function initTinyMCE(content = '') {
        tinymce.remove('#editLessonTextContent'); // Удаляем предыдущий инстанс, если он был
        tinymce.init({
            selector: '#editLessonTextContent',
            plugins: 'code table lists image link',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | code | image | link',
            height: 400,
            setup: function (editor) {
                editor.on('init', function () {
                    editor.setContent(content);
                });
            }
        });
    }

    // Глобальный обработчик кликов для делегирования событий
    document.body.addEventListener('click', async function (event) {
        const editButton = event.target.closest('.edit-lesson-btn');
        if (editButton) {
            const lessonId = editButton.dataset.lessonId;
            if (!lessonId) return;

            // 1. Получаем данные урока с бэкенда
            try {
                const response = await fetch(`/api/admin/lessons/${lessonId}`);
                const result = await response.json();

                if (!response.ok || !result.success) {
                    const errorMsg = result.message || 'Не удалось загрузить данные урока.';
                    showAlert(errorMsg, 'error');
                    return;
                }
                const lessonData = result.data; // Data is in result.data

                // 2. Заполняем форму
                document.getElementById('editLessonId').value = lessonId;
                document.getElementById('editLessonTitle').value = lessonData.title;
                document.getElementById('editLessonVideoUrl').value = lessonData.videoUrl;

                // 3. Инициализируем TinyMCE с контентом
                initTinyMCE(lessonData.textContent || '');

                // 4. Показываем модальное окно
                editLessonModal.show();

            } catch (error) {
                showAlert(error.message, 'error');
            }
        }
    });

    // Обработчик отправки формы
    editLessonForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const lessonId = document.getElementById('editLessonId').value;
        const title = document.getElementById('editLessonTitle').value;
        const videoUrl = document.getElementById('editLessonVideoUrl').value;
        const textContent = tinymce.get('editLessonTextContent').getContent();

        const lessonDto = {
            title,
            videoUrl,
            textContent
        };

        try {
            const response = await fetch(`/api/admin/lessons/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lessonDto)
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                const errorMessage = result.message || 'Произошла ошибка при сохранении.';
                throw new Error(errorMessage);
            }

            // Успех
            editLessonModal.hide();
            showAlert(result.message || 'Урок успешно обновлен!', 'success');
            // Обновляем таблицу уроков, чтобы увидеть изменения
            if (typeof loadLessons === 'function') {
                loadLessons();
            }

        } catch (error) {
            showAlert(error.message, 'error');
        }
    });
});
