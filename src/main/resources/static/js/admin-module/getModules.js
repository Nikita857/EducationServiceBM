let currentModulesPage = 1;
let totalModulesPages = 1;
let totalModulesItems = 0;
let modulesPerPage = 5;

// Загрузка модулей
async function loadModules(page = 1) {
    try {
        showLoadingModules(true);

        const response = await fetch(`/admin/modules?page=${page}&size=${modulesPerPage}`);

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.modules) {
                currentModulesPage = data.currentPage || page;
                totalModulesPages = data.totalPages || 1;
                totalModulesItems = data.totalItems || data.modules.length;

                renderModulesTable(data.modules);
                renderModulesPagination();
            } else {
                throw new Error("Неверный формат данных");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка загрузки модулей:', error);
        showErrorModules('Не удалось загрузить список модулей');
    } finally {
        showLoadingModules(false);
    }
}

// Рендер таблицы модулей
function renderModulesTable(modules) {
    const container = document.getElementById('modulesContainer');

    if (!container) {
        console.error('Контейнер модулей не найден');
        return;
    }

    container.innerHTML = '';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'courses-table-container';

    const tableHTML = `
        <div class="data-table courses-table modules-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">Список модулей</h3>
                <div class="page-size-selector">
                    <div class="input-group">
                        <span class="input-group-text">Отображать</span>
                        <select class="form-select" id="modulesPageSizeSelect" onchange="changeModulesPerPage(this.value)">
                            <option value="5" ${modulesPerPage === 5 ? 'selected' : ''}>5 строк</option>
                            <option value="10" ${modulesPerPage === 10 ? 'selected' : ''}>10 строк</option>
                            <option value="20" ${modulesPerPage === 20 ? 'selected' : ''}>20 строк</option>
                            <option value="50" ${modulesPerPage === 50 ? 'selected' : ''}>50 строк</option>
                        </select>
                        <button class="btn btn-primary" onclick="openCreateModuleModal()">Новый модуль</button>
                    </div>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Курс</div>
                    <div class="table-cell">Статус</div>
                    <div class="table-cell">Действия</div>
                </div>

                ${modules.length > 0 ? modules.map(module => `
                <div class="table-row">
                    <div class="table-cell text-muted">#${module.moduleId || 'N/A'}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${escapeHtml(module.moduleTitle || 'Без названия')}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${escapeHtml(module.courseName || 'N/A')}</span>
                    </div>
                    <div class="table-cell">
                        <span class="badge ${module.moduleStatus === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}" style="cursor: pointer" onclick="adminUpdateModuleStatus(${module.moduleId}, '${module.moduleStatus}')">
                            ${escapeHtml(module.moduleStatus)}
                        </span>
                    </div>
                    <div class="table-cell action-buttons">
                    
                        <button class="btn btn-primary btn-icon btn-sm edit-module-btn" title="Редактировать" data-module-id="${module.moduleId}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        
                        <button class="btn btn-danger btn-icon btn-sm" title="Удалить"
                                onclick="deleteModule(${module.moduleId}, '${escapeHtml(module.moduleTitle)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                        
                        <!--Кнопка редактирования модуля-->
                        <button class="btn btn-info btn-icon btn-sm edit-module-btn" title="Уроки модуля" onclick="loadModuleLessons(${module.moduleId})">
                            <i class="bi bi-card-checklist"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="fas fa-book-open me-2"></i>
                        Модули не найдены
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
function renderModulesPagination() {
    const container = document.getElementById('modulesPagination');

    if (!container) {
        console.warn('Контейнер пагинации не найден');
        return;
    }

    if (totalModulesPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentModulesPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${currentModulesPage - 1}); return false;">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentModulesPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalModulesPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeModulesPage(1); return false;">1</a>
            </li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentModulesPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeModulesPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalModulesPages) {
        paginationHTML += `
            ${endPage < totalModulesPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeModulesPage(${totalModulesPages}); return false;">${totalModulesPages}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentModulesPage === totalModulesPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${currentModulesPage + 1}); return false;">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentModulesPage} из ${totalModulesPages} • 
                Показано ${modulesPerPage} из ${totalModulesItems} модулей
            </small>
        </div>
    `;

    container.innerHTML = paginationHTML;
}

// Смена страницы
function changeModulesPage(page) {
    if (page < 1 || page > totalModulesPages || page === currentModulesPage) return;
    loadModules(page);
}

// Изменение количества модулей на странице
function changeModulesPerPage(perPage) {
    modulesPerPage = parseInt(perPage) || 10;
    loadModules(1);
}

// Вспомогательные функции
function showLoadingModules(show) {
    const container = document.getElementById('modulesContainer');
    if (!container) return;

    if (show) {
        container.innerHTML = `
            <div class="table-row">
                <div colspan="5" class="text-center py-4 text-muted">
                    <i class="fas fa-spinner fa-spin me-2"></i>
                    Загрузка модулей...
                </div>
            </div>
        `;
    }
}

function showErrorModules(message) {
    const container = document.getElementById('modulesContainer');
    if (!container) return;

    container.innerHTML = `
        <div class="table-row">
            <div colspan="5" class="text-center py-4 text-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                ${escapeHtml(message)}
            </div>
        </div>
        <div class="text-center mt-2">
            <button class="btn btn-primary btn-sm" onclick="loadModules(1)">
                <i class="fas fa-redo me-1"></i> Попробовать снова
            </button>
        </div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openCreateModuleModal() {
    console.log('Открытие модального окна добавления модуля');
    showAlert('Добавление нового модуля', 'info');
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const modulesTab = document.getElementById('modules-tab');
    if (modulesTab) {
        if (modulesTab.classList.contains('active')) {
            loadModules(1);
        }

        const tabTrigger = document.querySelector('[data-bs-target="#modules-tab"]');
        if (tabTrigger) {
            tabTrigger.addEventListener('shown.bs.tab', function (e) {
                if (e.target.getAttribute('data-bs-target') === '#modules-tab') {
                    loadModules(1);
                }
            });
        }
    }
});
