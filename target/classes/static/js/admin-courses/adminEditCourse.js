let currentPage = 1;
let totalPages = 1;
let totalItems = 0;

// Количество пользователей на странице
let coursesPerPage = 1;

async function loadCourses(page = 1) {
    try {
        console.log(`Загрузка курсов, страница: ${page}`);
        const response = await fetch(`/admin/courses?page=${page}&size=${coursesPerPage}`);

        if (response.ok) {
            const data = await response.json();
            console.log('Данные получены:', data);

            if (data.success && data.courses) {
                currentPage = data.currentPage || page;
                totalPages = data.totalPages || 1;
                totalItems = data.totalItems || data.courses.length;

                console.log("Рендерим таблицу...");
                renderCoursesTable(data.courses);
                console.log("Таблица отрендерена");

                console.log("Рендерим пагинацию таблицы курсов...");
                renderPagination();
                console.log("Пагинация курсов отрендерена");
            } else {
                throw new Error("Неверный формат данных от AdminCoursesController");
            }
        } else {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
    } catch (e) {
        console.error('Ошибка загрузки курсов:', e);
    }
}

async function deleteCourse(courseId, courseTitle) {
    if (!confirm(`Вы уверены, что хотите удалить курс "${courseTitle}"? Это действие удалит все модули и уроки этого курса, и его нельзя будет отменить.`)) {
        return;
    }

    try {
        const response = await fetch(`/admin/courses/${courseId}/delete`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCsrfToken()
            }
        });

        const result = await response.json();

        if (response.ok) {
            if (result.success) {
                alert(`Курс "${courseTitle}" успешно удален!`, 'success');
                // Обновляем список курсов
                if (typeof loadCourses === 'function') {
                    loadCourses(currentPage || 1);
                }
            } else {
                alert(`Не удалось удалить курс ${error}`);
            }
        } else {
            alert(`Ошибка сервера ${error}`);
        }

    } catch (error) {
        console.error(`Ошибка удаления ${error}`);
        alert(`Ошибка удаления ${error}`);
    }
}

function redirectToAddCourse() {
    document.getElementById('openAddModuleTab').click()
}

function rowsInTable(rowsCount) {
    coursesPerPage = rowsCount;
    loadCourses()
}

function renderCoursesTable(courses) {
    const tableContainer = document.querySelector('#courses-edit-tab .card-body');

    if (!tableContainer) {
        console.error('Контейнер для таблицы курсов не найден');
        return;
    }

    // Очищаем контейнер
    tableContainer.innerHTML = '';

    const tableHTML = `
        <div class="data-table courses-table">
    <div class="table-header d-flex justify-content-between align-items-center">
        <h3 class="table-title">Список курсов</h3>
        <div class="page-size-selector">
            <div class="input-group">
                <span class="input-group-text">
                    Отображать в таблице
                </span>
                <select class="form-select" id="pageSizeSelect" onchange="rowsInTable(this.value)">
                    <option value="5">5 строк</option>
                    <option value="10" selected>10 строк</option>
                    <option value="20">20 строк</option>
                    <option value="50">50 строк</option>
                </select>
            </div>
        </div>
    </div>

    <div class="table-content">
        <!-- Заголовок таблицы -->
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

        <!-- Строки с курсами -->
        ${courses.length > 0 ? courses.map(course =>`
        <div class="table-row">
            <div class="table-cell text-muted">#${course.id || 'N/A'}</div>
            <div class="table-cell">
                <img src="/img/course-brand/${course.image}" alt="Просмотр изображения курса"
                     class="course-image" onclick="openViewCourseImageModal('${course.image}')" style="cursor: pointer">
            </div>
            <div class="table-cell">
                <div class="fw-bold">${course.title || 'N/A'}</div>
            </div>
            <div class="table-cell">
                        <span class="course-description">
                            ${course.description || 'N/A'}
                        </span>
            </div>
            <div class="table-cell">
                <code>/courses/${course.slug}</code>
            </div>
            <div class="table-cell">
                <span class="status-badge status-review">${course.status}</span>
            </div>
            <div class="table-cell text-sm text-muted">${formatCourseDate(course.createdAt)}</div>
            <div class="table-cell text-sm text-muted">${formatCourseDate(course.updatedAt)}</div>
            <div class="table-cell action-buttons">
                <button class="btn btn-primary btn-icon btn-sm" title="Редактировать">
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
            <div colspan="11" class="text-center py-4 text-muted">
                <i class="fas fa-users-slash me-2"></i>
                Курсы не найдены
            </div>
        </div>
    `}
    </div>
</div>

<!-- Пагинация -->
<div class="pagination-container-edit-course mt-3"></div>

<!-- Кнопка обновления -->
<div class="text-center mt-3">
    <button class="btn btn-primary" onclick="loadCourses(currentPage)">
        <i class="fas fa-sync-alt"></i> Обновить список
    </button>
</div>
    `;

    tableContainer.innerHTML = tableHTML;
}

function renderPagination() {
    const paginationContainer = document.querySelector('.pagination-container-edit-course');

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
                Всего курсов: ${totalItems}
            </small>
        </div>
    `;

    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    if (page < 1 || page > totalPages || page === currentPage) return;
    loadCourses(page);
}

function formatCourseDate(dateString) {
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

function openViewCourseImageModal(img) {
    // Убедитесь, что модальное окно существует
    if (!document.getElementById('viewImageModal')) {
        renderImageViewModal();
    }

    // Устанавливаем изображение
    const modalImg = document.getElementById('modalImgCourse');
    if (modalImg) {
        modalImg.src = `/img/course-brand/${img}`;
        modalImg.alt = `Изображение курса: ${img}`;
    }

    // Показываем модальное окно
    const modalElement = document.getElementById('viewImageModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function renderImageViewModal() {
    // Проверяем, не добавлено ли уже модальное окно
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


// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем пользователей при загрузке страницы
    const coursesTab = document.getElementById('courses-edit-tab');
    if (coursesTab) {
        loadCourses(1);
        renderImageViewModal()
    }
});