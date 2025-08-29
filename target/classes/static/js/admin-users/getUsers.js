let currentPage = 1;
let totalPages = 1;
let totalItems = 0;

// Количество пользователей на странице
const usersPerPage = 2;

async function loadUsers(page = 1) {
    try {
        console.log(`Загрузка пользователей, страница: ${page}`);
        const response = await fetch(`/admin/users?page=${page}&size=${usersPerPage}`);

        if (response.ok) {
            const data = await response.json();
            console.log('Данные получены:', data);

            if (data.success && data.users) {
                currentPage = data.currentPage || page;
                totalPages = data.totalPages || 1;
                totalItems = data.totalItems || data.users.length;

                console.log("Рендерим таблицу...");
                renderUsersTable(data.users);
                console.log("Таблица отрендерена");

                console.log("Рендерим пагинацию...");
                renderPagination();
                console.log("Пагинация отрендерена");
            } else {
                throw new Error("Неверный формат данных");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (e) {
        console.error('Ошибка загрузки пользователей:', e);
        showError('Не удалось загрузить данные пользователей');
    }
}

function getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.content ||
        document.querySelector('input[name="_csrf"]')?.value;
}

async function deleteUsersRequest(userId) {
    try {
        const body = JSON.stringify({ userId: userId });
        const deleteRequest = await fetch(`/admin/users/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: body
        });

        const response = await deleteRequest.json();

        if (deleteRequest.ok) {
            if (response.success) {
                alert(response.message);
                // Перезагружаем список пользователей
                await loadUsers(currentPage);
            } else {
                alert(response.message);
            }
        } else {
            alert(`Ошибка сервера: ${response.error || 'Неизвестная ошибка'}`);
        }
    } catch (error) {
        alert(`Ошибка удаления: ${error.message}`);
        console.error('Delete error:', error);
    }
}

function renderUsersTable(users) {
    const tableContainer = document.querySelector('#users-tab .card-body');

    if (!tableContainer) {
        console.error('Контейнер для таблицы не найден');
        return;
    }

    // Очищаем контейнер
    tableContainer.innerHTML = '';

    const tableHTML = `
        <div class="data-table">
            <div class="table-header">
                <h3 class="table-title">Список пользователей</h3>
            </div>
            
            <div class="table-content">
                <!-- Заголовок таблицы -->
                <div class="table-row header-row">
                    <div>ID</div>
                    <div>Аватар</div>
                    <div>Имя</div>
                    <div>Фамилия</div>
                    <div>Отдел</div>
                    <div>Должность</div>
                    <div>Квалификация</div>
                    <div>Логин</div>
                    <div>Создан</div>
                    <div>Действия</div>
                </div>
                
                ${users.length > 0 ? users.map(user => `
                    <div class="table-row">
                        <div class="text-muted">#${user.id || 'N/A'}</div>
                        <div>
                            <img src="/avatars/${user.avatar || 'avatar.png'}" alt="Аватар" 
                                 style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        </div>
                        <div>${escapeHtml(user.firstName || 'Не указано')}</div>
                        <div>${escapeHtml(user.lastName || 'Не указано')}</div>
                        <div>${escapeHtml(user.department || 'Не указан')}</div>
                        <div>${escapeHtml(user.jobTitle || 'Не указана')}</div>
                        <div>
                            <span class="status-badge ${getQualificationClass(user.qualification)}">
                                ${escapeHtml(user.qualification || 'Не указана')}
                            </span>
                        </div>
                        <div>${escapeHtml(user.username || 'Не указан')}</div>
                        <div class="text-sm text-muted">${formatDate(user.createdAt)}</div>
                        <div class="action-buttons">
                            <button class="btn btn-primary btn-icon btn-sm" title="Редактировать" onclick="editUser(${user.id})">
                                <i class="bi bi-pencil"></i>Редактировать
                            </button>
                            <button class="btn btn-danger btn-icon btn-sm" title="Удалить" onclick="deleteUser(${user.id})">
                                <i class="bi bi-trash3"></i>Удалить
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="table-row">
                        <div colspan="11" class="text-center py-4 text-muted">
                            <i class="fas fa-users-slash me-2"></i>
                            Пользователи не найдены
                        </div>
                    </div>
                `}
            </div>
        </div>
        
        <!-- Контейнер для пагинации -->
        <div class="pagination-container mt-3"></div>
        
        <!-- Кнопка обновления -->
        <div class="text-center mt-3">
            <button class="btn btn-primary" onclick="loadUsers(currentPage)">
                <i class="fas fa-sync-alt"></i> Обновить список
            </button>
        </div>
    `;

    tableContainer.innerHTML = tableHTML;
}

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination-container');

    if (!paginationContainer) {
        console.error('Контейнер для пагинации не найден');
        return;
    }

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;

    // Показываем ограниченное количество страниц
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Корректируем начало, если接近 концу
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Первая страница с многоточием
    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(1); return false;">1</a>
            </li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    // Основные страницы
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    // Последняя страница с многоточием
    if (endPage < totalPages) {
        paginationHTML += `
            ${endPage < totalPages - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentPage} из ${totalPages} • 
                Всего пользователей: ${totalItems}
            </small>
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadUsers(page);
}

// Вспомогательные функции
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return 'Не указано';

    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (e) {
        return dateString;
    }
}

function getQualificationClass(qualification) {
    if (!qualification) return 'status-pending';

    const qual = qualification.toLowerCase();
    if (qual.includes('expert') || qual.includes('senior') || qual.includes('lead')) {
        return 'status-completed';
    } else if (qual.includes('middle') || qual.includes('intermediate')) {
        return 'status-review';
    } else if (qual.includes('junior') || qual.includes('trainee')) {
        return 'status-pending';
    } else {
        return 'status-pending';
    }
}

function showError(message) {
    const tableContainer = document.querySelector('#users-tab .card-body');
    if (tableContainer) {
        tableContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                ${escapeHtml(message)}
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="loadUsers(1)">
                    <i class="fas fa-redo"></i> Попробовать снова
                </button>
            </div>
        `;
    }
}

function deleteUser(userId) {
    if (confirm('Вы уверены, что хотите удалить этого пользователя?')) {
        deleteUsersRequest(userId)
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем пользователей при загрузке страницы
    const usersTab = document.getElementById('users-tab');
    if (usersTab) {
        loadUsers(1);
    }
});