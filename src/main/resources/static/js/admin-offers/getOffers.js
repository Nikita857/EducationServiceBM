// State variables for pagination and filtering
let currentOfferPage = 1;
let totalOfferPages = 1;
let totalOfferItems = 0;
let sortStatus = "all";
let offersPerPage = 10; // Default value

/**
 * Fetches and renders offers for a given page and filters.
 * @param {number} page - The page number to load.
 */
async function loadOffers(page = 1) {
    try {
        const response = await fetch(`/admin/offers?page=${page}&size=${offersPerPage}&status=${sortStatus}`);
        if (!response.ok) {
            console.error(new Error(`Ошибка сервера: ${response.status}`));
            showAlert(`Ошибка сервера: ${response.status}`, 'error')
        }
        const data = await response.json();
        if (data.success && data["offers"]) {
            currentOfferPage = data["currentPage"] || page;
            totalOfferPages = data["totalPages"] || 1;
            totalOfferItems = data["totalItems"] || data["offers"].length;

            renderOffersTable(data["offers"]);
            renderOfferPagePagination();
        } else {
            console.error(new Error("Неверный формат данных от AdminOfferController"));
            showAlert("Неверный формат данных от AdminOfferController", 'error')
        }
    } catch (e) {
        console.error("Ошибка при загрузке заявок:", e);
        const offerTableContainer = document.querySelector('#requests-tab .card-body');
        if (offerTableContainer) {
            offerTableContainer.innerHTML = `<div class="text-center py-4 text-danger">Не удалось загрузить заявки.</div>`;
        }
    }
}

/**
 * Deletes an offer after user confirmation.
 * @param {string|number} offerId - The ID of the offer to delete.
 */
async function deleteOffer(offerId) {
    // Use a more robust confirmation if a custom modal library is available
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
        return;
    }

    try {
        const csrfToken = typeof getCsrfToken === 'function' ? getCsrfToken() : document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
        const response = await fetch(`/admin/offers/delete/${offerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Use a more robust alert if a custom one is available
            showAlert('Заявка успешно удалена!', 'success');
            void loadOffers(currentOfferPage); // Refresh the list
        } else {
            showAlert(result.error || 'Ошибка при удалении заявки', 'error');
        }
    } catch (error) {
        console.error('Ошибка удаления заявки:', error);
        showAlert('Ошибка сервера', 'error');
    }
}

/**
 * Renders the main table of offers.
 * @param {Array<object>} offers - The array of offer objects to render.
 */
function renderOffersTable(offers) {
    const offerTableContainer = document.querySelector('#requests-tab .card-body');
    if (!offerTableContainer) {
        console.error('Контейнер для таблицы заявок не найден');
        return;
    }

    offerTableContainer.innerHTML = `
    <div class="offers-table-container">
        <div class="data-table offers-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">Список заявок</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-funnel"></i></span>
                        <select class="form-select form-select-sm" id="statusFilter">
                            <option value="all" ${sortStatus === 'all' ? 'selected' : ''}>Все статусы</option>
                            <option value="PENDING" ${sortStatus === 'PENDING' ? 'selected' : ''}>На рассмотрении</option>
                            <option value="APPROVED" ${sortStatus === 'APPROVED' ? 'selected' : ''}>Одобреные</option>
                            <option value="COMPLETED" ${sortStatus === 'COMPLETED' ? 'selected' : ''}>Выполненые</option>
                            <option value="REJECTED" ${sortStatus === 'REJECTED' ? 'selected' : ''}>Отклоненные</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Показывать</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect">
                            <option value="5" ${offersPerPage === 5 ? 'selected' : ''}>5</option>
                            <option value="10" ${offersPerPage === 10 ? 'selected' : ''}>10</option>
                            <option value="20" ${offersPerPage === 20 ? 'selected' : ''}>20</option>
                            <option value="50" ${offersPerPage === 50 ? 'selected' : ''}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="table-content" id="offersTableContent">
                <!-- Table Header -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Пользователь</div>
                    <div class="table-cell">Тема</div>
                    <div class="table-cell">Описание</div>
                    <div class="table-cell">Ответ</div>
                    <div class="table-cell">Статус</div>
                    <div class="table-cell">Создана</div>
                    <div class="table-cell">Обновлена</div>
                    <div class="table-cell">Действия</div>
                </div>

                <!-- Offer Rows -->
                ${offers.length > 0 ? offers.map(offer => `
                <div class="table-row">
                    <div class="table-cell text-muted">#${offer.id || 'N/A'}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${offer["fio"] || 'N/A'}</div>
                    </div>
                    <div class="table-cell">
                        <div class="fw-bold">${offer.topic || 'N/A'}</div>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${offer.description || 'N/A'}</span>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${offer.response || 'Нет ответа'}</span>
                    </div>
                    <div class="table-cell">${convertStatusIntoBadge(offer.status)}</div>
                    <div class="table-cell text-sm text-muted">${extractDate(offer["createdAt"])}</div>
                    <div class="table-cell text-sm text-muted">${extractDate(offer["updatedAt"])}</div>
                    <div class="table-cell action-buttons justify-content-center">
                        ${createOfferResponseButton(offer)}
                        <button class="btn btn-danger btn-icon btn-sm" title="Удалить" data-action="delete-offer" data-offer-id="${offer.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row" style="grid-template-columns: 1fr;">
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                        Заявки не найдены
                    </div>
                </div>
                `}
            </div>
        </div>
    </div>`;
    bindOfferTableEvents(); // Bind events after rendering
}

/**
 * Renders the pagination controls for the offers table.
 */
function renderOfferPagePagination() {
    const offerPaginationContainer = document.querySelector('.pagination-container-edit-offers');
    if (!offerPaginationContainer) {
        console.error('Контейнер для пагинации не найден');
        return;
    }

    if (totalOfferPages <= 1) {
        offerPaginationContainer.innerHTML = '';
        return;
    }

    let offerPaginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <!-- Previous Button -->
                <li class="page-item ${currentOfferPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${currentOfferPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;

    const maxVisiblePages = 5;
    let offerStartPage = Math.max(1, currentOfferPage - Math.floor(maxVisiblePages / 2));
    let offerEndPage = Math.min(totalOfferPages, offerStartPage + maxVisiblePages - 1);

    if (offerEndPage - offerStartPage + 1 < maxVisiblePages) {
        offerStartPage = Math.max(1, offerEndPage - maxVisiblePages + 1);
    }

    if (offerStartPage > 1) {
        offerPaginationHTML += `<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="1">1</a></li>`;
        if (offerStartPage > 2) {
            offerPaginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = offerStartPage; i <= offerEndPage; i++) {
        offerPaginationHTML += `
            <li class="page-item ${i === currentOfferPage ? 'active' : ''}">
                <a class="page-link" href="#" data-action="change-page" data-page-number="${i}">${i}</a>
            </li>`;
    }

    if (offerEndPage < totalOfferPages) {
        if (offerEndPage < totalOfferPages - 1) {
            offerPaginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        offerPaginationHTML += `<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="${totalOfferPages}">${totalOfferPages}</a></li>`;
    }

    offerPaginationHTML += `
                <!-- Next Button -->
                <li class="page-item ${currentOfferPage === totalOfferPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${currentOfferPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">Страница ${currentOfferPage} из ${totalOfferPages} • Всего заявок: ${totalOfferItems}</small>
        </div>`;

    offerPaginationContainer.innerHTML = offerPaginationHTML;
    bindOfferPaginationEvents(); // Bind events after rendering
}

/**
 * Binds event listeners for the offers table (filters, actions).
 */
function bindOfferTableEvents() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', (event) => {
            sortStatus = event.target.value;
            void loadOffers(1); // Reset to first page
        });
    }

    const pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) {
        pageSizeSelect.addEventListener('change', (event) => {
            offersPerPage = parseInt(event.target.value, 10);
            void loadOffers(1); // Reset to first page
        });
    }

    const tableContent = document.getElementById('offersTableContent');
    if (tableContent) {
        tableContent.addEventListener('click', (event) => {
            const target = event.target.closest('button[data-action="delete-offer"]');
            if (target) {
                const offerId = target.dataset.offerId;
                void deleteOffer(offerId);
            }
        });
    }
}

/**
 * Binds event listeners for the pagination controls.
 */
function bindOfferPaginationEvents() {
    const offerPaginationContainer = document.querySelector('.pagination-container-edit-offers');
    if (offerPaginationContainer) {
        offerPaginationContainer.addEventListener('click', (event) => {
            event.preventDefault();
            const target = event.target.closest('a[data-action="change-page"]');
            if (target) {
                const pageNumber = parseInt(target.dataset.pageNumber, 10);
                if (!isNaN(pageNumber)) {
                    changeOfferPage(pageNumber);
                }
            }
        });
    }
}

/**
 * Changes the current page of offers.
 * @param {number} page - The page number to switch to.
 */
function changeOfferPage(page) {
    if (page < 1 || page > totalOfferPages || page === currentOfferPage) {
        return;
    }
    void loadOffers(page);
}

/**
 * Formats a date string into YYYY-MM-DD.
 * @param {string} dateString - The input date string.
 * @returns {string} The formatted date.
 */
function extractDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
        return dateString; // Return original if parsing fails
    }
}

/**
 * Converts an offer status string into a colored Bootstrap badge.
 * @param {string} status - The status string (e.g., 'PENDING').
 * @returns {string} The HTML for the badge.
 */
function convertStatusIntoBadge(status) {
    switch (status) {
        case 'PENDING':
            return '<span class="status-badge status-pending">Не рассмотрена</span>';
        case 'REJECTED':
            return '<span class="status-badge status-rejected">Отклонена</span>';
        case 'APPROVED':
            return '<span class="status-badge status-review">Одобрена</span>';
        case 'COMPLETED':
            return '<span class="status-badge status-completed">Выполнена</span>';
        default:
            return `<span class="status-badge">${status || 'N/A'}</span>`;
    }
}

// Initial load when the DOM is ready and the tab is visible.
document.addEventListener('DOMContentLoaded', function () {
    // This assumes the tab is visible on load. A more robust solution might
    // use a MutationObserver or a custom event when the tab is shown.
    const offersTab = document.getElementById('requests-tab');
    if (offersTab) {
        void loadOffers(1);
    }
});

// Expose functions to the global scope if they are called from other scripts
// or legacy inline handlers we might have missed.
window.loadOffers = loadOffers;