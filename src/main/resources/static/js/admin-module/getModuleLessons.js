async function loadModuleLessons(moduleId) {
    try {
        const response = await fetch(`/admin/modules/${moduleId}/lessons`);

        // Case 1: Success (200 OK)
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                showLessonsModal(result.data);
            } else {
                showAlert(result.message || 'Получен неожиданный ответ от сервера.', 'warning');
            }
            return;
        }

        // Case 2: Not Found (404)
        if (response.status === 404) {
            showAlert('В этом модуле пока нет уроков.', 'info');
            // Show an empty modal for better UX
            showLessonsModal([]);
            return;
        }

        // Case 3: Server Error (500) or other client errors (4xx)
        let errorMessage = `HTTP ошибка: ${response.status} ${response.statusText}`;
        try {
            // Try to get a more specific error message from the response body
            const errorData = await response.json();
            if (errorData && errorData.error) {
                errorMessage = `Ошибка на сервере: ${errorData.error}`;
            }
        } catch (e) {
            // Body is not JSON or is empty, stick with the generic HTTP error message
            console.error("Could not parse error JSON.", e);
        }

        showAlert(errorMessage, 'error');
        console.error('Failed to load lessons:', errorMessage);

    } catch (error) {
        // Case 4: Network error or other fetch-related failures
        console.error('Network or fetch error:', error);
        showAlert('Сетевая ошибка. Не удалось подключиться к серверу.', 'error');
    }
}

function showLessonsModal(lessons) {
    // Create the modal if it doesn't exist yet
    if (!document.getElementById('lessonsModal')) {
        const modalHtml = `
            <div class="modal fade" id="lessonsModal" tabindex="-1" aria-labelledby="lessonsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="lessonsModalLabel">Уроки модуля</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </div>
                        <div class="modal-body" id="lessonsModalBody">
                            <!-- Lesson list will be inserted here -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const modalBody = document.getElementById('lessonsModalBody');
    const modalTitle = document.getElementById('lessonsModalLabel');

    if (lessons.length === 0) {
        modalTitle.textContent = 'Уроки модуля';
        modalBody.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-book-half fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">В этом модуле нет уроков</h5>
                <p class="text-muted">Вы можете создать первый урок в разделе "Уроки".</p>
            </div>
        `;
    } else {
        const moduleName = lessons[0]?.moduleName || 'Модуль';
        modalTitle.textContent = `Уроки модуля: ${moduleName}`;

        modalBody.innerHTML = `
            <div class="list-group">
                ${lessons.map(lesson => `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${lesson.title || 'Без названия'}</h6>
                                <small class="text-muted">ID: ${lesson.id}</small>
                            </div>
                            <div class="btn-group ms-3">
                                <button class="btn btn-outline-info btn-sm" onclick="viewLesson(${lesson.id}, '${lesson.courseSlug}', '${lesson.moduleSlug}')">
                                    <i class="bi bi-eye"></i> Просмотреть
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-3">
                <small class="text-muted">Всего уроков: ${lessons.length}</small>
            </div>
        `;
    }

    const modal = new bootstrap.Modal(document.getElementById('lessonsModal'));
    modal.show();
}

function viewLesson(lessonId, courseSlug, moduleSlug) {
    if (!courseSlug || !moduleSlug) {
        showAlert('Недостаточно данных для перехода к уроку (отсутствует slug курса или модуля).', 'error');
        return;
    }
    const url = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonId}`;
    console.log(`Redirecting to: ${url}`);
    window.location.href = url;
}

window.loadModuleLessons = loadModuleLessons;
window.viewLesson = viewLesson;
