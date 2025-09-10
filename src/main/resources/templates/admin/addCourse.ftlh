<form id="addCourseForm" class="needs-validation" enctype="multipart/form-data">
    <div class="row">
        <!-- Название курса -->
        <div class="col-md-8 mb-3">
            <label for="courseTitle" class="form-label">
                <i class="bi bi-book me-1"></i>Название курса *
            </label>
            <input type="text"
                   class="form-control"
                   id="courseTitle"
                   name="title"
                   placeholder="Введите название курса"
                   required
                   maxlength="255">
            <div class="invalid-feedback">
                Пожалуйста, введите название курса.
            </div>
            <div class="form-text">
                Максимум 255 символов
            </div>
        </div>

        <!-- URL-адрес -->
        <div class="col-md-4 mb-3">
            <label for="courseSlug" class="form-label">
                <i class="bi bi-link-45deg me-1"></i>URL-адрес *
            </label>
            <div class="input-group">
                <span class="input-group-text">/courses/</span>
                <input type="text"
                       class="form-control"
                       id="courseSlug"
                       name="slug"
                       placeholder="url-adres-kursa"
                       required
                       pattern="[a-z0-9-]+"
                       maxlength="100">
            </div>
            <div class="invalid-feedback">
                URL может содержать только латинские буквы в нижнем регистре, цифры и дефисы.
            </div>
            <div class="form-text">
                Только латинские буквы, цифры и дефисы
            </div>
        </div>
    </div>

    <!-- Изображение курса -->
    <div class="row">
        <div class="col-12 mb-4">
            <label for="courseImage" class="form-label">
                <i class="bi bi-image me-1"></i>Изображение курса
            </label>

            <!-- Превью изображения -->
            <div class="image-preview mb-3" id="imagePreview" style="display: none;">
                <img src="" alt="Предпросмотр" class="img-thumbnail" style="max-height: 200px;">
                <button type="button" class="btn btn-sm btn-danger mt-2" id="removeImage">
                    <i class="bi bi-trash"></i> Удалить
                </button>
            </div>

            <!-- Загрузка файла -->
            <div class="file-upload-area">
                <input type="file"
                       class="form-control"
                       id="courseImage"
                       name="image"
                       accept="image/*"
                       style="display: none;">

                <div class="upload-placeholder border rounded p-4 text-center"
                     id="uploadPlaceholder"
                     style="cursor: pointer; border-style: dashed !important;">
                    <i class="bi bi-cloud-upload display-4 text-muted mb-2"></i>
                    <p class="mb-1">Нажмите для загрузки изображения</p>
                    <p class="text-muted small">JPG, PNG или GIF • Макс. 5MB</p>
                </div>
            </div>

            <div class="form-text">
                Рекомендуемое разрешение: 1200×600 px
            </div>
        </div>
    </div>

    <!-- Описание курса -->
    <div class="row">
        <div class="col-12 mb-4">
            <label for="courseDescription" class="form-label">
                <i class="bi bi-text-paragraph me-1"></i>Описание курса *
            </label>
            <textarea class="form-control"
                      id="courseDescription"
                      name="description"
                      rows="6"
                      placeholder="Опишите содержание курса, цели обучения, целевую аудиторию..."
                      required
                      minlength="50"
                      maxlength="255"></textarea>
            <div class="invalid-feedback">
                Описание должно содержать не менее 50 символов.
            </div>
            <div class="form-text">
                Минимум 50 символов, максимум 255 символов
            </div>

            <!-- Счетчик символов -->
            <div class="char-counter text-end text-muted small">
                <span id="charCount">0</span>/2000 символов
            </div>
        </div>
    </div>
    <!-- Кнопки действий -->
    <div class="row">
        <div class="col-12">
            <div class="d-flex gap-2 justify-content-end">
                <button type="button" class="btn btn-secondary" onclick="resetForm()">
                    <i class="bi bi-x-circle me-1"></i>Очистить
                </button>

                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-plus-circle me-1"></i>Создать курс
                </button>
            </div>
        </div>
    </div>
</form>