// lessonsTable.js

let currentLessonsPage = 1;
let totalLessonsPages = 1;
let totalLessonsItems = 0;
let lessonsPerPage = 5;

// Загрузка уроков
async function loadLessons(page = 1) {
    try {
        showLoading(true);

        const response = await fetch(`/admin/lessons?page=${page}&size=${lessonsPerPage}`);

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.lessons) {
                currentLessonsPage = data.currentPage || page;
                totalLessonsPages = data.totalPages || 1;
                totalLessonsItems = data.totalItems || data.lessons.length;

                renderLessonsTable(data.lessons);
                renderLessonsPagination();
            } else {
                throw new Error("Неверный формат данных");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка загрузки уроков:', error);
        showError('Не удалось загрузить список уроков');
    } finally {
        showLoading(false);
    }
}

// Рендер таблицы уроков
function renderLessonsTable(lessons) {
    const container = document.getElementById('lessonsContainer');

    if (!container) {
        console.error('Контейнер уроков не найден');
        return;
    }

    // Очищаем контейнер
    container.innerHTML = '';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'courses-table-container'; // Для скролла на малых экранах

    const tableHTML = `
        <div class="data-table courses-table lessons-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">Список уроков</h3>
                <div class="page-size-selector">
                    <div class="input-group">
                        <span class="input-group-text">Отображать</span>
                        <select class="form-select" id="lessonsPageSizeSelect" onchange="changeLessonsPerPage(this.value)">
                            <option value="5" ${lessonsPerPage === 5 ? 'selected' : ''}>5 строк</option>
                            <option value="10" ${lessonsPerPage === 10 ? 'selected' : ''}>10 строк</option>
                            <option value="20" ${lessonsPerPage === 20 ? 'selected' : ''}>20 строк</option>
                            <option value="50" ${lessonsPerPage === 50 ? 'selected' : ''}>50 строк</option>
                        </select>
                        <button class="btn btn-primary" onclick="openCreateLessonModal()">Новый урок</button>
                    </div>
                </div>
            </div>

            <div class="table-content">
                <!-- Заголовок таблицы -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Модуль</div>
                    <div class="table-cell">Описание</div>
                    <div class="table-cell">Видео</div>
                    <div class="table-cell">Действия</div>
                </div>

                <!-- Строки с уроками -->
                ${lessons.length > 0 ? lessons.map(lesson => `
                <div class="table-row">
                    <div class="table-cell text-muted">#${lesson.id || 'N/A'}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${escapeHtml(lesson.title || 'Без названия')}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${escapeHtml(lesson.moduleName || 'N/A')}</span>
                    </div>
                    <div class="table-cell">
                        <span class="lesson-description">${truncateText(lesson.description || 'Нет описания', 100)}</span>
                    </div>
                    <div class="table-cell">
                        ${lesson.video ? `
                            <a href="/admin/video/${lesson.video}" class="text-primary text-decoration-none">
                                <i class="fas fa-video me-1"></i> Смотреть
                            </a>
                        ` : '<span class="text-muted">Нет видео</span>'}
                    </div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-info btn-icon btn-sm edit-lesson-btn" title="Редактировать" data-lesson-id="${lesson.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="Удалить"
                                onclick="deleteLesson(${lesson.id}, '${escapeHtml(lesson.title)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="fas fa-book-open me-2"></i>
                        Уроки не найдены
                    </div>
                </div>
                `}
            </div>
        </div>
    `;

    tableWrapper.innerHTML = tableHTML;
    container.appendChild(tableWrapper);
}

// Рендер пагинации
function renderLessonsPagination() {
    const container = document.getElementById('lessonsPagination');

    // Если контейнер не найден, выходим
    if (!container) {
        console.warn('Контейнер пагинации не найден');
        return;
    }

    // Если всего одна страница, очищаем контейнер
    if (totalLessonsPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentLessonsPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${currentLessonsPage - 1}); return false;">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentLessonsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalLessonsPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeLessonsPage(1); return false;">1</a>
            </li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentLessonsPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeLessonsPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalLessonsPages) {
        paginationHTML += `
            ${endPage < totalLessonsPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeLessonsPage(${totalLessonsPages}); return false;">${totalLessonsPages}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentLessonsPage === totalLessonsPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${currentLessonsPage + 1}); return false;">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentLessonsPage} из ${totalLessonsPages} • 
                Показано ${lessonsPerPage} из ${totalLessonsItems} уроков
            </small>
        </div>
    `;

    container.innerHTML = paginationHTML;
}

// Смена страницы
function changeLessonsPage(page) {
    if (page < 1 || page > totalLessonsPages || page === currentLessonsPage) return;
    loadLessons(page);
}

// Изменение количества уроков на странице
function changeLessonsPerPage(perPage) {
    lessonsPerPage = parseInt(perPage) || 10;
    loadLessons(1);
}

// Вспомогательные функции
function showLoading(show) {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;

    if (show) {
        container.innerHTML = `
            <div class="table-row">
                <div colspan="7" class="text-center py-4 text-muted">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Загрузка уроков...
                </div>
            </div>
        `;
    }
}

function showError(message) {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="table-row">
            <div colspan="7" class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${escapeHtml(message)}
            </div>
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-primary btn-sm" onclick="loadLessons(1)">
                <i class="fas fa-redo me-1"></i> Попробовать снова
            </button>
        </div>
    `;
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return escapeHtml(text || '');
    return escapeHtml(text.substring(0, maxLength)) + '...';
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Функции действий (заглушки)
function editLesson(lessonId) {
    console.log('Редактирование урока:', lessonId);
    alert(`Редактирование урока: ${lessonId}`);
}

async function deleteLesson(lessonId, lessonTitle) {
    if (!confirm(`Вы уверены, что хотите удалить урок "${lessonTitle}"?`)) {
        return;
    }

    try {
        const response = await fetch(`/admin/lessons/${lessonId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            }
        });

        // Обрабатываем разные статусы ответа
        if (response.status === 404) {
            alert('Урок не найден');
            return;
        }

        const result = await response.json();

        if (response.ok) {
            if (result.success) {
                alert(`Урок ${lessonTitle} успешно удален`);
                // Обновляем таблицу уроков
                if (typeof loadLessons === 'function') {
                    loadLessons(currentLessonsPage || 1);
                }
            } else {
                alert(`не удалось удалить урок: ${error}`);
            }
        } else {
            alert(`Ошибка сервера: ${error}`);
        }

    } catch (error) {
        console.error('Ошибка удаления урока:', error);
        alert(`Ошибка : ${error}`);
    }
}

function openAddLessonModal() {
    console.log('Открытие модального окна добавления урока');
    alert('Добавление нового урока');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, существует ли таб с уроками
    const lessonsTab = document.getElementById('lessons-tab');
    if (lessonsTab) {
        // Загружаем уроки только если таб активен
        if (lessonsTab.classList.contains('active')) {
            loadLessons(1);
        }

        // Добавляем обработчик для переключения табов
        const tabTrigger = document.querySelector('[data-bs-target="#lessons-tab"]');
        if (tabTrigger) {
            tabTrigger.addEventListener('shown.bs.tab', function (e) {
                if (e.target.getAttribute('data-bs-target') === '#lessons-tab') {
                    loadLessons(1);
                }
            });
        }
    }
});