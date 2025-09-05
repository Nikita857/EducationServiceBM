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
                if (!response.ok) {
                    throw new Error('Не удалось загрузить данные урока.');
                }
                const lessonData = await response.json();

                // 2. Заполняем форму
                document.getElementById('editLessonId').value = lessonId;
                document.getElementById('editLessonTitle').value = lessonData.title;
                document.getElementById('editLessonVideoUrl').value = lessonData.videoUrl;

                // 3. Инициализируем TinyMCE с контентом
                initTinyMCE(lessonData.textContent || '');

                // 4. Показываем модальное окно
                editLessonModal.show();

            } catch (error) {
                console.error('Ошибка при загрузке урока:', error);
                alert(error.message);
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
        const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');

        const lessonDto = {
            title,
            videoUrl,
            textContent
        };

        try {
            const response = await fetch(`/api/admin/lessons/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    [csrfHeader]: csrfToken
                },
                body: JSON.stringify(lessonDto)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Произошла ошибка при сохранении.');
            }

            // Успех
            editLessonModal.hide();
            alert('Урок успешно обновлен!');
            
            // Опционально: обновить данные на лету без перезагрузки страницы
            // Это потребует более сложной логики для поиска и обновления элемента в списке

        } catch (error) {
            console.error('Ошибка при сохранении урока:', error);
            alert(error.message);
        }
    });
});
