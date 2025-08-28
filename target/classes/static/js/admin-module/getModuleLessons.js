async function loadLessons(moduleId) {
    try {
        const response = await fetch(`/admin/modules/${moduleId}/lessons`);

        if (response.ok) {
            const lessons = await response.json();
            console.log(lessons);
            showLessonsModal(lessons);
        } else {
            throw new Error("Ошибка получения списка уроков");
        }
    } catch (error) {
        console.log(error);
        alert('Ошибка при загрузке уроков: ' + error.message);
    }
}

function showLessonsModal(lessons) {
    // Создаем модальное окно, если его еще нет
    if (!document.getElementById('lessonsModal')) {
        const modalHtml = `
            <div class="modal fade" id="lessonsModal" tabindex="-1" aria-labelledby="lessonsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="lessonsModalLabel">Уроки модуля</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="lessonsModalBody">
                            <!-- Сюда будет вставлен список уроков -->
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

    // Заполняем модальное окно уроками
    const modalBody = document.getElementById('lessonsModalBody');

    if (lessons.length === 0) {
        modalBody.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-book-open fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">В этом модуле нет уроков</h5>
                <p class="text-muted">Создайте первый урок</p>
            </div>
        `;
    } else {
        // Получаем название модуля из первого урока (предполагая, что все уроки одного модуля)
        const moduleName = lessons[0]?.moduleName || 'Модуль';

        modalBody.innerHTML = `
            <div class="mb-3">
                <h6 class="text-muted">Модуль: ${moduleName}</h6>
            </div>
            <div class="list-group">
                ${lessons.map(lesson => `
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${lesson.title || 'Без названия'}</h6>
                                <small class="text-muted">ID: ${lesson.id} | Модуль: ${lesson.moduleName}</small>
                                ${lesson.moduleSlug ? `<br><small class="text-muted">Slug модуля: ${lesson.moduleSlug}</small>` : ''}
                            </div>
                            <div class="btn-group ms-3">
                                <a href="/admin/lessons/${lesson.id}/edit" class="btn btn-outline-primary btn-sm">
                                    <i class="fas fa-edit"></i> Редактировать
                                </a>
                                <button class="btn btn-outline-info btn-sm" onclick="viewLesson(${lesson.id}, '${lesson.courseSlug}', '${lesson.moduleSlug}')">
                                    <i class="fas fa-eye"></i> Просмотреть
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

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('lessonsModal'));
    modal.show();
}

// Дополнительная функция для просмотра урока (опционально)
function viewLesson(lessonId, courseSlug, moduleSlug) {
    // Редирект на страницу просмотра урока
    console.log(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonId}`);
    window.location.href = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonId}`;
}

// Функция для создания нового урока (опционально)
function createNewLesson(moduleId) {
    window.location.href = `/admin/lessons/create?moduleId=${moduleId}`;
}