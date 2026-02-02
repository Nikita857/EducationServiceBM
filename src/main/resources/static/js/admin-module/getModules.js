let currentModulesPage = 1;
let totalModulesPages = 1;
let totalModulesItems = 0;
let modulesPerPage = 5;

// --- NEW: Initialize the entire view (controls and data) ---
function initModulesView() {
    const container = document.getElementById('modulesContainer');
    if (!container) {
        console.error('Module container not found!');
        return;
    }

    // 1. Render the static part of the table (header, filters)
    renderModuleControls(container);

    // 2. Populate the filter with data
    void loadCoursesForFilter();

    // 3. Load the initial set of data
    void loadModules(1);
}

// --- NEW: Renders the static controls (header, filters) only once ---
function renderModuleControls(container) {
    container.innerHTML = `
        <div class="data-table courses-table modules-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                 <h3 class="table-title mb-2 mb-md-0">Список модулей</h3>
                 <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="courseFilterSelect" onchange="loadModules(1)">
                            <option value="">Фильтр по курсу...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">Отображать</span>
                            <select class="form-select" id="modulesPageSizeSelect" onchange="changeModulesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                     <button class="btn btn-primary btn-sm" onclick="openCreateModuleModal()">
                        <i class="bi bi-plus-circle me-1"></i>Новый модуль
                    </button>
                </div>
            </div>
            <!-- This container will be updated with new rows -->
            <div class="table-content" id="modules-table-content">
                <!-- Rows will be injected here -->
            </div>
        </div>
    `;
    // Set the initial value for the page size selector
    document.getElementById('modulesPageSizeSelect').value = modulesPerPage;
}

// --- NEW: Function to load courses for the filter dropdown (runs once) ---
async function loadCoursesForFilter() {
    const select = document.getElementById('courseFilterSelect');
    if (!select) return;

    try {
        const response = await fetch('/admin/courses/all');
        if (!response.ok) {
            console.error(new Error('Failed to load courses'));
            return null;
        }
        const json = await response.json();
        
        if (!json.success || !json.data) {
            console.error(new Error('Invalid data format for courses'));
            return null;
        }

        json.data.forEach(course => {
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading courses for filter:', error);
        showAlert('Не удалось загрузить фильтр курсов.', 'warning');
    }
}

// --- MODIFIED: Fetches data and calls a specific function to render only the rows ---
async function loadModules(page = 1) {
    const contentContainer = document.getElementById('modules-table-content');
    if (!contentContainer) {
        initModulesView(); // If the container doesn't exist, initialize the whole view
        return;
    }

    showLoadingModules(true);

    try {
        const courseId = document.getElementById('courseFilterSelect')?.value || '';
        let url = `/admin/modules?page=${page}&size=${modulesPerPage}`;
        if (courseId) {
            url += `&courseId=${courseId}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (response.ok && data.success && data.data && typeof data.data.content !== 'undefined') {
            const paginatedModules = data.data;

            currentModulesPage = paginatedModules["currentPage"] || page;
            totalModulesPages = paginatedModules["totalPages"] || 1;
            totalModulesItems = paginatedModules["totalItems"] || 0;

            renderModuleRows(paginatedModules.content);
            renderModulesPagination();
        } else {
            showErrorModules(data.message || "Получены неверные данные от сервера.");
        }

    } catch (error) {
        console.error('Ошибка загрузки модулей:', error);
        showErrorModules(error.message);
    } finally {
        showLoadingModules(false);
    }
}

// --- NEW: Renders only the module rows into the content container ---
function renderModuleRows(modules) {
    const container = document.getElementById('modules-table-content');
    if (!container) return;

    // Clear only the rows
    container.innerHTML = '';

    const headerRow = `
        <div class="table-row header-row">
            <div class="table-cell">ID</div>
            <div class="table-cell">Название</div>
            <div class="table-cell">Курс</div>
            <div class="table-cell">Статус</div>
            <div class="table-cell">Действия</div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', headerRow);

    if (modules.length === 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="table-row">
                <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                    <i class="bi bi-collection me-2"></i>
                    Модули не найдены. Измените фильтр или добавьте новый модуль.
                </div>
            </div>
        `);
        return;
    }

    modules.forEach(module => {
        const rowHTML = `
            <div class="table-row">
                <div class="table-cell text-muted">#${module.moduleId || 'N/A'}</div>
                <div class="table-cell">
                    <div class="fw-bold">${escapeHtml(module["moduleTitle"] || 'Без названия')}</div>
                </div>
                <div class="table-cell">
                    <span class="text-muted">${escapeHtml(module["courseName"] || 'N/A')}</span>
                </div>
                <div class="table-cell">
                    <span class="badge ${module["moduleStatus"] === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}" style="cursor: pointer" onclick="adminUpdateModuleStatus(${module.moduleId}, '${module["moduleStatus"]}')">
                        ${escapeHtml(adaptiveModuleStatus(module["moduleStatus"]))}
                    </span>
                </div>
                <div class="table-cell action-buttons">
                    <button class="btn btn-primary btn-icon btn-sm edit-module-btn" title="Редактировать" data-module-id="${module.moduleId}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-sm" title="Удалить" onclick="deleteModule(${module.moduleId}, '${escapeHtml(module["moduleTitle"])}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-info btn-icon btn-sm" title="Уроки модуля" onclick="loadModuleLessons(${module.moduleId})">
                        <i class="bi bi-card-checklist"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHTML);
    });
}

// --- UNCHANGED (mostly) ---
function renderModulesPagination() {
    let container = document.getElementById('modulesPagination');
    if (!container) {
        // If the main container exists but pagination doesn't, create it.
        const mainContainer = document.getElementById('modulesContainer');
        if(mainContainer) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-container mt-3';
            paginationDiv.id = 'modulesPagination';
            mainContainer.appendChild(paginationDiv);
            container = paginationDiv;
        } else {
            return;
        }
    }

    if (totalModulesPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentModulesPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${currentModulesPage - 1}); return false;">&laquo;</a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentModulesPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalModulesPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(1); return false;">1</a></li>`;
        if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentModulesPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changeModulesPage(${i}); return false;">${i}</a></li>`;
    }

    if (endPage < totalModulesPages) {
        if (endPage < totalModulesPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(${totalModulesPages}); return false;">${totalModulesPages}</a></li>`;
    }

    paginationHTML += `
                <li class="page-item ${currentModulesPage === totalModulesPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${currentModulesPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentModulesPage} из ${totalModulesPages} • Всего модулей: ${totalModulesItems}
            </small>
        </div>
    `;
    container.innerHTML = paginationHTML;
}

function changeModulesPage(page) {
    if (page < 1 || page > totalModulesPages || page === currentModulesPage) return;
     void loadModules(page);
}

function changeModulesPerPage(perPage) {
    modulesPerPage = parseInt(perPage) || 10;
    void loadModules(1);
}

function showLoadingModules(isLoading) {
    const container = document.getElementById('modules-table-content');
    if (!container) return;
    if (isLoading) {
        container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Загрузка...</span>
                </div>
            </div>
        `;
    }
}

function showErrorModules(message) {
    const container = document.getElementById('modulesContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="text-center py-4 text-danger">
            <i class="bi bi-exclamation-triangle-fill fa-2x mb-3"></i>
            <h5>Ошибка загрузки</h5>
            <p>${escapeHtml(message)}</p>
            <button class="btn btn-primary btn-sm" onclick="initModulesView()">
                <i class="bi bi-arrow-clockwise me-1"></i> Попробовать снова
            </button>
        </div>
    `;
}

function adaptiveModuleStatus(status) {
    return status === 'ACTIVE' ? 'Активный' : 'Неактивный'
}

function escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function openCreateModuleModal() {
    const tabLink = document.querySelector('a[data-tab="create-module-tab"]');
    if (tabLink) tabLink.click();
}

// --- MODIFIED: Initialization logic ---
document.addEventListener('DOMContentLoaded', function() {
    const modulesTabTrigger = document.querySelector('a[data-tab="modules-edit-tab"]');
    if (modulesTabTrigger) {
        let isInitialized = false;
        const observer = new MutationObserver(() => {
            if (document.getElementById('modules-edit-tab').classList.contains('active') && !isInitialized) {
                initModulesView();
                isInitialized = true;
            }
        });

        modulesTabTrigger.addEventListener('click', () => {
            if (!isInitialized) {
                initModulesView();
                isInitialized = true;
            }
        });

        if (document.getElementById('modules-edit-tab').classList.contains('active')) {
            initModulesView();
            isInitialized = true;
        }
    }
});

window.changeModulesPerPage = changeModulesPerPage;
window.openCreateModuleModal = openCreateModuleModal;
window.changeModulesPage = changeModulesPage;
window.initModulesView = initModulesView;
window.loadModules = loadModules;
