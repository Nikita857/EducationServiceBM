
let currentPageUsers = 1;
let totalPagesUsers = 1;
let totalItemsUsers = 0;
let usersPerPage = 10; // Default page size
let roleFilter = 'ALL'; // Default role filter

async function loadUsers(page = 1, size = usersPerPage, role = roleFilter) {
    try {
        console.log(`Загрузка пользователей: страница ${page}, размер ${size}, роль ${role}`);
        const response = await fetch(`/admin/users?page=${page}&size=${size}&role=${role}`);

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.users) {
                currentPageUsers = data.currentPage || page;
                totalPagesUsers = data.totalPages || 1;
                totalItemsUsers = data.totalItems || data.users.length;

                renderUsersTable(data.users);
            } else {
                throw new Error("Неверный формат данных от сервера");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (e) {
        console.error('Ошибка загрузки пользователей:', e);
        showError('Не удалось загрузить данные пользователей');
    }
}

function rowsInUserTable(size) {
    usersPerPage = parseInt(size, 10);
    loadUsers(1, usersPerPage, roleFilter);
}

function filterByUserRole(role) {
    roleFilter = role;
    loadUsers(1, usersPerPage, roleFilter);
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
                showAlert(response.message, 'success');
                // Перезагружаем список пользователей
                await loadUsers(currentPageUsers, usersPerPage, roleFilter);
            } else {
                showAlert(response.message, 'error');
            }
        } else {
            showAlert(`Ошибка сервера: ${response.error || 'Неизвестная ошибка'}`, 'error');
        }
    } catch (error) {
        showAlert(`Ошибка удаления: ${error.message}`, 'error');
        console.error('Delete error:', error);
    }
}

function renderUsersTable(users) {
    const tableContainer = document.querySelector('#users-tab .card-body');
    if (!tableContainer) {
        console.error('Контейнер для таблицы не найден');
        return;
    }
    tableContainer.innerHTML = '';

    const tableHTML = `
    <div class="users-table-container">
        <div class="data-table users-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">Список пользователей</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-people"></i></span>
                        <select class="form-select form-select-sm" id="roleFilter" onchange="filterByUserRole(this.value)">
                            <option value="ALL" ${roleFilter === 'ALL' ? 'selected' : ''}>Все роли</option>
                            <option value="USER" ${roleFilter === 'USER' ? 'selected' : ''}>Пользователь</option>
                            <option value="ADMIN" ${roleFilter === 'ADMIN' ? 'selected' : ''}>Администратор</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">Показывать</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect" onchange="rowsInUserTable(this.value)">
                            <option value="5" ${usersPerPage == 5 ? 'selected' : ''}>5</option>
                            <option value="10" ${usersPerPage == 10 ? 'selected' : ''}>10</option>
                            <option value="20" ${usersPerPage == 20 ? 'selected' : ''}>20</option>
                            <option value="50" ${usersPerPage == 50 ? 'selected' : ''}>50</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="table-content">
                <!-- Заголовок таблицы -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Аватар</div>
                    <div class="table-cell">Имя</div>
                    <div class="table-cell">Фамилия</div>
                    <div class="table-cell">Отдел</div>
                    <div class="table-cell">Должность</div>
                    <div class="table-cell">Квалификация</div>
                    <div class="table-cell">Логин</div>
                    <div class="table-cell">Создан</div>
                    <div class="table-cell">Роль</div>
                    <div class="table-cell">Действия</div>
                </div>
                
                ${users.length > 0 ? users.map(user => `
                    <div class="table-row">
                        <div class="table-cell text-muted">#${user.id || 'N/A'}</div>
                        <div class="table-cell">
                            <img src="/avatars/${user.avatar || 'avatar.png'}" alt="Аватар" class="user-avatar">
                        </div>
                        <div class="table-cell">${escapeHtml(user.firstName || 'Не указано')}</div>
                        <div class="table-cell">${escapeHtml(user.lastName || 'Не указано')}</div>
                        <div class="table-cell">${escapeHtml(user.department || 'Не указан')}</div>
                        <div class="table-cell">${escapeHtml(user.jobTitle || 'Не указана')}</div>
                        <div class="table-cell">
                            <span class="status-badge ${getQualificationClass(user.qualification)}">
                                ${escapeHtml(user.qualification || 'Не указана')}
                            </span>
                        </div>
                        <div class="table-cell">${escapeHtml(user.username || 'Не указан')}</div>
                        <div class="table-cell text-sm text-muted">${formatDate(user.createdAt)}</div>
                        <div class="table-cell">${displayRoles(user.role)}</div>
                        <div class="table-cell action-buttons justify-content-center">
                            <button class="btn btn-primary btn-icon btn-sm" title="Редактировать" onclick="editUser(${user.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-icon btn-sm" title="Удалить" onclick="deleteUser(${user.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-success btn-icon btn-sm" title="Записать на курс" onclick="openEnrollModal(${user.id}, '${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}')">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                            <button class="btn btn-info btn-icon btn-sm" title="Просмотр курсов" onclick="openViewCoursesModal(${user.id}, '${escapeHtml(user.firstName)} ${escapeHtml(user.lastName)}')">
                                <i class="bi bi-card-list"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="table-row" style="grid-template-columns: 1fr;">
                        <div class="text-center py-4 text-muted">
                            <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                            Пользователи не найдены
                        </div>
                    </div>
                `}
            </div>
        </div>
    </div>
        
    <!-- Контейнер для пагинации -->
    <div class="pagination-container mt-3"></div>
    
    <!-- Кнопка обновления -->
    <div class="text-center mt-3">
        <button class="btn btn-primary" onclick="loadUsers(currentPageUsers, usersPerPage, roleFilter)">
            <i class="bi bi-arrow-repeat"></i> Обновить список
        </button>
    </div>
    `;

    tableContainer.innerHTML = tableHTML;

    const paginationContainer = document.querySelector('#users-tab .pagination-container');
    if (!paginationContainer) {
        console.error('Контейнер для пагинации не найден');
        return;
    }
    if (totalPagesUsers <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPageUsers === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${currentPageUsers - 1}); return false;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPageUsers - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPagesUsers, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(1); return false;">1</a>
            </li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPageUsers ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeUsersPage(${i}); return false;">${i}</a>
            </li>
        `;
    }

    if (endPage < totalPagesUsers) {
        paginationHTML += `
            ${endPage < totalPagesUsers - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(${totalPagesUsers}); return false;">${totalPagesUsers}</a>
            </li>
        `;
    }

    paginationHTML += `
                <li class="page-item ${currentPageUsers === totalPagesUsers ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${currentPageUsers + 1}); return false;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentPageUsers} из ${totalPagesUsers} • 
                Всего пользователей: ${totalItemsUsers}
            </small>
        </div>
    `;
    paginationContainer.innerHTML = paginationHTML;
}

function changeUsersPage(page) {
    if (page < 1 || page > totalPagesUsers || page === currentPageUsers) return;
    loadUsers(page, usersPerPage, roleFilter);
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

function displayRoles(role) {
    return role === '[ROLE_USER]' ? 'Пользователь' : 'Администратор';
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

// Функция для открытия модального окна
async function openEnrollModal(userId, userName) {
    // 1. Устанавливаем имя и ID пользователя в модальном окне
    document.getElementById('enrollUserName').textContent = userName;
    document.getElementById('enrollUserId').value = userId;

    const courseSelect = document.getElementById('courseSelect');
    courseSelect.innerHTML = '<option>Загрузка курсов...</option>';

    // 2. Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('enrollUserModal'));
    modal.show();

    // 3. Загружаем список курсов с бэкенда
    try {
        const response = await fetch('/admin/courses');
        const data = await response.json();

        if (data.success && data.courses) {
            courseSelect.innerHTML = ''; // Очищаем
            if (data.courses.length === 0) {
                courseSelect.innerHTML = '<option>Нет доступных курсов</option>';
            } else {
                data.courses.forEach(course => {
                    const option = document.createElement('option');
                    option.value = course.id;
                    option.textContent = course.title;
                    courseSelect.appendChild(option);
                });
            }
        }
    } catch (e) {
        courseSelect.innerHTML = '<option>Ошибка загрузки курсов</option>';
        console.error(e);
    }
}

// Функция для подтверждения и отправки запроса
async function confirmEnrollment() {
    const userId = document.getElementById('enrollUserId').value;
    const courseId = document.getElementById('courseSelect').value;

    if (!courseId || isNaN(courseId)) {
        alert('Пожалуйста, выберите курс.');
        return;
    }

    const requestData = {
        userId: parseInt(userId),
        courseId: parseInt(courseId)
    };

    console.log("enrollment data ",requestData)

    try {
        const response = await fetch('/admin/user/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert(result.message);
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('enrollUserModal'));
            modal.hide();
        } else {
            showAlert(`Ошибка: ${result.message || 'Не удалось записать пользователя.'}`, 'error');
        }
    } catch (e) {
        showAlert('Ошибка сервера', 'error');
        console.error(e);
    }
}

async function openViewCoursesModal(userId, userName) {
    document.getElementById('viewUserName').textContent = userName;
    const userCoursesList = document.getElementById('userCoursesList');
    userCoursesList.innerHTML = '<li class="list-group-item">Загрузка курсов...</li>';

    // Сохраняем данные для перезагрузки
    userCoursesList.dataset.userId = userId;
    userCoursesList.dataset.userName = userName;

    const modal = new bootstrap.Modal(document.getElementById('viewUserCoursesModal'));
    modal.show();

    try{
        const response = await fetch(`/admin/user/${userId}/courses`);
        const data = await response.json();

        if(data.success && data.courses) {
            userCoursesList.innerHTML = '';
            if(data.courses.length === 0) {
                userCoursesList.innerHTML = '<li class="list-group-item">Пользователь не записан ни на один курс.</li>';
            } else {
                data.courses.forEach(course => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';

                    const titleSpan = document.createElement('span');
                    titleSpan.textContent = course.title;
                    listItem.appendChild(titleSpan);

                    const unenrollButton = document.createElement('button');
                    unenrollButton.className = 'btn btn-danger btn-sm';
                    unenrollButton.textContent = 'Отписать';
                    unenrollButton.onclick = () => confirmUnenrollment(userId, userName, course.id, course.title);
                    listItem.appendChild(unenrollButton);

                    userCoursesList.append(listItem);
                })
            }
        } else {
            userCoursesList.innerHTML = '<li class="list-group-item text-danger">Ошибка загрузки курсов.</li>';
            console.error('Failed to load user courses:', data.error);
        }
    } catch (e) {
        userCoursesList.innerHTML = '<li class="list-group-item text-danger">Ошибка сервера.</li>';
        console.error('Network error loading user courses:', e);
    }
}

function confirmUnenrollment(userId, userName, courseId, courseTitle) {
    const message = `Вы уверены, что хотите отписать пользователя "${userName}" от курса "${courseTitle}"?`;
    if (confirm(message)) {
        unenrollRequest(userId, courseId, userName);
    }
}

async function unenrollRequest(userId, courseId, userName) {
    const requestData = { userId, courseId };

    try {
        const response = await fetch('/admin/user/unenroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            },
            body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert(result.message);
            // Обновляем список курсов в модальном окне
            await openViewCoursesModal(userId, userName);
        } else {
            showAlert(`Ошибка: ${result.message || 'Не удалось отписать пользователя.'}`, 'error');
        }
    } catch (e) {
        showAlert('Ошибка сервера', 'error');
        console.error(e);
    }
}

// Инициализация

document.addEventListener('DOMContentLoaded', function() {
    // Загружаем пользователей при загрузке страницы
    const usersTab = document.getElementById('users-tab');
    if (usersTab) {
        loadUsers(1, usersPerPage, roleFilter);
    }
});

// Expose functions to global scope for onclick attributes
window.loadUsers = loadUsers;
window.deleteUser = deleteUser;
window.openEnrollModal = openEnrollModal;
window.confirmEnrollment = confirmEnrollment;
window.openViewCoursesModal = openViewCoursesModal;
window.confirmUnenrollment = confirmUnenrollment;
window.unenrollRequest = unenrollRequest;
window.changeUsersPage = changeUsersPage;
window.currentPageUsers = currentPageUsers;
window.rowsInUserTable = rowsInUserTable;
window.filterByUserRole = filterByUserRole;
