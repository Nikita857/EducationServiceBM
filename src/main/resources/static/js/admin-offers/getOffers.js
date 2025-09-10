let currentOfferPage = 1;
let totalOfferPages = 1;
let totalOfferItems = 0;
let sortStatus = "all";

// Количество пользователей на странице
let offersPerPage = 5;

async function loadOffers(page = 1) {
    try {
        console.log(`Загрузка заявок, страница: ${page}`);
        const response = await fetch(`/admin/offers?page=${page}&size=${offersPerPage}&status=${sortStatus}`);

        if (response.ok) {
            const data = await response.json();

            if (data.success && data.offers) {
                currentOfferPage = data.currentPage || page;
                totalOfferPages = data.totalPages || 1;
                totalOfferItems = data.totalItems || data.offers.length;

                renderOffersTable(data.offers);

                renderOfferPagePagination();
            } else {
                throw new Error("Неверный формат данных от AdminOfferController");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (e) {
        console.log(e)
    }
}

// Функция для удаления заявки
async function deleteOffer(offerId) {
    if (!confirm('Вы уверены, что хотите удалить эту заявку?')) {
        return;
    }

    try {
        const response = await fetch(`/admin/offers/delete/${offerId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('Заявка успешно удалена!', 'success');
            // Обновляем список заявок
            loadOffers(currentOfferPage);
        } else {
            showAlert(result.error || 'Ошибка при удалении заявки', 'error');
        }

    } catch (error) {
        console.error('Ошибка удаления заявки:', error);
        showAlert('Произошла ошибка при удалении заявки', 'error');
    }
}

// Функция для получения CSRF токена
function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}

function rowsInOfferTable(offerRowsCount) {
    offersPerPage = offerRowsCount;
    loadOffers()
}

function filterByStatus(selectedStatus) {
    sortStatus = selectedStatus
    loadOffers()
}

function renderOffersTable(offers) {
    const offerTableContainer = document.querySelector('#requests-tab .card-body');

    if (!offerTableContainer) {
        console.error('Контейнер для таблицы заявок не найден');
        return;
    }

    // Очищаем контейнер
    offerTableContainer.innerHTML = '';

    const tableHTML = `
        <div class="data-table courses-table">
    <div class="table-header d-flex justify-content-between align-items-center">
        <h3 class="table-title">Список заявок (Всего: ${offers.length})</h3>
        
        <div class="d-flex">
            <div class="sort-filter">
                <div class="input-group">
                    <span class="input-group-text">
                        <i class="bi bi-funnel"></i>
                    </span>
                    <select class="form-select" id="statusFilter" onchange="filterByStatus(this.value)">
                        <option value="#" selected>Фильтры</option>
                        <option value="all">Все заявки</option>
                        <option value="PENDING">На рассмотрении</option>
                        <option value="APPROVED">Одобреные</option>
                        <option value="COMPLETED">Выполненые</option>
                        <option value="REJECTED">Отклоненные</option>
                    </select>
                </div>
                <div class="page-size-selector">
                    <div class="input-group">
                        <span class="input-group-text">
                            Отображать в таблице
                        </span>
                        <select class="form-select" id="pageSizeSelect" onchange="rowsInOfferTable(this.value)">
                            <option value="5">5 строк</option>
                            <option value="10" selected>10 строк</option>
                            <option value="20">20 строк</option>
                            <option value="50">50 строк</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="table-content">
        <!-- Заголовок таблицы -->
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

        <!-- Строки с заявками -->
        ${offers.length > 0 ? offers.map(offer => `
        <div class="table-row">
            <div class="table-cell text-muted">#${offer.id || 'N/A'}</div>
            <div class="table-cell text-muted">#${offer.fio || 'N/A'}</div>
            <div class="table-cell">
                <div class="fw-bold">${offer.topic || 'N/A'}</div>
            </div>
            <div class="table-cell">
                <span class="course-description">
                    ${offer.description || 'N/A'}
                </span>
            </div>
            <div class="table-cell">
                <span class="course-description">
                    ${offer.response || 'Нет ответа'}
                </span>
            </div>
            <div class="table-cell">
                ${convertStatusIntoBadge(offer.status)}
            </div>
            <div class="table-cell text-sm text-muted">${extractDateWithRegex(offer.createdAt)}</div>
            <div class="table-cell text-sm text-muted">${extractDateWithRegex(offer.updatedAt)}</div>
            <div class="table-cell action-buttons">
                ${createOfferResponseButton(offer)}
                <button class="btn btn-danger btn-icon btn-sm" title="Удалить" onclick="deleteOffer(${offer.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `).join('') : `
        <div class="table-row">
            <div class="text-center py-4 text-muted">
                <i class="bi bi-inbox"></i>
                Заявки не найдены
            </div>
        </div>
    `}
    </div>
</div>

<!-- Пагинация офферов-->
<div class="pagination-container-edit-offers mt-3"></div>

<!-- Кнопка обновления -->
<div class="text-center mt-3">
    <button class="btn btn-primary" onclick="loadOffers(currentOfferPage)">
        <i class="bi bi-arrow-repeat"></i> Обновить список
    </button>
</div>
`;

    offerTableContainer.innerHTML = tableHTML;
}

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
                <li class="page-item ${currentOfferPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeOfferPage(${currentOfferPage - 1}); return false;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;

    // Показываем ограниченное количество страниц
    const maxVisiblePages = 5;
    let offerStartPage = Math.max(1, currentOfferPage - Math.floor(maxVisiblePages / 2));
    let offerEndPage = Math.min(totalOfferPages, offerStartPage + maxVisiblePages - 1);

    // Корректируем начало, если接近 концу
    if (offerEndPage - offerStartPage + 1 < maxVisiblePages) {
        offerStartPage = Math.max(1, offerEndPage - maxVisiblePages + 1);
    }

    // Первая страница с многоточием
    if (offerStartPage > 1) {
        offerPaginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeOfferPage(1); return false;">1</a>
            </li>
            ${offerStartPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    // Основные страницы
    for (let i = offerStartPage; i <= offerEndPage; i++) {
        offerPaginationHTML += `
            <li class="page-item ${i === currentOfferPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeOfferPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    // Последняя страница с многоточием
    if (offerEndPage < totalOfferPages) {
        offerPaginationHTML += `
            ${offerEndPage < totalOfferPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeOfferPage(${totalOfferPages}); return false;">${totalOfferPages}</a>
            </li>
        `;
    }

    offerPaginationHTML += `
                <li class="page-item ${currentOfferPage === totalOfferPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeOfferPage(${currentOfferPage + 1}); return false;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentOfferPage} из ${totalOfferPages} • 
                Всего заявок: ${totalOfferItems}
            </small>
        </div>
    `;

    offerPaginationContainer.innerHTML = offerPaginationHTML;
}

function changeOfferPage(page) {
    if (page < 1 || page > totalOfferPages || page === currentOfferPage) return;
    loadOffers(page);
}

function extractDateWithRegex(dateString) {
    // Ищем паттерн даты YYYY-MM-DD или YYYY/MM/DD
    const match = dateString.match(/^(\d{4})[-/](\d{2})[-/](\d{2})/);

    if (match) {
        const [, year, month, day] = match;
        return `${year}-${month}-${day}`;
    }

    // Если не нашли подходящий формат, возвращаем оригинальную строку
    return dateString;
}

function convertStatusIntoBadge(status) {
    switch (status) {
        case 'PENDING':
            return '<span class="status-badge status-pending">Не рассмотрена</span>'
        case 'REJECTED':
            return '<span class="status-badge status-rejected">Отклонена</span>'
        case 'APPROVED':
            return '<span class="status-badge status-review">Одобрена</span>'
        case 'COMPLETED':
            return '<span class="status-badge status-completed">Выполнена</span>'
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const offersTab = document.getElementById('requests-tab')
    if(offersTab) {
        loadOffers(1)
    }
});

window.loadOffers = loadOffers;
window.deleteOffer = deleteOffer;
window.rowsInOfferTable = rowsInOfferTable;
window.filterByStatus = filterByStatus;
window.changeOfferPage = changeOfferPage;
