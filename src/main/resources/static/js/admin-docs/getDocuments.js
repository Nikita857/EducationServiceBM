let currentDocsPage = 1;
let totalDocsPages = 1;
let totalDocsItems = 0;
let docsPerPage = 5;
let currentSortBy = 'id'; // Default sort by ID
let currentSortDir = 'asc'; // Default sort direction ascending

async function loadCoursesForFilter() {
    try {
        const response = await fetch('/admin/documents/courses');
        if (!response.ok) {
            return null;
        }
        const result = await response.json();
        console.log(result)
        if (result.success && result.data) {
            const select = document.getElementById('courseFilterSelect');
            if (!select) return;

            const currentFilter = select.value;

            select.innerHTML = '<option value="">Все курсы</option>';
            result.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.title;
                select.appendChild(option);
            });

            if (currentFilter) {
                select.value = currentFilter;
            }
        } else {
            return null;
        }
    } catch (error) {
        showAlert('Не удалось загрузить фильтр курсов.', 'warning');
    }
}

async function loadCategoriesForFilter() {
    try {
        const response = await fetch('/admin/documents/categories');
        if (!response.ok) {
            return null;
        }
        const result = await response.json();
        console.log(result)
        if (result.success && result.data) {
            const select = document.getElementById('categoryFilterSelect');
            if (!select) return;

            const currentFilter = select.value;

            select.innerHTML = '<option value="">Все категории</option>';
            result.data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                select.appendChild(option);
            });

            if (currentFilter) {
                select.value = currentFilter;
            }
        } else {
            return null;
        }
    } catch (error) {
        showAlert('Не удалось загрузить фильтр категорий.', 'warning');
    }
}

async function loadDocuments(page = 1) {
    console.log('loadDocuments called. Current docsPerPage:', docsPerPage);
    try {
        showLoading(true);

        const courseId = document.getElementById('courseFilterSelect')?.value || '';
        const categoryId = document.getElementById('categoryFilterSelect')?.value || '';

        let url = `/admin/documents?page=${page}&size=${docsPerPage}`;
        if (courseId) {
            url += `&courseId=${courseId}`;
            console.log('Filtering by Course ID:', courseId);
        }
        if (categoryId) {
            url += `&categoryId=${categoryId}`;
            console.log('Filtering by Category ID:', categoryId);
        }
        console.log('Fetching documents from URL:', url);

        const response = await fetch(url);

        if (response.ok) {
            const result = await response.json();
            console.log('Documents API Response:', result);

            if (result.success && result.data) {
                const paginatedData = result.data;
                console.log('Paginated Data Content:', paginatedData.content);
                currentDocsPage = paginatedData.currentPage || page;
                totalDocsPages = paginatedData.totalPages || 1;
                totalDocsItems = paginatedData.totalItems || 0;

                renderDocumentsTable(paginatedData.content);
                renderDocumentsPagination(paginatedData.content);
            } else {
                showAlert(result.message || 'Неверный формат данных', 'error');
            }
        } else {
            if (response.status === 404) {
                renderDocumentsTable([]);
                renderDocumentsPagination([]);
            } else {
                return null;
            }
        }
    } catch (error) {
        showAlert(error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function renderDocumentsTable(documents) {
    const container = document.getElementById('documentsContainer');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'documents-table-container';

    tableWrapper.innerHTML = `
        <div class="data-table documents-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">Список документов</h3>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">Название</div>
                    <div class="table-cell">Курс</div>
                    <div class="table-cell">Категория</div>
                    <div class="table-cell">Теги</div>
                    <div class="table-cell">Действия</div>
                </div>

                ${documents.length > 0 ? documents.map(doc => `
                <div class="table-row">
                    <div class="table-cell text-muted">#${doc.id || 'N/A'}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${escapeHtml(doc.name || 'Без названия')}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${escapeHtml(doc.courseName || 'N/A')}</span>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${escapeHtml(doc.categoryName || 'N/A')}</span>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${truncateText(doc.tags || 'Нет тегов', 50)}</span>
                    </div>
                    <div class="table-cell action-buttons">
                        ${doc.file ? `<a href="/docs/${doc.file}" class="btn btn-success btn-icon btn-sm" title="Открыть файл" target="_blank"><i class="bi bi-eye"></i></a>` : ''}
                        <button class="btn btn-info btn-icon btn-sm edit-doc-btn" title="Редактировать" data-doc-id="${doc.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="Удалить"
                                onclick="deleteDocument(${doc.id}, '${escapeHtml(doc.name)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-file-earmark-text me-2"></i>
                        Документы не найдены. Измените фильтр или добавьте новый документ.
                    </div>
                </div>
                `}
            </div>
        </div>
    `;
    container.appendChild(tableWrapper);
}

function renderDocumentsPagination(documents) {
    console.log('Rendering documents pagination with:', documents);
    const container = document.getElementById('documentsPagination');
    if (!container) {
        return;
    }

    if (totalDocsPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${currentDocsPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeDocsPage(${currentDocsPage - 1}); return false;">&laquo;</a>
                </li>
    `;

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentDocsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalDocsPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeDocsPage(1); return false;">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `<li class="page-item ${i === currentDocsPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changeDocsPage(${i}); return false;">${i}</a></li>`;
    }

    if (endPage < totalDocsPages) {
        if (endPage < totalDocsPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeDocsPage(${totalDocsPages}); return false;">${totalDocsPages}</a></li>`;
    }

    paginationHTML += `
                <li class="page-item ${currentDocsPage === totalDocsPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeDocsPage(${currentDocsPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                Страница ${currentDocsPage} из ${totalDocsPages} • Показано ${documents.length} из ${totalDocsItems} документов
            </small>
        </div>
    `;

    container.innerHTML = paginationHTML;
}

function changeDocsPage(page) {
    if (page < 1 || page > totalDocsPages || page === currentDocsPage) return;
    void loadDocuments(page);
}

function changeDocsPerPage(perPage) {
    console.log('changeDocsPerPage called with:', perPage);
    docsPerPage = parseInt(perPage) || 10;
    console.log('docsPerPage set to:', docsPerPage);
    void loadDocuments(1);
}

function showLoading(show) {
    const container = document.getElementById('documentsContainer');
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

async function deleteDocument(docId, docName) {
    if (!confirm(`Вы уверены, что хотите удалить документ "${docName}"?`)) {
        return;
    }

    try {
        const headers = {
            'Content-Type': 'application/json'
        };

        const response = await fetch(`/admin/documents/${docId}/delete`, {
            method: 'DELETE',
            headers: headers
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.success) {
            showAlert(`Документ "${docName}" успешно удален.`, 'success');
            void loadDocuments(currentDocsPage || 1);
        } else {
            const errorMessage = result.message || `Ошибка удаления: ${response.status}`;
            showAlert(errorMessage, 'error');
        }

    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function openCreateDocumentModal() {
    const modalElement = document.getElementById('createDocumentModal');
    if (!modalElement) {
        console.error('Create document modal not found');
        return;
    }
    const modal = new bootstrap.Modal(modalElement);
    const form = document.getElementById('createDocumentForm');
    form.reset();

    const courseSelect = document.getElementById('docCourse');
    const categorySelect = document.getElementById('docCategory');

    // Reset and disable category select
    categorySelect.innerHTML = '<option value="">Сначала выберите курс</option>';
    categorySelect.disabled = true;

    // Load Courses
    try {
        const courseResponse = await fetch('/admin/documents/courses');
        const courseResult = await courseResponse.json();
        if (courseResult.success && courseResult.data) {
            courseSelect.innerHTML = '<option value="" disabled selected>Выберите курс</option>';
            courseResult.data.forEach(course => {
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.title;
                courseSelect.appendChild(option);
            });
        } else {
            courseSelect.innerHTML = '<option value="">Не удалось загрузить курсы</option>';
        }
    } catch (error) {
        courseSelect.innerHTML = '<option value="">Ошибка загрузки</option>';
    }

    modal.show();
}

async function handleCourseChangeForModal(courseId) {
    const categorySelect = document.getElementById('docCategory');
    if (!courseId) {
        categorySelect.innerHTML = '<option value="">Сначала выберите курс</option>';
        categorySelect.disabled = true;
        return;
    }

    categorySelect.innerHTML = '<option value="">Загрузка категорий...</option>';
    categorySelect.disabled = false;

    try {
        const response = await fetch(`/admin/documents/categories?courseId=${courseId}`);
        const result = await response.json();

        if (result.success && result.data && result.data.length > 0) {
            categorySelect.innerHTML = '<option value="" disabled selected>Выберите категорию</option>';
            result.data.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } else {
            categorySelect.innerHTML = '<option value="">Категории не найдены</option>';
        }
    } catch (error) {
        categorySelect.innerHTML = '<option value="">Ошибка загрузки категорий</option>';
    }
}

async function handleCreateDocumentSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const submitButton = form.closest('.modal-content').querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Создание...';

    try {
        const response = await fetch('/admin/documents/create', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showAlert('Документ успешно создан!', 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createDocumentModal'));
            modal.hide();
            await loadDocuments(1);
        } else {
            if (response.status === 400 && result.errors) {
                let errorMessages = Object.values(result.errors).join(', ');
                showAlert(`Ошибка валидации: ${errorMessages}`, 'error');
            } else {
                showAlert(result.message || 'Произошла ошибка при создании документа.', 'error');
            }
        }
    } catch (error) {
        showAlert('Сетевая ошибка или ошибка сервера.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Создать';
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const docsTabTrigger = document.querySelector('a[data-tab="docs-tab"]');
    if (docsTabTrigger) {
        docsTabTrigger.addEventListener('click', function () {
            setTimeout(() => loadDocuments(1), 10);
        });

        if (document.getElementById('docs-tab')?.classList.contains('active')) {
            void loadDocuments(1);
        }
    }

    const createDocumentForm = document.getElementById('createDocumentForm');
    if (createDocumentForm) {
        createDocumentForm.addEventListener('submit', handleCreateDocumentSubmit);
    }

    if (document.getElementById('docs-tab')?.classList.contains('active')) {
        void loadDocuments(1);
        void loadCoursesForFilter();
        void loadCategoriesForFilter();
    }
});

window.loadDocuments = loadDocuments;
window.changeDocsPerPage = changeDocsPerPage;
window.changeDocsPage = changeDocsPage;
window.deleteDocument = deleteDocument;
window.loadCoursesForFilter = loadCoursesForFilter;
window.loadCategoriesForFilter = loadCategoriesForFilter;
window.openCreateDocumentModal = openCreateDocumentModal;
window.handleCourseChangeForModal = handleCourseChangeForModal;
