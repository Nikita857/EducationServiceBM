
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

    // Генерация slug из названия
    courseTitle.addEventListener('blur', function() {
    if (!courseSlug.value) {
    const slug = this.value
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s]/gi, '')
    .replace(/\s+/g, '-')
    .replace(/[а-яё]/g, function(char) {
    const cyrToLat = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
    'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
    'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
    'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
    'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
    'э': 'e', 'ю': 'yu', 'я': 'ya'
};
    return cyrToLat[char] || char;
})
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

    courseSlug.value = slug;
}
});

    // Функция очистки формы
    window.resetForm = function() {
    form.reset();
    form.classList.remove('was-validated');
    charCount.textContent = '0';
    fileInput.value = '';
    imagePreview.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
};
});