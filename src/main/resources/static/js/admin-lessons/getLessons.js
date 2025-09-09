// lessonsTable.js

let currentLessonsPage = 1;
let totalLessonsPages = 1;
let totalLessonsItems = 0;
let lessonsPerPage = 5;

// --- NEW: Function to load modules for the filter dropdown ---
async function loadModulesForFilter() {
    try {
        const response = await fetch('/admin/modules/json');
        if (!response.ok) {
            throw new Error('Failed to load modules for filter');
        }
        const data = await response.json();
        if (data.success && data.modules) {
            const select = document.getElementById('moduleFilterSelect');
            if (!select) return;

            // Save selected value if it exists
            const currentFilter = select.value;

            select.innerHTML = '<option value="">Все модули</option>'; // Reset and add default option
            data.modules.forEach(module => {
                const option = document.createElement('option');
                option.value = module.moduleId;
                option.textContent = `${module.moduleTitle}`;
                select.appendChild(option);
            });

            // Restore selected value
            if (currentFilter) {
                select.value = currentFilter;
            }

        } else {
            throw new Error('Invalid data format for modules');
        }
    } catch (error) {
        console.error('Error loading modules for filter:', error);
        showAlert('Не удалось загрузить фильтр модулей.', 'warning');
    }
}

// --- MODIFIED: Load lessons with filtering capability ---
async function loadLessons(page = 1) {
    try {
        showLoading(true);

        const moduleId = document.getElementById('moduleFilterSelect')?.value || '';
        let url = `/admin/lessons?page=${page}&size=${lessonsPerPage}`;
        if (moduleId) {
            url += `&moduleId=${moduleId}`;
        }

        const response = await fetch(url);

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
            // Handle cases like 404 when no lessons are found for a filter
            if (response.status === 404) {
                renderLessonsTable([]);
                renderLessonsPagination();
            } else {
                throw new Error(`Ошибка сервера: ${response.status}`);
            }
        }
    } catch (error) {
        console.error('Ошибка загрузки уроков:', error);
        showError(error.message);
    } finally {
        showLoading(false);
    }
}

// --- MODIFIED: Render lessons table with filter dropdown ---
function renderLessonsTable(lessons) {
    const container = document.getElementById('lessonsContainer');
    if (!container) {
        console.error('Контейнер уроков не найден');
        return;
    }

    container.innerHTML = '';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'courses-table-container';

    const tableHTML = `
        <div class="data-table courses-table lessons-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">Список уроков</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <!-- NEW: Module Filter -->
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="moduleFilterSelect" onchange="loadLessons(1)">
                            <option value="">Фильтр по модулю...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">Отображать</span>
                            <select class="form-select" id="lessonsPageSizeSelect" onchange="changeLessonsPerPage(this.value)">
                                <option value="5" ${lessonsPerPage === 5 ? 'selected' : ''}>5</option>
                                <option value="10" ${lessonsPerPage === 10 ? 'selected' : ''}>10</option>
                                <option value="20" ${lessonsPerPage === 20 ? 'selected' : ''}>20</option>
                                <option value="50" ${lessonsPerPage === 50 ? 'selected' : ''}>50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openCreateLessonModal()">
                        <i class="bi bi-plus-circle me-1"></i>Новый урок
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Модуль</div>
                    <div class="table-cell">Описание</div>
                    <div class="table-cell">Видео</div>
                    <div class="table-cell">Действия</div>
                </div>

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
                                <i class="bi bi-camera-video me-1"></i> Смотреть
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
                        <i class="bi bi-book-open me-2"></i>
                        Уроки не найдены. Измените фильтр или добавьте новый урок.
                    </div>
                </div>
                `}
            </div>
        </div>
    `;

    tableWrapper.innerHTML = tableHTML;
    container.appendChild(tableWrapper);

    // --- NEW: Populate the filter after rendering the table structure ---
    loadModulesForFilter();
}

// Рендер пагинации
function renderLessonsPagination() {
    const container = document.getElementById('lessonsPagination');
    if (!container) {
        console.warn('Контейнер пагинации не найден');
        return;
    }

    if (totalLessonsPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentLessonsPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${currentLessonsPage - 1}); return false;">&laquo;</a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentLessonsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalLessonsPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(1); return false;">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentLessonsPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changeLessonsPage(${i}); return false;">${i}</a></li>`;
    }

    if (endPage < totalLessonsPages) {
        if (endPage < totalLessonsPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(${totalLessonsPages}); return false;">${totalLessonsPages}</a></li>`;
    }

    paginationHTML += `
                <li class="page-item ${currentLessonsPage === totalLessonsPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${currentLessonsPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentLessonsPage} из ${totalLessonsPages} • Показано ${lessons.length} из ${totalLessonsItems} уроков
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
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
        `;
    }
}

function showError(message) {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="text-center py-4 text-danger">
            <i class="bi bi-exclamation-triangle-fill fa-2x mb-3"></i>
            <h5>Ошибка загрузки</h5>
            <p>${escapeHtml(message)}</p>
            <button class="btn btn-primary btn-sm" onclick="loadLessons(1)">
                <i class="bi bi-arrow-clockwise me-1"></i> Попробовать снова
            </button>
        </div>
    `;
}

function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return escapeHtml(text || '');
    return escapeHtml(text.substring(0, maxLength)) + '...';
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

async function deleteLesson(lessonId, lessonTitle) {
    if (!confirm(`Вы уверены, что хотите удалить урок "${lessonTitle}"?`)) {
        return;
    }

    try {
        const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
        const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
        const headers = {
            'Content-Type': 'application/json'
        };
        if (csrfToken && csrfHeader) {
            headers[csrfHeader] = csrfToken;
        }

        const response = await fetch(`/admin/lessons/${lessonId}/delete`, {
            method: 'DELETE',
            headers: headers
        });

        const result = await response.json().catch(() => ({})); // Handle empty response

        if (response.ok) {
            showAlert(result.message || `Урок ${lessonTitle} успешно удален`, 'success');
            loadLessons(currentLessonsPage || 1);
        } else {
            throw new Error(result.message || `Ошибка сервера: ${response.status}`);
        }

    } catch (error) {
        console.error('Ошибка удаления урока:', error);
        showAlert(error.message, 'error');
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const lessonsTabTrigger = document.querySelector('a[data-tab="lessons-edit-tab"]');
    if (lessonsTabTrigger) {
        lessonsTabTrigger.addEventListener('click', function() {
            // Ensure we load lessons only when the tab is activated
            setTimeout(() => loadLessons(1), 10); 
        });

        // If the tab is already active on page load, load lessons
        if (document.getElementById('lessons-edit-tab')?.classList.contains('active')) {
            loadLessons(1);
        }
    }
});
