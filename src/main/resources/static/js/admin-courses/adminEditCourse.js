let currentPage = 1;
let totalPages = 1;
let totalItems = 0;
let coursesPerPage = 10; // Default courses per page

// --- NEW: Function to switch to the Add Course tab ---
function openAddCourseForm() {
    const tabLink = document.querySelector('a[data-tab="courses-add-tab"]');
    if (tabLink) {
        tabLink.click();
    } else {
        showAlert('Не удалось найти вкладку для добавления курса', 'error');
    }
}

// --- MODIFIED: Renamed for consistency ---
function changeCoursesPerPage(perPage) {
    coursesPerPage = parseInt(perPage) || 10;
    void loadCourses(1);
}

async function loadCourses(page = 1) {
    try {
        const response = await fetch(`/admin/courses?page=${page}&size=${coursesPerPage}`);
        if (!response.ok) {
            return null;
        }
        
        const data = await response.json();
        if (!data.success || !data.data || !data.data.content) {
            return null;
        }

        currentPage = data.data["currentPage"] || page;
        totalPages = data.data["totalPages"] || 1;
        totalItems = data.data["totalItems"] || data.data.content.length;

        renderCoursesTable(data.data.content);
        renderPagination();

    } catch (e) {
        showAlert(`Ошибка загрузки курсов ${e}`, 'error')
    }
}

async function deleteCourse(courseId, courseTitle) {
    if (!confirm(`Вы уверены, что хотите удалить курс "${courseTitle}"? Это действие удалит все модули и уроки этого курса, и его нельзя будет отменить.`)) {
        return null;
    }

    try {
        const headers = { 'Content-Type': 'application/json' };

        const response = await fetch(`/admin/courses/${courseId}/delete`, {
            method: 'DELETE',
            headers: headers
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok) {
            showAlert(`Курс "${courseTitle}" успешно удален!`, 'success');
            setTimeout(()=>{
                loadCourses(currentPage || 1);
            }, 1500)

        } else {
            return null;
        }

    } catch (error) {
        showAlert(`Ошибка удаления: ${error.message}`, 'error');
    }
}

// --- MODIFIED: renderCoursesTable with new header ---
function renderCoursesTable(courses) {
    const tableContainer = document.querySelector('#courses-edit-tab .card-body');
    if (!tableContainer) {
        return;
    }

    tableContainer.innerHTML = ''; // Clear previous content

    tableContainer.innerHTML = `
        <div class="data-table courses-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">Список курсов</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">Отображать</span>
                            <select class="form-select" id="pageSizeSelect" onchange="changeCoursesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openAddCourseForm()">
                        <i class="bi bi-plus-circle me-1"></i>Новый курс
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Изображение</div>
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Описание</div>
                    <div class="table-cell">URI</div>
                    <div class="table-cell">Статус</div>
                    <div class="table-cell">Создан</div>
                    <div class="table-cell">Обновлен</div>
                    <div class="table-cell">Действия</div>
                </div>

                ${courses.length > 0 ? courses.map(course => `
                <div class="table-row" id="course-row-${course.id}">
                    <div class="table-cell text-muted">#${course.id || 'N/A'}</div>
                    <div class="table-cell">
                        <img src="/img/course-brand/${course.image}" alt="Изображение курса"
                             class="course-image" data-image-name="${course.image}" onclick="openViewCourseImageModal('${course.image}')" style="cursor: pointer">
                    </div>
                    <div class="table-cell">
                        <div class="fw-bold">${course.title || 'N/A'}</div>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${course.description || 'N/A'}</span>
                    </div>
                    <div class="table-cell">
                        ${getActiveLinks(course)}
                    </div>
                    <div class="table-cell" data-course-id="${course.id}">
                    ${adaptiveCourseStatus(course.status, course.id)}
                    </div>
                    <div class="table-cell text-sm text-muted">${formatCourseDate(course["createdAt"])}</div>
                    <div class="table-cell text-sm text-muted">${formatCourseDate(course["updatedAt"])}</div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-primary btn-icon btn-sm" title="Редактировать" onclick="openEditCourseModal(${course.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-primary btn-icon btn-sm" title="Модули" onclick="showCourseModules(${course.id}, '${course.title}')">
                            М
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="Удалить" onclick="deleteCourse(${course.id}, '${course.title}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-journal-x me-2"></i>
                        Курсы не найдены
                    </div>
                </div>
                `}
            </div>
        </div>

        <div class="pagination-container-edit-course mt-3"></div>
    `;
    document.getElementById('pageSizeSelect').value = coursesPerPage;

    const dropdownToggleElements = tableContainer.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggleElements.forEach(dropdownToggleEl => {
        new bootstrap.Dropdown(dropdownToggleEl);
    });

    // Force overflow to be visible on table cells to prevent dropdown clipping
    const tableCells = tableContainer.querySelectorAll('.table-cell');
    tableCells.forEach(cell => {
        cell.style.overflow = 'visible';
    });
}

function getActiveLinks(course) {
    return course.status === 'ACTIVE'? `<code class="click-for-redirect" style="cursor: pointer">/course/${course.slug}</code>`
        : `<p>Невозможно просмотреть курс</p>`;
}

function adaptiveCourseStatus(status, courseId) {
    const statusMap = {
        'ACTIVE': { text: 'Активный', bg: 'success' },
        'INACTIVE': { text: 'Неактивный', bg: 'secondary' },
        'ARCHIVED': { text: 'В архиве', bg: 'dark' }
    };

    const currentStatusInfo = statusMap[status] || { text: 'Неизвестно', bg: 'light' };

    const dropdownItems = Object.keys(statusMap).map(s => {
        if (s === status) return '';
        const newStatusInfo = statusMap[s];
        return `<li><a class="dropdown-item" href="#" onclick="event.preventDefault(); updateCourseStatus(${courseId}, '${currentStatusInfo.text}', '${s}', '${newStatusInfo.text}')">${newStatusInfo.text}</a></li>`;
    }).join('');

    return `
        <div class="dropdown">
            <button class="btn btn-sm dropdown-toggle badge rounded-pill text-bg-${currentStatusInfo.bg}" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${currentStatusInfo.text}
            </button>
            <ul class="dropdown-menu">
                ${dropdownItems}
            </ul>
        </div>
    `;
}

async function updateCourseStatus(courseId, currentStatusText, newStatus, newStatusText) {
    if (!confirm(`Вы уверены, что хотите изменить статус курса с "${currentStatusText}" на "${newStatusText}"?`)) {
        return;
    }

    const headers = {
        'Content-Type': 'application/json'
    };

    try {
        const response = await fetch(`/admin/courses/update/status`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ courseId: courseId, status: newStatus })
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
            showAlert(`Статус курса успешно изменен на "${newStatusText}"!`, 'success');
            await loadCourses(currentPage);
        } else {
            const errorMessage = result.error || `Ошибка сервера: ${response.status}`;
            throw new Error(errorMessage);
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination-container-edit-course');
    if (!paginationContainer) return;

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">&laquo;</a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1); return false;">1</a></li>`;
        if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a></li>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages}); return false;">${totalPages}</a></li>`;
    }

    paginationHTML += `
                <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">Страница ${currentPage} из ${totalPages} • Всего курсов: ${totalItems}</small>
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    void loadCourses(page);
}

function formatCourseDate(dateString) {
    if (!dateString) return 'Не указано';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
        return dateString;
    }
}

function openViewCourseImageModal(img) {
    if (!document.getElementById('viewImageModal')) {
        renderImageViewModal();
    }
    const modalImg = document.getElementById('modalImgCourse');
    if (modalImg) {
        modalImg.src = `/img/course-brand/${img}`;
        modalImg.alt = `Изображение курса: ${img}`;
    }
    const modalElement = document.getElementById('viewImageModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function renderImageViewModal() {
    if (!document.getElementById('viewImageModal')) {
        document.getElementById('img-view-modal').innerHTML += `
            <div class="modal fade" id="viewImageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Изображение курса</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img id="modalImgCourse" class="img-fluid" style="max-height: 70vh; object-fit: contain;">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const coursesTabTrigger = document.querySelector('a[data-tab="courses-edit-tab"]');
    const coursesContainer = document.getElementById('courses-edit-tab');

    if (coursesContainer) {
        coursesContainer.addEventListener('click', function (event) {
            if (event.target && event.target.classList.contains('click-for-redirect')) {
                const url = event.target.textContent.trim();
                if (url) {
                    window.location.href = url;
                }
            }

            
        });
    }
    
    if (coursesTabTrigger) {
        let isInitialized = false;
        coursesTabTrigger.addEventListener('click', () => {
            if (!isInitialized) {
                void loadCourses(1);
                renderImageViewModal();
                renderEditCourseModal(); // Render the edit modal structure on tab click
                isInitialized = true;
            }
        });

        if (document.getElementById('courses-edit-tab')?.classList.contains('active')) {
            void loadCourses(1);
            renderImageViewModal();
            renderEditCourseModal(); // Also render here if the tab is already active
            isInitialized = true;
        }
    }
});

// --- NEW: Functions for Edit Course Modal ---

function renderEditCourseModal() {
    if (document.getElementById('editCourseModal')) {
        return; // Already rendered
    }

    const modalHTML = `
        <div class="modal fade" id="editCourseModal" tabindex="-1" aria-labelledby="editCourseModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editCourseModalLabel">Редактировать курс</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCourseForm" onsubmit="handleCourseUpdate(event)">
                            <input type="hidden" id="editCourseId" name="id">
                            
                            <div class="mb-3">
                                <label for="editCourseTitle" class="form-label">Название</label>
                                <input type="text" class="form-control" id="editCourseTitle" name="title" required minlength="2" maxlength="100">
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseDescription" class="form-label">Описание</label>
                                <textarea class="form-control" id="editCourseDescription" name="description" rows="3" required minlength="2" maxlength="100"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseSlug" class="form-label">URI (Slug)</label>
                                <input type="text" class="form-control" id="editCourseSlug" name="slug" required minlength="2" maxlength="100">
                            </div>

                            <div class="mb-3">
                                <label for="editCourseImage" class="form-label">Изображение курса</label>
                                <input class="form-control" type="file" id="editCourseImage" name="image" accept="image/png, image/jpeg, image/gif">
                                <div class="mt-2">
                                    <small class="text-muted">Текущее изображение:</small>
                                    <img id="currentCourseImage" src="" alt="Current Image" class="img-thumbnail mt-1" style="max-width: 150px;">
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                                <button type="submit" class="btn btn-primary">Сохранить изменения</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

async function openEditCourseModal(courseId) {
    const modalElement = document.getElementById('editCourseModal');
    if (!modalElement) {
        return;
    }

    const courseRow = document.getElementById(`course-row-${courseId}`);
    if (!courseRow) {
        showAlert('Не удалось найти данные для курса.', 'error');
        return;
    }

    // Extract data from the table row
    const title = courseRow.querySelector('.fw-bold').textContent.trim();
    const description = courseRow.querySelector('.course-description').textContent.trim();
    const slug = courseRow.querySelector('code').textContent.replace('/courses/', '').trim();
    const imageUrl = courseRow.querySelector('.course-image').src;

    // Populate the form
    document.getElementById('editCourseId').value = courseId;
    document.getElementById('editCourseTitle').value = title;
    document.getElementById('editCourseDescription').value = description;
    document.getElementById('editCourseSlug').value = slug;
    document.getElementById('currentCourseImage').src = imageUrl;
    document.getElementById('editCourseImage').value = ''; // Clear file input

    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

async function handleCourseUpdate(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const courseId = formData.get('id');
    const courseTitle = formData.get('title');

    const headers = {};

    try {
        // NOTE: The backend endpoint /admin/courses/update is assumed to exist.
        // It should handle a multipart/form-data POST request.
        const response = await fetch('/admin/courses/update', {
            method: 'POST',
            headers: headers,
            body: formData
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
            showAlert(`Курс "${courseTitle}" успешно обновлен!`, 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
            modal.hide();
            void loadCourses(currentPage); // Refresh the table
        } else {
            // Prefer a server-sent message, otherwise use a generic one.
            const errorMessage = result.error || `Ошибка сервера: ${response.status}`;
            return null;
        }
    } catch (error) {
        showAlert(`Ошибка обновления: ${error.message}`, 'error');
    }
}

window.openAddCourseForm = openAddCourseForm;
window.changeCoursesPerPage = changeCoursesPerPage;
window.deleteCourse = deleteCourse;
window.changePage = changePage;
window.openViewCourseImageModal = openViewCourseImageModal;
window.openEditCourseModal = openEditCourseModal;
window.handleCourseUpdate = handleCourseUpdate;
window.updateCourseStatus = updateCourseStatus;
window.loadCourses = loadCourses;
