document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addCourseForm');
    const descriptionTextarea = document.getElementById('courseDescription');
    const charCount = document.getElementById('charCount');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const fileInput = document.getElementById('courseImage');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    const courseTitle = document.getElementById('courseTitle');
    const courseSlug = document.getElementById('courseSlug');

    // Счетчик символов для описания
    descriptionTextarea.addEventListener('input', function() {
    const length = this.value.length;
    charCount.textContent = length;

    if (length > 1900) {
    charCount.classList.add('text-warning');
} else {
    charCount.classList.remove('text-warning');
}
});

    // Загрузка изображения
    uploadPlaceholder.addEventListener('click', function() {
    fileInput.click();
});

    fileInput.addEventListener('change', function(e) {
    if (this.files && this.files[0]) {
    const file = this.files[0];

    // Проверка размера файла
    if (file.size > 5 * 1024 * 1024) {
    showAlert('Файл слишком большой. Максимальный размер: 5MB', 'error');
    this.value = '';
    return;
}

    // Показ превью
    const reader = new FileReader();
    reader.onload = function(e) {
    imagePreview.querySelector('img').src = e.target.result;
    imagePreview.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
}
    reader.readAsDataURL(file);
}
});

    // Удаление изображения
    removeImageBtn.addEventListener('click', function() {
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
});

    // --- Slug Generation Logic ---
    let isSlugManuallyEdited = false;

    if (courseTitle && courseSlug) {
        // Generate slug as user types in the title field
        courseTitle.addEventListener('input', () => {
            if (!isSlugManuallyEdited) {
                generateSlugFromTitle();
            }
        });

        // Detect when user edits the slug field manually to disable auto-generation
        courseSlug.addEventListener('input', () => {
            isSlugManuallyEdited = true;
        });
    }

    function generateSlugFromTitle() {
        const title = courseTitle.value.trim();
        if (title) {
            const translitMap = {
                'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'zh',
                'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o',
                'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts',
                'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
            };

            let slug = title.toLowerCase();
            let result = '';
            for (let i = 0; i < slug.length; i++) {
                result += translitMap[slug[i]] || slug[i];
            }

            slug = result
                .replace(/['"’]/g, '')      // remove quotes
                .replace(/\s+/g, '-')       // collapse whitespace and replace by -
                .replace(/[^a-z0-9-]/g, '') // remove invalid chars
                .replace(/-+/g, '-')        // collapse dashes
                .replace(/^-|-$/g, '');     // trim - from start or end

            courseSlug.value = slug;
        }
    }
    // --- End Slug Generation Logic ---

    // Функция очистки формы
    window.resetForm = function() {
    form.reset();
    form.classList.remove('was-validated');
    charCount.textContent = '0';
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
};

    // --- Form Submission Logic ---
    form.addEventListener('submit', async function(event) {
        // 1. Предотвращаем стандартную отправку формы
        event.preventDefault();
        event.stopPropagation();

        // 2. Проверяем валидность формы с помощью Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        // Дополнительная проверка на наличие файла
        if (fileInput.files.length === 0) {
            showAlert('Пожалуйста, выберите изображение для курса.', 'error');
            return;
        }

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;

        try {
            // 3. Показываем индикатор загрузки
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Создание...';

            // 4. Собираем данные формы с помощью FormData
            const formData = new FormData(form);

            // 5. Отправляем данные на сервер
            const response = await fetch('/admin/course/create', {
                method: 'POST',
                body: formData
            });

            // 6. Обрабатываем ответ
            if (response.status === 201) { // 201 Created
                showAlert('Курс успешно создан!', 'success');
                window.resetForm(); // Используем уже существующую функцию для очистки
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || Object.values(errorData).join(', ');
               return null;
            }

        } catch (error) {
            showAlert(`Ошибка: ${error.message}`, 'error');
        } finally {
            // 7. Возвращаем кнопку в исходное состояние
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});