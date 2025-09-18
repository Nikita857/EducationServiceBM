// Original content of admin.js
async function $d77ec0a144f94796$var$getOfferDescription(offerId) {
    try {
        const response = await fetch(`/admin/offers/${offerId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} HTTP: ${response.status}`);
        const offerData = await response.json();
        $d77ec0a144f94796$var$populateModal(offerData);
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u0437\u0430\u044F\u0432\u043A\u0438:", error);
        alert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0437\u0430\u044F\u0432\u043A\u0438");
    }
}
// Заполнение модального окна данными
function $d77ec0a144f94796$var$populateModal(offerData) {
    $('#offerTitle').text(`\u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440} \u{438}\u{43D}\u{444}\u{43E}\u{440}\u{43C}\u{430}\u{446}\u{438}\u{438} \u{43F}\u{43E} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{435} ${offerData.userId}`);
    $('#offerTopic').text(offerData.topic);
    $('#offerDescriptionBody').text(offerData.description);
    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('offerContentModal'));
    modal.show();
}
// Обработчик события для закрытия модального окна
document.getElementById('offerContentModal').addEventListener('hidden.bs.modal', function() {
    // Очищаем поля при закрытии
    document.getElementById('modalUserId').textContent = '';
    document.getElementById('modalTopic').textContent = '';
    document.getElementById('modalDescription').textContent = '';
});
function $d77ec0a144f94796$var$switchToView(viewType) {
    $('.view-content').addClass('d-none');
    $(`.${viewType}`).removeClass('d-none');
}
window.getOfferDescription = $d77ec0a144f94796$var$getOfferDescription;
window.switchToView = $d77ec0a144f94796$var$switchToView;


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('addCourseForm');
    const descriptionTextarea = document.getElementById('courseDescription');
    const charCount = document.getElementById('charCount');
    const uploadPlaceholder = document.getElementById('uploadPlaceholder');
    const fileInput = document.getElementById('courseImage');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImage');
    const courseTitle = document.getElementById('courseTitle');
    const courseSlug = document.getElementById('courseSlug');
    // Счетчик символов для описания
    descriptionTextarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = length;
        if (length > 1900) charCount.classList.add('text-warning');
        else charCount.classList.remove('text-warning');
    });
    // Загрузка изображения
    uploadPlaceholder.addEventListener('click', function() {
        fileInput.click();
    });
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            const file = this.files[0];
            // Проверка размера файла
            if (file.size > 5242880) {
                showAlert("\u0424\u0430\u0439\u043B \u0441\u043B\u0438\u0448\u043A\u043E\u043C \u0431\u043E\u043B\u044C\u0448\u043E\u0439. \u041C\u0430\u043A\u0441\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440: 5MB", 'error');
                this.value = '';
                return;
            }
            // Показ превью
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.querySelector('img').src = e.target.result;
                imagePreview.style.display = 'block';
                uploadPlaceholder.style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });
    // Удаление изображения
    removeImageBtn.addEventListener('click', function() {
        fileInput.value = '';
        imagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
    });
    // --- Slug Generation Logic ---
    let isSlugManuallyEdited = false;
    if (courseTitle && courseSlug) {
        // Generate slug as user types in the title field
        courseTitle.addEventListener('input', ()=>{
            if (!isSlugManuallyEdited) generateSlugFromTitle();
        });
        // Detect when user edits the slug field manually to disable auto-generation
        courseSlug.addEventListener('input', ()=>{
            isSlugManuallyEdited = true;
        });
    }
    function generateSlugFromTitle() {
        const title = courseTitle.value.trim();
        if (title) {
            const translitMap = {
                "\u0430": 'a',
                "\u0431": 'b',
                "\u0432": 'v',
                "\u0433": 'g',
                "\u0434": 'd',
                "\u0435": 'e',
                "\u0451": 'yo',
                "\u0436": 'zh',
                "\u0437": 'z',
                "\u0438": 'i',
                "\u0439": 'y',
                "\u043A": 'k',
                "\u043B": 'l',
                "\u043C": 'm',
                "\u043D": 'n',
                "\u043E": 'o',
                "\u043F": 'p',
                "\u0440": 'r',
                "\u0441": 's',
                "\u0442": 't',
                "\u0443": 'u',
                "\u0444": 'f',
                "\u0445": 'h',
                "\u0446": 'ts',
                "\u0447": 'ch',
                "\u0448": 'sh',
                "\u0449": 'shch',
                "\u044A": '',
                "\u044B": 'y',
                "\u044C": '',
                "\u044D": 'e',
                "\u044E": 'yu',
                "\u044F": 'ya'
            };
            let slug = title.toLowerCase();
            let result = '';
            for(let i = 0; i < slug.length; i++)result += translitMap[slug[i]] || slug[i];
            slug = result.replace(/['"’]/g, '') // remove quotes
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/[^a-z0-9-]/g, '') // remove invalid chars
            .replace(/-+/g, '-') // collapse dashes
            .replace(/^-|-$/g, ''); // trim - from start or end
            courseSlug.value = slug;
        }
    }
    // --- End Slug Generation Logic ---
    // Функция очистки формы
    window.resetForm = function() {
        form.reset();
        form.classList.remove('was-validated');
        charCount.textContent = '0';
        fileInput.value = '';
        imagePreview.style.display = 'none';
        uploadPlaceholder.style.display = 'block';
    };
    // --- Form Submission Logic ---
    form.addEventListener('submit', async function(event) {
        // 1. Предотвращаем стандартную отправку формы
        event.preventDefault();
        event.stopPropagation();
        // 2. Проверяем валидность формы с помощью Bootstrap
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }
        // Дополнительная проверка на наличие файла
        if (fileInput.files.length === 0) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u0438\u0437\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u0435 \u0434\u043B\u044F \u043A\u0443\u0440\u0441\u0430.", 'error');
            return;
        }
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        try {
            // 3. Показываем индикатор загрузки
            submitButton.disabled = true;
            submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> \u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435...';
            // 4. Собираем данные формы с помощью FormData
            const formData = new FormData(form);
            // 5. Отправляем данные на сервер
            const response = await fetch('/admin/course/create', {
                method: 'POST',
                body: formData
            });
            // 6. Обрабатываем ответ
            if (response.status === 201) {
                showAlert("\u041A\u0443\u0440\u0441 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D!", 'success');
                window.resetForm(); // Используем уже существующую функцию для очистки
            } else {
                const errorData = await response.json();
                const errorMessage = errorData.error || Object.values(errorData).join(', ');
                return null;
            }
        } catch (error) {
            showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${error.message}`, 'error');
        } finally{
            // 7. Возвращаем кнопку в исходное состояние
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
});


let $66325f72c8beba23$var$currentPage = 1;
let $66325f72c8beba23$var$totalPages = 1;
let $66325f72c8beba23$var$totalItems = 0;
let $66325f72c8beba23$var$coursesPerPage = 10; // Default courses per page
// --- NEW: Function to switch to the Add Course tab ---
function $66325f72c8beba23$var$openAddCourseForm() {
    const tabLink = document.querySelector('a[data-tab="courses-add-tab"]');
    if (tabLink) tabLink.click();
    else showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0432\u043A\u043B\u0430\u0434\u043A\u0443 \u0434\u043B\u044F \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043A\u0443\u0440\u0441\u0430", 'error');
}
// --- MODIFIED: Renamed for consistency ---
function $66325f72c8beba23$var$changeCoursesPerPage(perPage) {
    $66325f72c8beba23$var$coursesPerPage = parseInt(perPage) || 10;
    $66325f72c8beba23$var$loadCourses(1);
}
async function $66325f72c8beba23$var$loadCourses(page = 1) {
    try {
        const response = await fetch(`/admin/courses?page=${page}&size=${$66325f72c8beba23$var$coursesPerPage}`);
        if (!response.ok) return null;
        const data = await response.json();
        if (!data.success || !data.data || !data.data.content) return null;
        $66325f72c8beba23$var$currentPage = data.data["currentPage"] || page;
        $66325f72c8beba23$var$totalPages = data.data["totalPages"] || 1;
        $66325f72c8beba23$var$totalItems = data.data["totalItems"] || data.data.content.length;
        $66325f72c8beba23$var$renderCoursesTable(data.data.content);
        $66325f72c8beba23$var$renderPagination();
    } catch (e) {
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432} ${e}`, 'error');
    }
}
async function $66325f72c8beba23$var$deleteCourse(courseId, courseTitle) {
    if (!confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C} \u{43A}\u{443}\u{440}\u{441} "${courseTitle}"? \u{42D}\u{442}\u{43E} \u{434}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442} \u{432}\u{441}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{438} \u{443}\u{440}\u{43E}\u{43A}\u{438} \u{44D}\u{442}\u{43E}\u{433}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{430}, \u{438} \u{435}\u{433}\u{43E} \u{43D}\u{435}\u{43B}\u{44C}\u{437}\u{44F} \u{431}\u{443}\u{434}\u{435}\u{442} \u{43E}\u{442}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{44C}.`)) return null;
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const response = await fetch(`/admin/courses/${courseId}/delete`, {
            method: 'DELETE',
            headers: headers
        });
        const result = await response.json().catch(()=>({}));
        if (response.ok) {
            showAlert(`\u{41A}\u{443}\u{440}\u{441} "${courseTitle}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}!`, 'success');
            setTimeout(()=>{
                $66325f72c8beba23$var$loadCourses($66325f72c8beba23$var$currentPage || 1);
            }, 1500);
        } else return null;
    } catch (error) {
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${error.message}`, 'error');
    }
}
// --- MODIFIED: renderCoursesTable with new header ---
function $66325f72c8beba23$var$renderCoursesTable(courses) {
    const tableContainer = document.querySelector('#courses-edit-tab .card-body');
    if (!tableContainer) return;
    tableContainer.innerHTML = ''; // Clear previous content
    tableContainer.innerHTML = `
        <div class="data-table courses-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="pageSizeSelect" onchange="changeCoursesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openAddCourseForm()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{43A}\u{443}\u{440}\u{441}
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">URI</div>
                    <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}</div>
                    <div class="table-cell">\u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                ${courses.length > 0 ? courses.map((course)=>`
                <div class="table-row" id="course-row-${course.id}">
                    <div class="table-cell text-muted">#${course.id || 'N/A'}</div>
                    <div class="table-cell">
                        <img src="/img/course-brand/${course.image}" alt="\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}"
                             class="course-image" data-image-name="${course.image}" onclick="openViewCourseImageModal('${course.image}')" style="cursor: pointer">
                    </div>
                    <div class="table-cell">
                        <div class="fw-bold">${course.title || 'N/A'}</div>
                    </div>
                    <div class="table-cell">
                        <span class="course-description">${course.description || 'N/A'}</span>
                    </div>
                    <div class="table-cell">
                        <code class="click-for-redirect" style="cursor: pointer">/course/${course.slug}</code>
                    </div>
                    <div class="table-cell" data-course-id="${course.id}">
                    ${$66325f72c8beba23$var$adaptiveCourseStatus(course.status, course.id)}
                    </div>
                    <div class="table-cell text-sm text-muted">${$66325f72c8beba23$var$formatCourseDate(course["createdAt"])}</div>
                    <div class="table-cell text-sm text-muted">${$66325f72c8beba23$var$formatCourseDate(course["updatedAt"])}</div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-primary btn-icon btn-sm" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" onclick="openEditCourseModal(${course.id})">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-primary btn-icon btn-sm" title="\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438}" onclick="showCourseModules(${course.id}, '${course.title}')">
                            \u{41C}
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteCourse(${course.id}, '${course.title}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-journal-x me-2"></i>
                        \u{41A}\u{443}\u{440}\u{441}\u{44B} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                    </div>
                </div>
                `}
            </div>
        </div>

        <div class="pagination-container-edit-course mt-3"></div>
    `;
    document.getElementById('pageSizeSelect').value = $66325f72c8beba23$var$coursesPerPage;
    const dropdownToggleElements = tableContainer.querySelectorAll('[data-bs-toggle="dropdown"]');
    dropdownToggleElements.forEach((dropdownToggleEl)=>{
        new bootstrap.Dropdown(dropdownToggleEl);
    });
    // Force overflow to be visible on table cells to prevent dropdown clipping
    const tableCells = tableContainer.querySelectorAll('.table-cell');
    tableCells.forEach((cell)=>{
        cell.style.overflow = 'visible';
    });
}
function $66325f72c8beba23$var$adaptiveCourseStatus(status, courseId) {
    const statusMap = {
        'ACTIVE': {
            text: "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439",
            bg: 'success'
        },
        'INACTIVE': {
            text: "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439",
            bg: 'secondary'
        },
        'ARCHIVED': {
            text: "\u0412 \u0430\u0440\u0445\u0438\u0432\u0435",
            bg: 'dark'
        }
    };
    const currentStatusInfo = statusMap[status] || {
        text: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E",
        bg: 'light'
    };
    const dropdownItems = Object.keys(statusMap).map((s)=>{
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
async function $66325f72c8beba23$var$updateCourseStatus(courseId, currentStatusText, newStatus, newStatusText) {
    if (!confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{44C} \u{441}\u{442}\u{430}\u{442}\u{443}\u{441} \u{43A}\u{443}\u{440}\u{441}\u{430} \u{441} "${currentStatusText}" \u{43D}\u{430} "${newStatusText}"?`)) return;
    const headers = {
        'Content-Type': 'application/json'
    };
    try {
        const response = await fetch(`/admin/courses/update/status`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                courseId: courseId,
                status: newStatus
            })
        });
        const result = await response.json().catch(()=>({}));
        if (response.ok && result.success) {
            showAlert(`\u{421}\u{442}\u{430}\u{442}\u{443}\u{441} \u{43A}\u{443}\u{440}\u{441}\u{430} \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{435}\u{43D} \u{43D}\u{430} "${newStatusText}"!`, 'success');
            await $66325f72c8beba23$var$loadCourses($66325f72c8beba23$var$currentPage);
        } else {
            const errorMessage = result.error || `\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.status}`;
            throw new Error(errorMessage);
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
function $66325f72c8beba23$var$renderPagination() {
    const paginationContainer = document.querySelector('.pagination-container-edit-course');
    if (!paginationContainer) return;
    if ($66325f72c8beba23$var$totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${$66325f72c8beba23$var$currentPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${$66325f72c8beba23$var$currentPage - 1}); return false;">&laquo;</a>
                </li>
    `;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, $66325f72c8beba23$var$currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min($66325f72c8beba23$var$totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1); return false;">1</a></li>`;
        if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    for(let i = startPage; i <= endPage; i++)paginationHTML += `<li class="page-item ${i === $66325f72c8beba23$var$currentPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a></li>`;
    if (endPage < $66325f72c8beba23$var$totalPages) {
        if (endPage < $66325f72c8beba23$var$totalPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${$66325f72c8beba23$var$totalPages}); return false;">${$66325f72c8beba23$var$totalPages}</a></li>`;
    }
    paginationHTML += `
                <li class="page-item ${$66325f72c8beba23$var$currentPage === $66325f72c8beba23$var$totalPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${$66325f72c8beba23$var$currentPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">\u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${$66325f72c8beba23$var$currentPage} \u{438}\u{437} ${$66325f72c8beba23$var$totalPages} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}: ${$66325f72c8beba23$var$totalItems}</small>
        </div>
    `;
    paginationContainer.innerHTML = paginationHTML;
}
function $66325f72c8beba23$var$changePage(page) {
    if (page < 1 || page > $66325f72c8beba23$var$totalPages || page === $66325f72c8beba23$var$currentPage) return;
    $66325f72c8beba23$var$loadCourses(page);
}
function $66325f72c8beba23$var$formatCourseDate(dateString) {
    if (!dateString) return "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E";
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
function $66325f72c8beba23$var$openViewCourseImageModal(img) {
    if (!document.getElementById('viewImageModal')) $66325f72c8beba23$var$renderImageViewModal();
    const modalImg = document.getElementById('modalImgCourse');
    if (modalImg) {
        modalImg.src = `/img/course-brand/${img}`;
        modalImg.alt = `\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${img}`;
    }
    const modalElement = document.getElementById('viewImageModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}
function $66325f72c8beba23$var$renderImageViewModal() {
    if (!document.getElementById('viewImageModal')) document.getElementById('img-view-modal').innerHTML += `
            <div class="modal fade" id="viewImageModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img id="modalImgCourse" class="img-fluid" style="max-height: 70vh; object-fit: contain;">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
}
document.addEventListener('DOMContentLoaded', function() {
    const coursesTabTrigger = document.querySelector('a[data-tab="courses-edit-tab"]');
    const coursesContainer = document.getElementById('courses-edit-tab');
    if (coursesContainer) coursesContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('click-for-redirect')) {
            const url = event.target.textContent.trim();
            if (url) window.location.href = url;
        }
    });
    if (coursesTabTrigger) {
        let isInitialized = false;
        coursesTabTrigger.addEventListener('click', ()=>{
            if (!isInitialized) {
                $66325f72c8beba23$var$loadCourses(1);
                $66325f72c8beba23$var$renderImageViewModal();
                $66325f72c8beba23$var$renderEditCourseModal(); // Render the edit modal structure on tab click
                isInitialized = true;
            }
        });
        if (document.getElementById('courses-edit-tab')?.classList.contains('active')) {
            $66325f72c8beba23$var$loadCourses(1);
            $66325f72c8beba23$var$renderImageViewModal();
            $66325f72c8beba23$var$renderEditCourseModal(); // Also render here if the tab is already active
            isInitialized = true;
        }
    }
});
// --- NEW: Functions for Edit Course Modal ---
function $66325f72c8beba23$var$renderEditCourseModal() {
    if (document.getElementById('editCourseModal')) return; // Already rendered
    const modalHTML = `
        <div class="modal fade" id="editCourseModal" tabindex="-1" aria-labelledby="editCourseModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editCourseModalLabel">\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{43A}\u{443}\u{440}\u{441}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form id="editCourseForm" onsubmit="handleCourseUpdate(event)">
                            <input type="hidden" id="editCourseId" name="id">
                            
                            <div class="mb-3">
                                <label for="editCourseTitle" class="form-label">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</label>
                                <input type="text" class="form-control" id="editCourseTitle" name="title" required minlength="2" maxlength="100">
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseDescription" class="form-label">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</label>
                                <textarea class="form-control" id="editCourseDescription" name="description" rows="3" required minlength="2" maxlength="100"></textarea>
                            </div>
                            
                            <div class="mb-3">
                                <label for="editCourseSlug" class="form-label">URI (Slug)</label>
                                <input type="text" class="form-control" id="editCourseSlug" name="slug" required minlength="2" maxlength="100">
                            </div>

                            <div class="mb-3">
                                <label for="editCourseImage" class="form-label">\u{418}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{430}</label>
                                <input class="form-control" type="file" id="editCourseImage" name="image" accept="image/png, image/jpeg, image/gif">
                                <div class="mt-2">
                                    <small class="text-muted">\u{422}\u{435}\u{43A}\u{443}\u{449}\u{435}\u{435} \u{438}\u{437}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{435}\u{43D}\u{438}\u{435}:</small>
                                    <img id="currentCourseImage" src="" alt="Current Image" class="img-thumbnail mt-1" style="max-width: 150px;">
                                </div>
                            </div>
                            
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{41E}\u{442}\u{43C}\u{435}\u{43D}\u{430}</button>
                                <button type="submit" class="btn btn-primary">\u{421}\u{43E}\u{445}\u{440}\u{430}\u{43D}\u{438}\u{442}\u{44C} \u{438}\u{437}\u{43C}\u{435}\u{43D}\u{435}\u{43D}\u{438}\u{44F}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}
async function $66325f72c8beba23$var$openEditCourseModal(courseId) {
    const modalElement = document.getElementById('editCourseModal');
    if (!modalElement) return;
    const courseRow = document.getElementById(`course-row-${courseId}`);
    if (!courseRow) {
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u0434\u043B\u044F \u043A\u0443\u0440\u0441\u0430.", 'error');
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
async function $66325f72c8beba23$var$handleCourseUpdate(event) {
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
        const result = await response.json().catch(()=>({}));
        if (response.ok && result.success) {
            showAlert(`\u{41A}\u{443}\u{440}\u{441} "${courseTitle}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}!`, 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editCourseModal'));
            modal.hide();
            $66325f72c8beba23$var$loadCourses($66325f72c8beba23$var$currentPage); // Refresh the table
        } else {
            // Prefer a server-sent message, otherwise use a generic one.
            const errorMessage = result.error || `\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.status}`;
            return null;
        }
    } catch (error) {
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${error.message}`, 'error');
    }
}
window.openAddCourseForm = $66325f72c8beba23$var$openAddCourseForm;
window.changeCoursesPerPage = $66325f72c8beba23$var$changeCoursesPerPage;
window.deleteCourse = $66325f72c8beba23$var$deleteCourse;
window.changePage = $66325f72c8beba23$var$changePage;
window.openViewCourseImageModal = $66325f72c8beba23$var$openViewCourseImageModal;
window.openEditCourseModal = $66325f72c8beba23$var$openEditCourseModal;
window.handleCourseUpdate = $66325f72c8beba23$var$handleCourseUpdate;
window.updateCourseStatus = $66325f72c8beba23$var$updateCourseStatus;
window.loadCourses = $66325f72c8beba23$var$loadCourses;


// Глобальные переменные
let $ea3469519dc583db$var$currentCourse = null;
let $ea3469519dc583db$var$courseModules = [];
// Функция открытия модального окна с модулями курса
async function $ea3469519dc583db$var$openCourseModulesModal(courseId) {
    try {
        // Загружаем модули курса
        const response = await fetch(`/admin/courses/${courseId}/modules`);
        if (!response.ok) {
            if (response.status === 404) showAlert("\u0412 \u044D\u0442\u043E\u043C \u043C\u043E\u0434\u0443\u043B\u0435 \u043D\u0435\u0442 \u043A\u0443\u0440\u0441\u043E\u0432", 'info');
            else showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043C\u043E\u0434\u0443\u043B\u0435\u0439 \u043A\u0443\u0440\u0441\u0430", 'error');
            return;
        }
        const data = await response.json();
        if (!data.success || !Array.isArray(data.data)) {
            showAlert(data.message || "\u041C\u043E\u0434\u0443\u043B\u0435\u0439 \u043D\u0435\u0442", 'info');
            $ea3469519dc583db$var$courseModules = []; // Устанавливаем пустой массив, если данные неверны
            $ea3469519dc583db$var$currentCourse = {
                id: courseId,
                name: "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u043A\u0443\u0440\u0441"
            }; // Устанавливаем дефолтное имя
            return; // Выходим из функции, так как нет данных
        }
        $ea3469519dc583db$var$courseModules = data.data || []; // Теперь data.data - это сам массив модулей
        // Проверяем, что courseModules не пустой, прежде чем обращаться к первому элементу
        $ea3469519dc583db$var$currentCourse = {
            id: courseId,
            name: $ea3469519dc583db$var$courseModules.length > 0 ? $ea3469519dc583db$var$courseModules[0]["courseName"] : "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u044B\u0439 \u043A\u0443\u0440\u0441"
        };
        // Рендерим модальное окно
        $ea3469519dc583db$var$renderCourseModulesModal();
        // Показываем модальное окно
        const modalElement = document.getElementById('courseModulesModal');
        if (!modalElement) return null;
        const modal = new bootstrap.Modal(modalElement);
        // noinspection JSUnresolvedReference
        modal.show();
    } catch (error) {}
}
// Функция рендеринга модального окна
function $ea3469519dc583db$var$renderCourseModulesModal() {
    const modalContainer = document.getElementById('courseModulesModal');
    if (!modalContainer) {
        // Создаем модальное окно если его нет
        $ea3469519dc583db$var$createModulesModalElement();
        return;
    }
    // Заполняем заголовок
    const modalTitle = modalContainer.querySelector('.modal-title');
    if (modalTitle) modalTitle.textContent = `\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${$ea3469519dc583db$var$currentCourse.name}`;
    if ($ea3469519dc583db$var$courseModules.length > 0) document.getElementById('modulesCount').innerText = `\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: ${$ea3469519dc583db$var$courseModules.length}`;
    // Заполняем список модулей
    const modulesList = modalContainer.querySelector('#modulesList');
    if (modulesList) modulesList.innerHTML = $ea3469519dc583db$var$courseModules.length > 0 ? $ea3469519dc583db$var$renderModulesList() : '<div class="text-center py-4 text-muted">\u041C\u043E\u0434\u0443\u043B\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u044B</div>';
}
// Функция рендеринга списка модулей
function $ea3469519dc583db$var$renderModulesList() {
    return $ea3469519dc583db$var$courseModules.map((module, index)=>`
        <div class="module-item" data-module-id="${module.moduleId}">
            <div class="module-header d-flex justify-content-between align-items-center">
                <div class="module-info">
                    <h6 class="module-title mb-1">${module.order || index + 1}. ${$ea3469519dc583db$var$escapeHtml(module["moduleTitle"] || "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F")}</h6>
                    <small class="text-muted">ID: ${module.moduleId} \u{2022} ${module["lessonsCount"] || 0} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}</small>
                </div>
                <div class="module-actions">
                    <button class="btn btn-sm btn-outline-primary me-1" onclick="editModule(${module.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <a class="btn btn-sm btn-outline-danger" href="/admin/modules">
                        <i class="fas fa-trash"></i>
                    </a>
                </div>
            </div>
            <hr class="my-2">
        </div>
    `).join('');
}
// Функция создания элемента модального окна
function $ea3469519dc583db$var$createModulesModalElement() {
    const modalHTML = `
        <div class="modal fade" id="courseModulesModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43A}\u{443}\u{440}\u{441}\u{430}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="text-muted" id="modulesCount">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: 0</span>
                            <a class="btn btn-success btn-sm" href="/admin/modules">
                                <i class="fas fa-plus me-1"></i> \u{414}\u{43E}\u{431}\u{430}\u{432}\u{438}\u{442}\u{44C} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}
                            </a>
                        </div>
                        
                        <div id="modulesList" class="modules-list">
                            <div class="text-center py-4 text-muted">
                                <i class="fas fa-spinner fa-spin me-2"></i>
                                \u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}...
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        <button type="button" class="btn btn-primary" onclick="manageCourse(${$ea3469519dc583db$var$currentCourse?.id})">
                            \u{423}\u{43F}\u{440}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{435} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{43C}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    // Добавляем модальное окно в body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    $ea3469519dc583db$var$renderCourseModulesModal();
}
// Вспомогательные функции
function $ea3469519dc583db$var$escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function $ea3469519dc583db$var$formatDate(dateString) {
    if (!dateString) return "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E";
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    } catch (e) {
        return dateString;
    }
}
// Функции действий (заглушки)
function $ea3469519dc583db$var$addNewModule() {
    alert(`\u{414}\u{43E}\u{431}\u{430}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F} \u{434}\u{43B}\u{44F} \u{43A}\u{443}\u{440}\u{441}\u{430}: ${$ea3469519dc583db$var$currentCourse?.name}`);
}
function $ea3469519dc583db$var$editModule(moduleId) {
    showAlert(`\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{43D}\u{438}\u{435} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}: ${moduleId}`, 'info');
}
function $ea3469519dc583db$var$manageCourse(courseId) {
    // Переход на страницу управления курсом
    window.location.href = `/admin/courses/${courseId}/edit`;
}
// Обновляем функцию в основном скрипте для вызова модального окна
function $ea3469519dc583db$var$showCourseModules(courseId, courseName) {
    $ea3469519dc583db$var$openCourseModulesModal(courseId, courseName);
}
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обработчик для закрытия модального окна
    document.addEventListener('hidden.bs.modal', function(event) {
        if (event.target.id === 'courseModulesModal') {
            // Очищаем данные при закрытии
            $ea3469519dc583db$var$currentCourse = null;
            $ea3469519dc583db$var$courseModules = [];
        }
    });
});
window.addNewModule = $ea3469519dc583db$var$addNewModule;
window.editModule = $ea3469519dc583db$var$editModule;
window.manageCourse = $ea3469519dc583db$var$manageCourse;
window.showCourseModules = $ea3469519dc583db$var$showCourseModules;


document.addEventListener('DOMContentLoaded', function() {
    const editLessonModal = new bootstrap.Modal(document.getElementById('editLessonModal'));
    const editLessonForm = document.getElementById('editLessonForm');
    // Инициализация TinyMCE
    function initTinyMCE(content = '') {
        tinymce.remove('#editLessonTextContent'); // Удаляем предыдущий инстанс, если он был
        tinymce.init({
            selector: '#editLessonTextContent',
            plugins: 'code table lists image link',
            toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright | indent outdent | bullist numlist | code | image | link',
            height: 400,
            setup: function(editor) {
                editor.on('init', function() {
                    editor.setContent(content);
                });
            }
        });
    }
    // Глобальный обработчик кликов для делегирования событий
    document.body.addEventListener('click', async function(event) {
        const editButton = event.target.closest('.edit-lesson-btn');
        if (editButton) {
            const lessonId = editButton.dataset.lessonId;
            if (!lessonId) return;
            // 1. Получаем данные урока с бэкенда
            try {
                const response = await fetch(`/api/admin/lessons/${lessonId}`);
                const result = await response.json();
                if (!response.ok || !result.success) {
                    const errorMsg = result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u0443\u0440\u043E\u043A\u0430.";
                    showAlert(errorMsg, 'error');
                    return;
                }
                const lessonData = result.data; // Data is in result.data
                // 2. Заполняем форму
                document.getElementById('editLessonId').value = lessonId;
                document.getElementById('editLessonTitle').value = lessonData.title;
                document.getElementById('editLessonVideoUrl').value = lessonData.videoUrl;
                // 3. Инициализируем TinyMCE с контентом
                initTinyMCE(lessonData.textContent || '');
                // 4. Показываем модальное окно
                editLessonModal.show();
            } catch (error) {
                showAlert(error.message, 'error');
            }
        }
    });
    // Обработчик отправки формы
    editLessonForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const lessonId = document.getElementById('editLessonId').value;
        const title = document.getElementById('editLessonTitle').value;
        const videoUrl = document.getElementById('editLessonVideoUrl').value;
        const textContent = tinymce.get('editLessonTextContent').getContent();
        const lessonDto = {
            title: title,
            videoUrl: videoUrl,
            textContent: textContent
        };
        try {
            const response = await fetch(`/api/admin/lessons/${lessonId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(lessonDto)
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                const errorMessage = result.message || "\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438.";
                throw new Error(errorMessage);
            }
            // Успех
            editLessonModal.hide();
            showAlert(result.message || "\u0423\u0440\u043E\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D!", 'success');
            // Обновляем таблицу уроков, чтобы увидеть изменения
            if (typeof loadLessons === 'function') loadLessons();
        } catch (error) {
            showAlert(error.message, 'error');
        }
    });
});


// Глобальные переменные
let $170d888c93e98c7c$var$modulesList = [];
// Инициализация формы
function $170d888c93e98c7c$var$initCreateLessonForm() {
    $170d888c93e98c7c$var$loadModules();
    $170d888c93e98c7c$var$bindFormEvents();
}
// Загрузка списка модулей
async function $170d888c93e98c7c$var$loadModules() {
    try {
        const response = await fetch('/admin/modules/json');
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                $170d888c93e98c7c$var$modulesList = data.data;
                $170d888c93e98c7c$var$populateModulesSelect();
            }
        }
    } catch (error) {
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u043C\u043E\u0434\u0443\u043B\u0435\u0439", 'error');
    }
}
// Заполнение select модулей
function $170d888c93e98c7c$var$populateModulesSelect() {
    const select = document.getElementById('moduleId');
    select.innerHTML = '<option value="">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043C\u043E\u0434\u0443\u043B\u044C</option>';
    $170d888c93e98c7c$var$modulesList.forEach((module)=>{
        const option = document.createElement('option');
        option.value = module.moduleId;
        if (module.moduleStatus === "ACTIVE") option.textContent = `(\u{41A}\u{443}\u{440}\u{441}: ${module.courseName}) \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}: ${module.moduleTitle}`;
        else {
            option.textContent = `\u{41D}\u{415}\u{410}\u{41A}\u{422}\u{418}\u{412}\u{415}\u{41D} (\u{41A}\u{443}\u{440}\u{441}: ${module.courseName}) \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}: ${module.moduleTitle}`;
            option.disabled = true;
        }
        select.appendChild(option);
    });
}
// Привязка событий формы
function $170d888c93e98c7c$var$bindFormEvents() {
    const submitBtn = document.getElementById('submitLessonBtn');
    const form = document.getElementById('createLessonForm');
    if (submitBtn) submitBtn.addEventListener('click', $170d888c93e98c7c$var$handleLessonSubmit);
    if (form) form.addEventListener('submit', function(e) {
        e.preventDefault();
        $170d888c93e98c7c$var$handleLessonSubmit();
    });
    // Очистка формы при закрытии модального окна
    const modal = document.getElementById('createLessonModal');
    if (modal) modal.addEventListener('hidden.bs.modal', $170d888c93e98c7c$var$resetForm);
}
// Обработчик отправки формы
async function $170d888c93e98c7c$var$handleLessonSubmit() {
    if (!$170d888c93e98c7c$var$validateLessonForm()) return;
    try {
        $170d888c93e98c7c$var$showLoading(true);
        const formData = new FormData();
        formData.append('file', document.getElementById('videoFile').files[0]);
        formData.append('moduleId', document.getElementById('moduleId').value);
        formData.append('title', document.getElementById('lessonTitle').value);
        formData.append('description', document.getElementById('description').value);
        formData.append('shortDescription', document.getElementById('shortDescription').value);
        formData.append('testCode', document.getElementById('testCode').value);
        const response = await fetch('/admin/lesson/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (response.ok) $170d888c93e98c7c$var$handleSuccessResponse(result);
        else $170d888c93e98c7c$var$handleErrorResponse(result);
    } catch (error) {
        showAlert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u0443\u0440\u043E\u043A\u0430", 'error');
    } finally{
        $170d888c93e98c7c$var$showLoading(false);
    }
}
// Валидация формы
function $170d888c93e98c7c$var$validateLessonForm() {
    const form = document.getElementById('createLessonForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return false;
    }
    // Проверка размера файла (максимум 500MB)
    const fileInput = document.getElementById('videoFile');
    if (fileInput.files[0] && fileInput.files[0].size > 209715200) {
        showAlert("\u0420\u0430\u0437\u043C\u0435\u0440 \u0444\u0430\u0439\u043B\u0430 \u043D\u0435 \u0434\u043E\u043B\u0436\u0435\u043D \u043F\u0440\u0435\u0432\u044B\u0448\u0430\u0442\u044C 200MB", 'error');
        return false;
    }
    return true;
}
// Обработка успешного ответа
function $170d888c93e98c7c$var$handleSuccessResponse(result) {
    showAlert("\u0423\u0440\u043E\u043A \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D!", 'success');
    // Закрываем модальное окно
    const modal = bootstrap.Modal.getInstance(document.getElementById('createLessonModal'));
    modal.hide();
    loadLessons();
}
// Обработка ошибки
function $170d888c93e98c7c$var$handleErrorResponse(result) {
    const errorMessage = result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C \u0443\u0440\u043E\u043A";
    showAlert(errorMessage, 'error');
    // Дополнительная обработка специфических ошибок
    if (result.message && result.message.includes('file')) $170d888c93e98c7c$var$highlightFileInput();
}
// Сброс формы
function $170d888c93e98c7c$var$resetForm() {
    document.getElementById('createLessonForm').reset();
    $170d888c93e98c7c$var$removeValidationStyles();
}
// Удаление стилей валидации
function $170d888c93e98c7c$var$removeValidationStyles() {
    const inputs = document.querySelectorAll('#createLessonForm .is-invalid');
    inputs.forEach((input)=>{
        input.classList.remove('is-invalid');
    });
}
// Подсветка поля файла
function $170d888c93e98c7c$var$highlightFileInput() {
    const fileInput = document.getElementById('videoFile');
    fileInput.classList.add('is-invalid');
}
// Показать/скрыть загрузку
function $170d888c93e98c7c$var$showLoading(show) {
    const submitBtn = document.getElementById('submitLessonBtn');
    if (submitBtn) {
        if (show) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> \u0421\u043E\u0437\u0434\u0430\u043D\u0438\u0435...';
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-plus me-1"></i> \u0421\u043E\u0437\u0434\u0430\u0442\u044C \u0443\u0440\u043E\u043A';
        }
    }
}
// Функция для открытия модального окна
function $170d888c93e98c7c$var$openCreateLessonModal() {
    // Загружаем модули если еще не загружены
    if ($170d888c93e98c7c$var$modulesList.length === 0) $170d888c93e98c7c$var$loadModules();
    const modal = new bootstrap.Modal(document.getElementById('createLessonModal'));
    modal.show();
}
// Инициализация при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    $170d888c93e98c7c$var$initCreateLessonForm();
    // Добавляем кнопку открытия модального окна если нужно
    const addButton = document.querySelector('[onclick="openCreateLessonModal()"]');
    if (addButton) addButton.addEventListener('click', $170d888c93e98c7c$var$openCreateLessonModal);
});
// CSS стили для формы
const $170d888c93e98c7c$var$formStyles = `
#createLessonModal .modal-content {
    background: var(--card-bg);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-header {
    background: var(--primary-gradient);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

#createLessonModal .modal-title {
    color: white;
    font-weight: 600;
}

#createLessonModal .form-select {
    background-color: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
    color: #e2e8f0;
}

#createLessonModal .form-select option {
    background-color: var(--card-bg);
    color: #e2e8f0;
}

#createLessonModal .form-control:focus,
#createLessonModal .form-select:focus {
    background: rgba(255, 255, 255, 0.12);
    border-color: #6366f1;
    box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
    color: #e2e8f0;
}

#createLessonModal .is-invalid {
    border-color: #ef4444 !important;
}

#createLessonModal .form-text {
    color: #94a3b8;
    font-size: 0.875rem;
}
`;
// Добавляем стили в документ
const $170d888c93e98c7c$var$styleSheet = document.createElement('style');
$170d888c93e98c7c$var$styleSheet.textContent = $170d888c93e98c7c$var$formStyles;
document.head.appendChild($170d888c93e98c7c$var$styleSheet);
window.openCreateLessonModal = $170d888c93e98c7c$var$openCreateLessonModal;


document.addEventListener('DOMContentLoaded', function() {
    const testGeneratorTab = document.getElementById('create-lesson-test-tab');
    // Если на странице нет вкладки генератора тестов, ничего не делаем.
    if (!testGeneratorTab) return;
    const questionsContainer = testGeneratorTab.querySelector('#questionsContainer');
    const testGeneratorForm = testGeneratorTab.querySelector('#testGeneratorForm');
    let questionCounter = 0;
    function createQuestionNode(questionIndex) {
        const questionId = `question-${questionIndex}`;
        const node = document.createElement('div');
        node.className = 'card bg-dark border-secondary mb-4 question-card';
        node.id = questionId;
        node.innerHTML = `
            <div class="card-header d-flex justify-content-between align-items-center">
                <h6 class="mb-0">\u{412}\u{43E}\u{43F}\u{440}\u{43E}\u{441} <span class="question-number">${questionIndex + 1}</span></h6>
                <button type="button" class="btn btn-outline-danger btn-sm remove-question-btn">
                    <i class="bi bi-trash"></i> \u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}
                </button>
            </div>
            <div class="card-body">
                <div class="mb-3">
                    <label for="${questionId}-text" class="form-label">\u{422}\u{435}\u{43A}\u{441}\u{442} \u{432}\u{43E}\u{43F}\u{440}\u{43E}\u{441}\u{430}:</label>
                    <input type="text" id="${questionId}-text" class="form-control question-text" placeholder="\u{412}\u{432}\u{435}\u{434}\u{438}\u{442}\u{435} \u{442}\u{435}\u{43A}\u{441}\u{442} \u{432}\u{43E}\u{43F}\u{440}\u{43E}\u{441}\u{430}" required>
                </div>
                <div class="answers-container">
                    <label class="form-label">\u{412}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442}\u{44B} \u{43E}\u{442}\u{432}\u{435}\u{442}\u{43E}\u{432} (\u{43E}\u{442}\u{43C}\u{435}\u{442}\u{44C}\u{442}\u{435} \u{43F}\u{440}\u{430}\u{432}\u{438}\u{43B}\u{44C}\u{43D}\u{44B}\u{439}):</label>
                    ${[
            0,
            1,
            2
        ].map((answerIndex)=>`
                        <div class="input-group mb-2">
                            <input type="text" class="form-control answer-text" placeholder="\u{412}\u{430}\u{440}\u{438}\u{430}\u{43D}\u{442} \u{43E}\u{442}\u{432}\u{435}\u{442}\u{430} ${answerIndex + 1}" required>
                            <div class="input-group-text">
                                <input class="form-check-input correct-answer-radio" type="radio" name="${questionId}-correct" value="${answerIndex}" required>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        node.querySelector('.remove-question-btn').addEventListener('click', function() {
            node.remove();
            updateQuestionNumbers();
        });
        return node;
    }
    function updateQuestionNumbers() {
        const allQuestions = questionsContainer.querySelectorAll('.question-card');
        allQuestions.forEach((question, index)=>{
            question.querySelector('.question-number').textContent = index + 1;
        });
    }
    function addNewQuestion() {
        const newNode = createQuestionNode(questionCounter);
        questionsContainer.appendChild(newNode);
        questionCounter++;
        updateQuestionNumbers();
    }
    // --- ИСПРАВЛЕНИЕ: Используем делегирование событий ---
    testGeneratorTab.addEventListener('click', function(event) {
        // Проверяем, был ли клик по кнопке "Добавить вопрос"
        if (event.target && event.target.id === 'addQuestionBtn') addNewQuestion();
    });
    if (testGeneratorForm) testGeneratorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        generateTestCode();
    });
    function generateTestCode() {
        const questionCards = questionsContainer.querySelectorAll('.question-card');
        const generatedQuestions = [];
        let isValid = true;
        if (questionCards.length === 0) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0445\u043E\u0442\u044F \u0431\u044B \u043E\u0434\u0438\u043D \u0432\u043E\u043F\u0440\u043E\u0441.", 'info');
            return;
        }
        questionCards.forEach((card)=>{
            const questionText = card.querySelector('.question-text').value;
            const answerInputs = card.querySelectorAll('.answer-text');
            const correctAnswerRadio = card.querySelector('.correct-answer-radio:checked');
            if (!questionText || !correctAnswerRadio) isValid = false;
            const answers = [];
            answerInputs.forEach((input, answerIndex)=>{
                if (!input.value) isValid = false;
                answers.push({
                    text: input.value,
                    correct: answerIndex === parseInt(correctAnswerRadio.value)
                });
            });
            generatedQuestions.push({
                question: questionText,
                answers: answers
            });
        });
        if (!isValid) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0437\u0430\u043F\u043E\u043B\u043D\u0438\u0442\u0435 \u0432\u0441\u0435 \u0442\u0435\u043A\u0441\u0442\u043E\u0432\u044B\u0435 \u043F\u043E\u043B\u044F \u0438 \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u0434\u043B\u044F \u043A\u0430\u0436\u0434\u043E\u0433\u043E \u0432\u043E\u043F\u0440\u043E\u0441\u0430.", 'info');
            return;
        }
        const code = `const questions = [\n${generatedQuestions.map((q)=>`    {\n        question: "${q.question.replace(new RegExp('"', 'g'), '\\"')}",\n        answers: [\n${q.answers.map((a)=>`            { text: "${a.text.replace(new RegExp('"', 'g'), '\\"')}", correct: ${a.correct} }`).join(',\n')}\n        ]\n    }`).join(',\n')}\n];`;
        document.getElementById('generatedCode').textContent = code;
        document.getElementById('resultContainer').style.display = 'block';
        window.generatedCodeForCopy = code;
    }
    // Добавляем первый вопрос только один раз, когда вкладка становится видимой
    const tabObserver = new MutationObserver((mutations)=>{
        mutations.forEach((mutation)=>{
            if (mutation.attributeName === 'class' && testGeneratorTab.classList.contains('active')) // Если контейнер пуст, добавляем первый вопрос
            {
                if (questionsContainer.children.length === 0) addNewQuestion();
            }
        });
    });
    tabObserver.observe(testGeneratorTab, {
        attributes: true
    });
});
function $d83786d028e31164$var$copyToClipboard() {
    if (!window.generatedCodeForCopy) return;
    navigator.clipboard.writeText(window.generatedCodeForCopy).then(()=>{
        showAlert("\u041A\u043E\u0434 \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D \u0432 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430!", 'success');
    }).catch((err)=>{
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043A\u043E\u0434", 'error');
    });
}
window.copyToClipboard = $d83786d028e31164$var$copyToClipboard;


// lessonsTable.js
let $e6b8b4a6c2ccedee$var$currentLessonsPage = 1;
let $e6b8b4a6c2ccedee$var$totalLessonsPages = 1;
let $e6b8b4a6c2ccedee$var$totalLessonsItems = 0;
let $e6b8b4a6c2ccedee$var$lessonsPerPage = 5;
// --- NEW: Function to load modules for the filter dropdown ---
async function $e6b8b4a6c2ccedee$var$loadModulesForFilter() {
    try {
        const response = await fetch('/admin/modules/json');
        if (!response.ok) return null;
        const data = await response.json();
        if (data.success && data.data) {
            const select = document.getElementById('moduleFilterSelect');
            if (!select) return;
            // Save selected value if it exists
            const currentFilter = select.value;
            select.innerHTML = '<option value="">\u0412\u0441\u0435 \u043C\u043E\u0434\u0443\u043B\u0438</option>'; // Reset and add default option
            data.data.forEach((module)=>{
                const option = document.createElement('option');
                option.value = module.moduleId;
                option.textContent = `${module["moduleTitle"]}`;
                select.appendChild(option);
            });
            // Restore selected value
            if (currentFilter) select.value = currentFilter;
        } else return null;
    } catch (error) {
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440 \u043C\u043E\u0434\u0443\u043B\u0435\u0439.", 'warning');
    }
}
// --- MODIFIED: Load lessons with filtering capability ---
async function $e6b8b4a6c2ccedee$var$loadLessons(page = 1) {
    try {
        $e6b8b4a6c2ccedee$var$showLoading(true);
        const moduleId = document.getElementById('moduleFilterSelect')?.value || '';
        let url = `/admin/lessons?page=${page}&size=${$e6b8b4a6c2ccedee$var$lessonsPerPage}`;
        if (moduleId) url += `&moduleId=${moduleId}`;
        const response = await fetch(url);
        if (response.ok) {
            const result = await response.json();
            if (result.success && result.data) {
                const paginatedData = result.data;
                $e6b8b4a6c2ccedee$var$currentLessonsPage = paginatedData.currentPage || page;
                $e6b8b4a6c2ccedee$var$totalLessonsPages = paginatedData.totalPages || 1;
                $e6b8b4a6c2ccedee$var$totalLessonsItems = paginatedData.totalItems || 0;
                $e6b8b4a6c2ccedee$var$renderLessonsTable(paginatedData.content);
                $e6b8b4a6c2ccedee$var$renderLessonsPagination(paginatedData.content);
            } else showAlert(result.message || "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u043D\u044B\u0445", 'error');
        } else {
            // Handle cases like 404 when no lessons are found for a filter
            if (response.status === 404) {
                $e6b8b4a6c2ccedee$var$renderLessonsTable([]);
                $e6b8b4a6c2ccedee$var$renderLessonsPagination([]);
            } else return null;
        }
    } catch (error) {
        showAlert(error.message, 'error');
    } finally{
        $e6b8b4a6c2ccedee$var$showLoading(false);
    }
}
// --- MODIFIED: Render lessons table with filter dropdown ---
function $e6b8b4a6c2ccedee$var$renderLessonsTable(lessons) {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;
    container.innerHTML = '';
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'courses-table-container';
    tableWrapper.innerHTML = `
        <div class="data-table courses-table lessons-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}</h3>
                <div class="d-flex align-items-center gap-2 flex-wrap">
                    <!-- NEW: Module Filter -->
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="moduleFilterSelect" onchange="loadLessons(1)">
                            <option value="">\u{424}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{43F}\u{43E} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44E}...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="lessonsPageSizeSelect" onchange="changeLessonsPerPage(this.value)">
                                <option value="5" ${$e6b8b4a6c2ccedee$var$lessonsPerPage === 5 ? 'selected' : ''}>5</option>
                                <option value="10" ${$e6b8b4a6c2ccedee$var$lessonsPerPage === 10 ? 'selected' : ''}>10</option>
                                <option value="20" ${$e6b8b4a6c2ccedee$var$lessonsPerPage === 20 ? 'selected' : ''}>20</option>
                                <option value="50" ${$e6b8b4a6c2ccedee$var$lessonsPerPage === 50 ? 'selected' : ''}>50</option>
                            </select>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="openCreateLessonModal()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A}
                    </button>
                </div>
            </div>

            <div class="table-content">
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{412}\u{438}\u{434}\u{435}\u{43E}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                ${lessons.length > 0 ? lessons.map((lesson)=>`
                <div class="table-row">
                    <div class="table-cell text-muted">#${lesson.id || 'N/A'}</div>
                    <div class="table-cell">
                        <div class="fw-bold">${$e6b8b4a6c2ccedee$var$escapeHtml(lesson.title || "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F")}</div>
                    </div>
                    <div class="table-cell">
                        <span class="text-muted">${$e6b8b4a6c2ccedee$var$escapeHtml(lesson["moduleName"] || 'N/A')}</span>
                    </div>
                    <div class="table-cell">
                        <span class="lesson-description">${$e6b8b4a6c2ccedee$var$truncateText(lesson.description || "\u041D\u0435\u0442 \u043E\u043F\u0438\u0441\u0430\u043D\u0438\u044F", 100)}</span>
                    </div>
                    <div class="table-cell">
                        ${lesson.video ? `
                            <a href="/admin/video/${lesson.video}" class="text-primary text-decoration-none">
                                <i class="bi bi-camera-video me-1"></i> \u{421}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{442}\u{44C}
                            </a>
                        ` : '<span class="text-muted">\u041D\u0435\u0442 \u0432\u0438\u0434\u0435\u043E</span>'}
                    </div>
                    <div class="table-cell action-buttons">
                        <button class="btn btn-info btn-icon btn-sm edit-lesson-btn" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" data-lesson-id="${lesson.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}"
                                onclick="deleteLesson(${lesson.id}, '${$e6b8b4a6c2ccedee$var$escapeHtml(lesson.title)}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row">
                    <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                        <i class="bi bi-book-open me-2"></i>
                        \u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}. \u{418}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{435} \u{444}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{438}\u{43B}\u{438} \u{434}\u{43E}\u{431}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{43D}\u{43E}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A}.
                    </div>
                </div>
                `}
            </div>
        </div>
    `;
    container.appendChild(tableWrapper);
    // --- NEW: Populate the filter after rendering the table structure ---
    $e6b8b4a6c2ccedee$var$loadModulesForFilter();
}
// Рендер пагинации
function $e6b8b4a6c2ccedee$var$renderLessonsPagination(lessons) {
    const container = document.getElementById('lessonsPagination');
    if (!container) return;
    if ($e6b8b4a6c2ccedee$var$totalLessonsPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${$e6b8b4a6c2ccedee$var$currentLessonsPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${$e6b8b4a6c2ccedee$var$currentLessonsPage - 1}); return false;">&laquo;</a>
                </li>
    `;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, $e6b8b4a6c2ccedee$var$currentLessonsPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min($e6b8b4a6c2ccedee$var$totalLessonsPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(1); return false;">1</a></li>`;
        if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    for(let i = startPage; i <= endPage; i++)paginationHTML += `<li class="page-item ${i === $e6b8b4a6c2ccedee$var$currentLessonsPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changeLessonsPage(${i}); return false;">${i}</a></li>`;
    if (endPage < $e6b8b4a6c2ccedee$var$totalLessonsPages) {
        if (endPage < $e6b8b4a6c2ccedee$var$totalLessonsPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeLessonsPage(${$e6b8b4a6c2ccedee$var$totalLessonsPages}); return false;">${$e6b8b4a6c2ccedee$var$totalLessonsPages}</a></li>`;
    }
    paginationHTML += `
                <li class="page-item ${$e6b8b4a6c2ccedee$var$currentLessonsPage === $e6b8b4a6c2ccedee$var$totalLessonsPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeLessonsPage(${$e6b8b4a6c2ccedee$var$currentLessonsPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${$e6b8b4a6c2ccedee$var$currentLessonsPage} \u{438}\u{437} ${$e6b8b4a6c2ccedee$var$totalLessonsPages} \u{2022} \u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{430}\u{43D}\u{43E} ${lessons.length} \u{438}\u{437} ${$e6b8b4a6c2ccedee$var$totalLessonsItems} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}
            </small>
        </div>
    `;
    container.innerHTML = paginationHTML;
}
// Смена страницы
function $e6b8b4a6c2ccedee$var$changeLessonsPage(page) {
    if (page < 1 || page > $e6b8b4a6c2ccedee$var$totalLessonsPages || page === $e6b8b4a6c2ccedee$var$currentLessonsPage) return;
    $e6b8b4a6c2ccedee$var$loadLessons(page);
}
// Изменение количества уроков на странице
function $e6b8b4a6c2ccedee$var$changeLessonsPerPage(perPage) {
    $e6b8b4a6c2ccedee$var$lessonsPerPage = parseInt(perPage) || 10;
    $e6b8b4a6c2ccedee$var$loadLessons(1);
}
// Вспомогательные функции
function $e6b8b4a6c2ccedee$var$showLoading(show) {
    const container = document.getElementById('lessonsContainer');
    if (!container) return;
    if (show) container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}...</span>
                </div>
            </div>
        `;
}
function $e6b8b4a6c2ccedee$var$truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) return $e6b8b4a6c2ccedee$var$escapeHtml(text || '');
    return $e6b8b4a6c2ccedee$var$escapeHtml(text.substring(0, maxLength)) + '...';
}
function $e6b8b4a6c2ccedee$var$escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
async function $e6b8b4a6c2ccedee$var$deleteLesson(lessonId, lessonTitle) {
    if (!confirm(`\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C} \u{443}\u{440}\u{43E}\u{43A} "${lessonTitle}"?`)) return;
    try {
        const headers = {
            'Content-Type': 'application/json'
        };
        const response = await fetch(`/admin/lessons/${lessonId}/delete`, {
            method: 'DELETE',
            headers: headers
        });
        const result = await response.json().catch(()=>({})); // Handle empty response
        if (response.ok && result.success) {
            showAlert(`\u{423}\u{440}\u{43E}\u{43A} "${lessonTitle}" \u{443}\u{441}\u{43F}\u{435}\u{448}\u{43D}\u{43E} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}.`, 'success');
            $e6b8b4a6c2ccedee$var$loadLessons($e6b8b4a6c2ccedee$var$currentLessonsPage || 1);
        } else {
            const errorMessage = result.message || `\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${response.status}`;
            showAlert(errorMessage, 'error');
        }
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    const lessonsTabTrigger = document.querySelector('a[data-tab="lessons-edit-tab"]');
    if (lessonsTabTrigger) {
        lessonsTabTrigger.addEventListener('click', function() {
            // Ensure we load lessons only when the tab is activated
            setTimeout(()=>$e6b8b4a6c2ccedee$var$loadLessons(1), 10);
        });
        // If the tab is already active on page load, load lessons
        if (document.getElementById('lessons-edit-tab')?.classList.contains('active')) $e6b8b4a6c2ccedee$var$loadLessons(1);
    }
});
window.loadLessons = $e6b8b4a6c2ccedee$var$loadLessons;
window.changeLessonsPerPage = $e6b8b4a6c2ccedee$var$changeLessonsPerPage;
window.changeLessonsPage = $e6b8b4a6c2ccedee$var$changeLessonsPage;
window.deleteLesson = $e6b8b4a6c2ccedee$var$deleteLesson;


document.addEventListener('DOMContentLoaded', function() {
    // Используем делегирование событий для кнопок редактирования
    document.getElementById('modulesContainer').addEventListener('click', function(event) {
        const editButton = event.target.closest('.edit-module-btn');
        if (editButton) {
            const moduleId = editButton.dataset.moduleId;
            $a1038b641e4d5627$var$openEditModuleModal(moduleId);
        }
    });
    // Обработка отправки формы
    const editModuleForm = document.getElementById('editModuleForm');
    if (editModuleForm) editModuleForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        await $a1038b641e4d5627$var$submitEditModuleForm();
    });
});
async function $a1038b641e4d5627$var$openEditModuleModal(moduleId) {
    try {
        // 1. Получаем данные модуля
        const response = await fetch(`/admin/module/${moduleId}`);
        const result = await response.json();
        if (response.ok && result.success && result.data) {
            const module = result.data;
            // 2. Заполняем поля формы
            document.getElementById('editModuleId').value = module.moduleId;
            document.getElementById('editModuleTitle').value = module["moduleTitle"];
            document.getElementById('editModuleSlug').value = module["moduleSlug"];
            // 3. Загружаем и устанавливаем курс
            const courseSelect = document.getElementById('editModuleCourseId');
            await $a1038b641e4d5627$var$loadCoursesIntoSelect(courseSelect, module["courseName"]);
            // 4. Показываем модальное окно
            const modal = new bootstrap.Modal(document.getElementById('editModuleModal'));
            modal.show();
        } else showAlert(result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u043B\u0443\u0447\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043C\u043E\u0434\u0443\u043B\u044F.", 'error');
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0438 \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430:", error);
        showAlert("\u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0434\u0430\u043D\u043D\u044B\u0445 \u043C\u043E\u0434\u0443\u043B\u044F.", 'error');
    }
}
async function $a1038b641e4d5627$var$submitEditModuleForm() {
    const form = document.getElementById('editModuleForm');
    const moduleId = document.getElementById('editModuleId').value;
    const modal = bootstrap.Modal.getInstance(document.getElementById('editModuleModal'));
    const formData = {
        moduleId: moduleId,
        name: document.getElementById('editModuleTitle').value,
        slug: document.getElementById('editModuleSlug').value,
        courseId: document.getElementById('editModuleCourseId').value
    };
    try {
        const response = await fetch(`/admin/modules/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $a1038b641e4d5627$var$getCsrfToken()
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        if (response.ok && result.status === 'success') {
            showAlert(result.message || "\u041C\u043E\u0434\u0443\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D!", 'success');
            modal.hide();
            // Обновляем таблицу модулей
            if (typeof loadModules === 'function') loadModules(window.currentModulesPage || 1);
        } else // Обработка ошибок валидации или других сообщений об ошибках
        if (result.errors) {
            const errorMessages = Object.values(result.errors).join('\n');
            showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438:\n" + errorMessages, 'error');
        } else {
            showAlert(result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043C\u043E\u0434\u0443\u043B\u044C.", 'error');
            console.error(new Error(result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u043C\u043E\u0434\u0443\u043B\u044C."));
        }
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u043C\u043E\u0434\u0443\u043B\u044F:", error);
        showAlert("\u041E\u0448\u0438\u0431\u043A\u0430: " + error.message, 'error');
    }
}
// Загрузка списка курсов в select
async function $a1038b641e4d5627$var$loadCoursesIntoSelect(selectElement, selectedCourseTitle) {
    try {
        const response = await fetch('/admin/courses/all');
        if (!response.ok) console.error(new Error("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0441\u043F\u0438\u0441\u043E\u043A \u043A\u0443\u0440\u0441\u043E\u0432."));
        const data = await response.json();
        const courses = data.data; // Corrected: data is in data.data
        selectElement.innerHTML = '<option value="">\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441</option>';
        courses.forEach((course)=>{
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            if (course.title === selectedCourseTitle) option.selected = true;
            selectElement.appendChild(option);
        });
    } catch (error) {
        console.error(error);
        selectElement.innerHTML = '<option value="">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0443\u0440\u0441\u043E\u0432</option>';
    }
}
function $a1038b641e4d5627$var$getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.content || document.querySelector('input[name="_csrf"]')?.value;
}
window.loadCoursesIntoSelect = $a1038b641e4d5627$var$loadCoursesIntoSelect;
window.submitEditModuleForm = $a1038b641e4d5627$var$submitEditModuleForm;
window.openEditModuleModal = $a1038b641e4d5627$var$openEditModuleModal;


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('createModuleForm');
    const courseSelect = document.getElementById('moduleCourseId');
    const titleInput = document.getElementById('moduleTitle');
    const slugInput = document.getElementById('moduleSlug');
    const courseSelectAdminCreateModule = document.getElementById('moduleCourseId');
    loadCoursesIntoSelect(courseSelectAdminCreateModule, null);
    // Load courses when the tab is shown
    const createModuleTab = document.querySelector('a[data-tab="create-module-tab"]');
    if (createModuleTab) createModuleTab.addEventListener('click', loadCourses);
    // Also load courses if the tab is already active on page load
    if (document.getElementById('create-module-tab')?.classList.contains('active')) loadCourses();
    if (form) form.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (!validateForm()) return;
        try {
            const formData = {
                courseId: courseSelect.value,
                slug: slugInput.value,
                title: titleInput.value
            };
            const csrfToken = document.querySelector('meta[name="_csrf"]')?.content;
            const csrfHeader = document.querySelector('meta[name="_csrf_header"]')?.content;
            const headers = {
                'Content-Type': 'application/json'
            };
            if (csrfToken && csrfHeader) headers[csrfHeader] = csrfToken;
            const response = await fetch('/admin/modules/create', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (response.ok && result.status === 'success') {
                showAlert(result.message || "\u041C\u043E\u0434\u0443\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0441\u043E\u0437\u0434\u0430\u043D!", 'success');
                form.reset();
                // Optionally, switch back to the modules list tab
                const modulesTab = document.querySelector('a[data-tab="modules-edit-tab"]');
                if (modulesTab) modulesTab.click();
            } else {
                if (result.errors) {
                    const errorMessages = Object.values(result.errors).join('\n');
                    showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438:\n" + errorMessages, 'error');
                } else showAlert(result.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0438 \u043C\u043E\u0434\u0443\u043B\u044F", 'error');
                console.error('Server error:', result.message || result.errors);
            }
        } catch (error) {
            console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0438:", error);
            showAlert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0442\u043F\u0440\u0430\u0432\u043A\u0435 \u0434\u0430\u043D\u043D\u044B\u0445", 'error');
        }
    });
    function validateForm() {
        if (!courseSelect.value) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441", 'error');
            return false;
        }
        if (!titleInput.value.trim()) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u0432\u0435\u0434\u0438\u0442\u0435 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u0435 \u043C\u043E\u0434\u0443\u043B\u044F", 'error');
            return false;
        }
        if (!slugInput.value.trim()) {
            showAlert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u043A\u0430\u0436\u0438\u0442\u0435 URI \u043C\u043E\u0434\u0443\u043B\u044F", 'error');
            return false;
        }
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slugInput.value)) {
            showAlert("URI \u043C\u043E\u0436\u0435\u0442 \u0441\u043E\u0434\u0435\u0440\u0436\u0430\u0442\u044C \u0442\u043E\u043B\u044C\u043A\u043E \u043B\u0430\u0442\u0438\u043D\u0441\u043A\u0438\u0435 \u0431\u0443\u043A\u0432\u044B \u0432 \u043D\u0438\u0436\u043D\u0435\u043C \u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0435, \u0446\u0438\u0444\u0440\u044B \u0438 \u0434\u0435\u0444\u0438\u0441\u044B", 'error');
            return false;
        }
        return true;
    }
    let isSlugManuallyEdited = false;
    if (titleInput && slugInput) {
        // Generate slug as user types in the title field
        titleInput.addEventListener('input', ()=>{
            if (!isSlugManuallyEdited) generateSlugFromTitle();
        });
        // Detect when user edits the slug field manually to disable auto-generation
        slugInput.addEventListener('input', ()=>{
            isSlugManuallyEdited = true;
        });
    }
    function generateSlugFromTitle() {
        const title = titleInput.value.trim();
        if (title) {
            const translitMap = {
                "\u0430": 'a',
                "\u0431": 'b',
                "\u0432": 'v',
                "\u0433": 'g',
                "\u0434": 'd',
                "\u0435": 'e',
                "\u0451": 'yo',
                "\u0436": 'zh',
                "\u0437": 'z',
                "\u0438": 'i',
                "\u0439": 'y',
                "\u043A": 'k',
                "\u043B": 'l',
                "\u043C": 'm',
                "\u043D": 'n',
                "\u043E": 'o',
                "\u043F": 'p',
                "\u0440": 'r',
                "\u0441": 's',
                "\u0442": 't',
                "\u0443": 'u',
                "\u0444": 'f',
                "\u0445": 'h',
                "\u0446": 'ts',
                "\u0447": 'ch',
                "\u0448": 'sh',
                "\u0449": 'shch',
                "\u044A": '',
                "\u044B": 'y',
                "\u044C": '',
                "\u044D": 'e',
                "\u044E": 'yu',
                "\u044F": 'ya'
            };
            let slug = title.toLowerCase();
            let result = '';
            for(let i = 0; i < slug.length; i++)result += translitMap[slug[i]] || slug[i];
            slug = result.replace(/['"’]/g, '') // remove quotes
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/[^a-z0-9-]/g, '') // remove invalid chars
            .replace(/-+/g, '-') // collapse dashes
            .replace(/^-|-$/g, ''); // trim - from start or end
            slugInput.value = slug;
        }
    }
});


function $8a4cac6f562c8ee8$var$deleteModule(id) {
    // Показываем подтверждающее окно
    const isConfirmed = confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0442 \u043C\u043E\u0434\u0443\u043B\u044C, \u0438 \u0432\u0441\u0435 \u0435\u0433\u043E \u0443\u0440\u043E\u043A\u0438? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.");
    if (!isConfirmed) return; // Если пользователь отменил, прерываем выполнение
    // Отправляем запрос на сервер
    fetch(`/admin/module/${id}/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || '' // Для Spring Security CSRF
        }
    }).then((response)=>{
        // Всегда пытаемся парсить JSON, даже для "плохих" ответов
        return response.json().then((data)=>{
            if (!response.ok) // Если ответ не "ok", создаем ошибку с сообщением от сервера
            throw new Error(data.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043C\u043E\u0434\u0443\u043B\u044F");
            return data; // Возвращаем данные, если все в порядке
        });
    }).then((data)=>{
        // Успешное удаление
        showAlert(data.message || "\u041C\u043E\u0434\u0443\u043B\u044C \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D", 'success');
        // Обновляем таблицу модулей без перезагрузки страницы
        if (typeof loadModules === 'function') loadModules(window.currentModulesPage || 1);
    }).catch((error)=>{
        // Обработка ошибок
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${error.message}`, 'error');
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u043C\u043E\u0434\u0443\u043B\u044F:", error);
    });
}
window.deleteModule = $8a4cac6f562c8ee8$var$deleteModule;


function $6dbf2b492130ac78$var$adminUpdateModuleStatus(moduleID, status) {
    const isConfirmed = confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043E\u0431\u043D\u043E\u0432\u0438\u0442\u044C \u0441\u0442\u0430\u0442\u0443\u0441?");
    if (!isConfirmed) return; // Если пользователь отменил, прерываем выполнение
    if (status === 'ACTIVE') status = 'INACTIVE';
    else status = 'ACTIVE';
    // Отправляем запрос на сервер
    fetch(`/admin/modules/updateStatus/${moduleID}/${status}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="_csrf"]')?.content || '' // Для Spring Security CSRF
        }
    }).then((response)=>{
        return response.json().then((data)=>{
            if (!response.ok) throw new Error(data.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u0430");
            return data;
        });
    }).then((data)=>{
        // Успешное обновление
        showAlert(data.message, 'success');
        // Обновляем таблицу модулей без перезагрузки страницы
        if (typeof loadModules === 'function') loadModules(window.currentModulesPage || 1);
    }).catch((error)=>{
        // Обработка ошибок
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${error.message}`, 'error');
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0438 \u0441\u0442\u0430\u0442\u0443\u0441\u0430:", error);
    });
}
window.adminUpdateModuleStatus = $6dbf2b492130ac78$var$adminUpdateModuleStatus;


async function $d2c91e12a2e03e36$var$loadModuleLessons(moduleId) {
    try {
        const response = await fetch(`/admin/modules/${moduleId}/lessons`);
        // Case 1: Success (200 OK)
        if (response.ok) {
            const result = await response.json();
            if (result.success) $d2c91e12a2e03e36$var$showLessonsModal(result.data);
            else showAlert(result.message || "\u041F\u043E\u043B\u0443\u0447\u0435\u043D \u043D\u0435\u043E\u0436\u0438\u0434\u0430\u043D\u043D\u044B\u0439 \u043E\u0442\u0432\u0435\u0442 \u043E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430.", 'warning');
            return;
        }
        // Case 2: Not Found (404)
        if (response.status === 404) {
            showAlert("\u0412 \u044D\u0442\u043E\u043C \u043C\u043E\u0434\u0443\u043B\u0435 \u043F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0443\u0440\u043E\u043A\u043E\u0432.", 'info');
            // Show an empty modal for better UX
            $d2c91e12a2e03e36$var$showLessonsModal([]);
            return;
        }
        // Case 3: Server Error (500) or other client errors (4xx)
        let errorMessage = `HTTP \u{43E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${response.status} ${response.statusText}`;
        try {
            // Try to get a more specific error message from the response body
            const errorData = await response.json();
            if (errorData && errorData.error) errorMessage = `\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{43D}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{435}: ${errorData.error}`;
        } catch (e) {
            // Body is not JSON or is empty, stick with the generic HTTP error message
            console.error("Could not parse error JSON.", e);
        }
        showAlert(errorMessage, 'error');
        console.error('Failed to load lessons:', errorMessage);
    } catch (error) {
        // Case 4: Network error or other fetch-related failures
        console.error('Network or fetch error:', error);
        showAlert("\u0421\u0435\u0442\u0435\u0432\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430. \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0438\u0442\u044C\u0441\u044F \u043A \u0441\u0435\u0440\u0432\u0435\u0440\u0443.", 'error');
    }
}
function $d2c91e12a2e03e36$var$showLessonsModal(lessons) {
    // Create the modal if it doesn't exist yet
    if (!document.getElementById('lessonsModal')) {
        const modalHtml = `
            <div class="modal fade" id="lessonsModal" tabindex="-1" aria-labelledby="lessonsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="lessonsModalLabel">\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="lessonsModalBody">
                            <!-- Lesson list will be inserted here -->
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">\u{417}\u{430}\u{43A}\u{440}\u{44B}\u{442}\u{44C}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }
    const modalBody = document.getElementById('lessonsModalBody');
    const modalTitle = document.getElementById('lessonsModalLabel');
    if (lessons.length === 0) {
        modalTitle.textContent = "\u0423\u0440\u043E\u043A\u0438 \u043C\u043E\u0434\u0443\u043B\u044F";
        modalBody.innerHTML = `
            <div class="text-center py-4">
                <i class="bi bi-book-half fa-3x text-muted mb-3"></i>
                <h5 class="text-muted">\u{412} \u{44D}\u{442}\u{43E}\u{43C} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435} \u{43D}\u{435}\u{442} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}</h5>
                <p class="text-muted">\u{412}\u{44B} \u{43C}\u{43E}\u{436}\u{435}\u{442}\u{435} \u{441}\u{43E}\u{437}\u{434}\u{430}\u{442}\u{44C} \u{43F}\u{435}\u{440}\u{432}\u{44B}\u{439} \u{443}\u{440}\u{43E}\u{43A} \u{432} \u{440}\u{430}\u{437}\u{434}\u{435}\u{43B}\u{435} "\u{423}\u{440}\u{43E}\u{43A}\u{438}".</p>
            </div>
        `;
    } else {
        const moduleName = lessons[0]?.moduleName || "\u041C\u043E\u0434\u0443\u043B\u044C";
        modalTitle.textContent = `\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}: ${moduleName}`;
        modalBody.innerHTML = `
            <div class="list-group">
                ${lessons.map((lesson)=>`
                    <div class="list-group-item list-group-item-action">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${lesson.title || "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F"}</h6>
                                <small class="text-muted">ID: ${lesson.id}</small>
                            </div>
                            <div class="btn-group ms-3">
                                <button class="btn btn-outline-info btn-sm" onclick="viewLesson(${lesson.id}, '${lesson.courseSlug}', '${lesson.moduleSlug}')">
                                    <i class="bi bi-eye"></i> \u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{442}\u{44C}
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="mt-3">
                <small class="text-muted">\u{412}\u{441}\u{435}\u{433}\u{43E} \u{443}\u{440}\u{43E}\u{43A}\u{43E}\u{432}: ${lessons.length}</small>
            </div>
        `;
    }
    const modal = new bootstrap.Modal(document.getElementById('lessonsModal'));
    modal.show();
}
function $d2c91e12a2e03e36$var$viewLesson(lessonId, courseSlug, moduleSlug) {
    if (!courseSlug || !moduleSlug) {
        showAlert("\u041D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043E\u0447\u043D\u043E \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043F\u0435\u0440\u0435\u0445\u043E\u0434\u0430 \u043A \u0443\u0440\u043E\u043A\u0443 (\u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 slug \u043A\u0443\u0440\u0441\u0430 \u0438\u043B\u0438 \u043C\u043E\u0434\u0443\u043B\u044F).", 'error');
        return;
    }
    const url = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonId}`;
    console.log(`Redirecting to: ${url}`);
    window.location.href = url;
}
window.loadModuleLessons = $d2c91e12a2e03e36$var$loadModuleLessons;
window.viewLesson = $d2c91e12a2e03e36$var$viewLesson;


let $7898aba61f4f51c3$var$currentModulesPage = 1;
let $7898aba61f4f51c3$var$totalModulesPages = 1;
let $7898aba61f4f51c3$var$totalModulesItems = 0;
let $7898aba61f4f51c3$var$modulesPerPage = 5;
// --- NEW: Initialize the entire view (controls and data) ---
function $7898aba61f4f51c3$var$initModulesView() {
    const container = document.getElementById('modulesContainer');
    if (!container) {
        console.error('Module container not found!');
        return;
    }
    // 1. Render the static part of the table (header, filters)
    $7898aba61f4f51c3$var$renderModuleControls(container);
    // 2. Populate the filter with data
    $7898aba61f4f51c3$var$loadCoursesForFilter();
    // 3. Load the initial set of data
    $7898aba61f4f51c3$var$loadModules(1);
}
// --- NEW: Renders the static controls (header, filters) only once ---
function $7898aba61f4f51c3$var$renderModuleControls(container) {
    container.innerHTML = `
        <div class="data-table courses-table modules-table">
            <div class="table-header d-flex justify-content-between align-items-center flex-wrap">
                 <h3 class="table-title mb-2 mb-md-0">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}</h3>
                 <div class="d-flex align-items-center gap-2 flex-wrap">
                    <div class="filter-group">
                        <select class="form-select form-select-sm" id="courseFilterSelect" onchange="loadModules(1)">
                            <option value="">\u{424}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{43F}\u{43E} \u{43A}\u{443}\u{440}\u{441}\u{443}...</option>
                        </select>
                    </div>
                    <div class="page-size-selector">
                        <div class="input-group input-group-sm">
                            <span class="input-group-text">\u{41E}\u{442}\u{43E}\u{431}\u{440}\u{430}\u{436}\u{430}\u{442}\u{44C}</span>
                            <select class="form-select" id="modulesPageSizeSelect" onchange="changeModulesPerPage(this.value)">
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                                <option value="50">50</option>
                            </select>
                        </div>
                    </div>
                     <button class="btn btn-primary btn-sm" onclick="openCreateModuleModal()">
                        <i class="bi bi-plus-circle me-1"></i>\u{41D}\u{43E}\u{432}\u{44B}\u{439} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}
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
    document.getElementById('modulesPageSizeSelect').value = $7898aba61f4f51c3$var$modulesPerPage;
}
// --- NEW: Function to load courses for the filter dropdown (runs once) ---
async function $7898aba61f4f51c3$var$loadCoursesForFilter() {
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
        json.data.forEach((course)=>{
            const option = document.createElement('option');
            option.value = course.id;
            option.textContent = course.title;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading courses for filter:', error);
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0444\u0438\u043B\u044C\u0442\u0440 \u043A\u0443\u0440\u0441\u043E\u0432.", 'warning');
    }
}
// --- MODIFIED: Fetches data and calls a specific function to render only the rows ---
async function $7898aba61f4f51c3$var$loadModules(page = 1) {
    const contentContainer = document.getElementById('modules-table-content');
    if (!contentContainer) {
        $7898aba61f4f51c3$var$initModulesView(); // If the container doesn't exist, initialize the whole view
        return;
    }
    $7898aba61f4f51c3$var$showLoadingModules(true);
    try {
        const courseId = document.getElementById('courseFilterSelect')?.value || '';
        let url = `/admin/modules?page=${page}&size=${$7898aba61f4f51c3$var$modulesPerPage}`;
        if (courseId) url += `&courseId=${courseId}`;
        const response = await fetch(url);
        const data = await response.json();
        if (response.ok && data.success && data.data && typeof data.data.content !== 'undefined') {
            const paginatedModules = data.data;
            $7898aba61f4f51c3$var$currentModulesPage = paginatedModules["currentPage"] || page;
            $7898aba61f4f51c3$var$totalModulesPages = paginatedModules["totalPages"] || 1;
            $7898aba61f4f51c3$var$totalModulesItems = paginatedModules["totalItems"] || 0;
            $7898aba61f4f51c3$var$renderModuleRows(paginatedModules.content);
            $7898aba61f4f51c3$var$renderModulesPagination();
        } else $7898aba61f4f51c3$var$showErrorModules(data.message || "\u041F\u043E\u043B\u0443\u0447\u0435\u043D\u044B \u043D\u0435\u0432\u0435\u0440\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435 \u043E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430.");
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043C\u043E\u0434\u0443\u043B\u0435\u0439:", error);
        $7898aba61f4f51c3$var$showErrorModules(error.message);
    } finally{
        $7898aba61f4f51c3$var$showLoadingModules(false);
    }
}
// --- NEW: Renders only the module rows into the content container ---
function $7898aba61f4f51c3$var$renderModuleRows(modules) {
    const container = document.getElementById('modules-table-content');
    if (!container) return;
    // Clear only the rows
    container.innerHTML = '';
    const headerRow = `
        <div class="table-row header-row">
            <div class="table-cell">ID</div>
            <div class="table-cell">\u{41D}\u{430}\u{437}\u{432}\u{430}\u{43D}\u{438}\u{435}</div>
            <div class="table-cell">\u{41A}\u{443}\u{440}\u{441}</div>
            <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
            <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', headerRow);
    if (modules.length === 0) {
        container.insertAdjacentHTML('beforeend', `
            <div class="table-row">
                <div class="table-cell" style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #94a3b8;">
                    <i class="bi bi-collection me-2"></i>
                    \u{41C}\u{43E}\u{434}\u{443}\u{43B}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}. \u{418}\u{437}\u{43C}\u{435}\u{43D}\u{438}\u{442}\u{435} \u{444}\u{438}\u{43B}\u{44C}\u{442}\u{440} \u{438}\u{43B}\u{438} \u{434}\u{43E}\u{431}\u{430}\u{432}\u{44C}\u{442}\u{435} \u{43D}\u{43E}\u{432}\u{44B}\u{439} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44C}.
                </div>
            </div>
        `);
        return;
    }
    modules.forEach((module)=>{
        const rowHTML = `
            <div class="table-row">
                <div class="table-cell text-muted">#${module.moduleId || 'N/A'}</div>
                <div class="table-cell">
                    <div class="fw-bold">${$7898aba61f4f51c3$var$escapeHtml(module["moduleTitle"] || "\u0411\u0435\u0437 \u043D\u0430\u0437\u0432\u0430\u043D\u0438\u044F")}</div>
                </div>
                <div class="table-cell">
                    <span class="text-muted">${$7898aba61f4f51c3$var$escapeHtml(module["courseName"] || 'N/A')}</span>
                </div>
                <div class="table-cell">
                    <span class="badge ${module["moduleStatus"] === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}" style="cursor: pointer" onclick="adminUpdateModuleStatus(${module.moduleId}, '${module["moduleStatus"]}')">
                        ${$7898aba61f4f51c3$var$escapeHtml($7898aba61f4f51c3$var$adaptiveModuleStatus(module["moduleStatus"]))}
                    </span>
                </div>
                <div class="table-cell action-buttons">
                    <button class="btn btn-primary btn-icon btn-sm edit-module-btn" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" data-module-id="${module.moduleId}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteModule(${module.moduleId}, '${$7898aba61f4f51c3$var$escapeHtml(module["moduleTitle"])}')">
                        <i class="bi bi-trash"></i>
                    </button>
                    <button class="btn btn-info btn-icon btn-sm" title="\u{423}\u{440}\u{43E}\u{43A}\u{438} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{44F}" onclick="loadModuleLessons(${module.moduleId})">
                        <i class="bi bi-card-checklist"></i>
                    </button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', rowHTML);
    });
}
// --- UNCHANGED (mostly) ---
function $7898aba61f4f51c3$var$renderModulesPagination() {
    let container = document.getElementById('modulesPagination');
    if (!container) {
        // If the main container exists but pagination doesn't, create it.
        const mainContainer = document.getElementById('modulesContainer');
        if (mainContainer) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-container mt-3';
            paginationDiv.id = 'modulesPagination';
            mainContainer.appendChild(paginationDiv);
            container = paginationDiv;
        } else return;
    }
    if ($7898aba61f4f51c3$var$totalModulesPages <= 1) {
        container.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${$7898aba61f4f51c3$var$currentModulesPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${$7898aba61f4f51c3$var$currentModulesPage - 1}); return false;">&laquo;</a>
                </li>
    `;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, $7898aba61f4f51c3$var$currentModulesPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min($7898aba61f4f51c3$var$totalModulesPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(1); return false;">1</a></li>`;
        if (startPage > 2) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    for(let i = startPage; i <= endPage; i++)paginationHTML += `<li class="page-item ${i === $7898aba61f4f51c3$var$currentModulesPage ? 'active' : ''}"><a class="page-link" href="#" onclick="changeModulesPage(${i}); return false;">${i}</a></li>`;
    if (endPage < $7898aba61f4f51c3$var$totalModulesPages) {
        if (endPage < $7898aba61f4f51c3$var$totalModulesPages - 1) paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changeModulesPage(${$7898aba61f4f51c3$var$totalModulesPages}); return false;">${$7898aba61f4f51c3$var$totalModulesPages}</a></li>`;
    }
    paginationHTML += `
                <li class="page-item ${$7898aba61f4f51c3$var$currentModulesPage === $7898aba61f4f51c3$var$totalModulesPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeModulesPage(${$7898aba61f4f51c3$var$currentModulesPage + 1}); return false;">&raquo;</a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${$7898aba61f4f51c3$var$currentModulesPage} \u{438}\u{437} ${$7898aba61f4f51c3$var$totalModulesPages} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43C}\u{43E}\u{434}\u{443}\u{43B}\u{435}\u{439}: ${$7898aba61f4f51c3$var$totalModulesItems}
            </small>
        </div>
    `;
    container.innerHTML = paginationHTML;
}
function $7898aba61f4f51c3$var$changeModulesPage(page) {
    if (page < 1 || page > $7898aba61f4f51c3$var$totalModulesPages || page === $7898aba61f4f51c3$var$currentModulesPage) return;
    $7898aba61f4f51c3$var$loadModules(page);
}
function $7898aba61f4f51c3$var$changeModulesPerPage(perPage) {
    $7898aba61f4f51c3$var$modulesPerPage = parseInt(perPage) || 10;
    $7898aba61f4f51c3$var$loadModules(1);
}
function $7898aba61f4f51c3$var$showLoadingModules(isLoading) {
    const container = document.getElementById('modules-table-content');
    if (!container) return;
    if (isLoading) container.innerHTML = `
            <div class="d-flex justify-content-center align-items-center" style="height: 200px;">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430}...</span>
                </div>
            </div>
        `;
}
function $7898aba61f4f51c3$var$showErrorModules(message) {
    const container = document.getElementById('modulesContainer');
    if (!container) return;
    container.innerHTML = `
        <div class="text-center py-4 text-danger">
            <i class="bi bi-exclamation-triangle-fill fa-2x mb-3"></i>
            <h5>\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{438}</h5>
            <p>${$7898aba61f4f51c3$var$escapeHtml(message)}</p>
            <button class="btn btn-primary btn-sm" onclick="initModulesView()">
                <i class="bi bi-arrow-clockwise me-1"></i> \u{41F}\u{43E}\u{43F}\u{440}\u{43E}\u{431}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{441}\u{43D}\u{43E}\u{432}\u{430}
            </button>
        </div>
    `;
}
function $7898aba61f4f51c3$var$adaptiveModuleStatus(status) {
    return status === 'ACTIVE' ? "\u0410\u043A\u0442\u0438\u0432\u043D\u044B\u0439" : "\u041D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0439";
}
function $7898aba61f4f51c3$var$escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function $7898aba61f4f51c3$var$openCreateModuleModal() {
    const tabLink = document.querySelector('a[data-tab="create-module-tab"]');
    if (tabLink) tabLink.click();
}
// --- MODIFIED: Initialization logic ---
document.addEventListener('DOMContentLoaded', function() {
    const modulesTabTrigger = document.querySelector('a[data-tab="modules-edit-tab"]');
    if (modulesTabTrigger) {
        let isInitialized = false;
        const observer = new MutationObserver(()=>{
            if (document.getElementById('modules-edit-tab').classList.contains('active') && !isInitialized) {
                $7898aba61f4f51c3$var$initModulesView();
                isInitialized = true;
            }
        });
        modulesTabTrigger.addEventListener('click', ()=>{
            if (!isInitialized) {
                $7898aba61f4f51c3$var$initModulesView();
                isInitialized = true;
            }
        });
        if (document.getElementById('modules-edit-tab').classList.contains('active')) {
            $7898aba61f4f51c3$var$initModulesView();
            isInitialized = true;
        }
    }
});
window.changeModulesPerPage = $7898aba61f4f51c3$var$changeModulesPerPage;
window.openCreateModuleModal = $7898aba61f4f51c3$var$openCreateModuleModal;
window.changeModulesPage = $7898aba61f4f51c3$var$changeModulesPage;
window.initModulesView = $7898aba61f4f51c3$var$initModulesView;
window.loadModules = $7898aba61f4f51c3$var$loadModules;


// This file is deprecated. The deleteOffer function is now in getOffers.js


// State variables for pagination and filtering
let $d810eae5683564e2$var$currentOfferPage = 1;
let $d810eae5683564e2$var$totalOfferPages = 1;
let $d810eae5683564e2$var$totalOfferItems = 0;
let $d810eae5683564e2$var$sortStatus = "all";
let $d810eae5683564e2$var$offersPerPage = 10; // Default value
/**
 * Fetches and renders offers for a given page and filters.
 * @param {number} page - The page number to load.
 */ async function $d810eae5683564e2$var$loadOffers(page = 1) {
    try {
        const response = await fetch(`/admin/offers?page=${page}&size=${$d810eae5683564e2$var$offersPerPage}&status=${$d810eae5683564e2$var$sortStatus}`);
        if (!response.ok) {
            console.error(new Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.status}`));
            showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.status}`, 'error');
        }
        const data = await response.json();
        if (data.success && data["offers"]) {
            $d810eae5683564e2$var$currentOfferPage = data["currentPage"] || page;
            $d810eae5683564e2$var$totalOfferPages = data["totalPages"] || 1;
            $d810eae5683564e2$var$totalOfferItems = data["totalItems"] || data["offers"].length;
            $d810eae5683564e2$var$renderOffersTable(data["offers"]);
            $d810eae5683564e2$var$renderOfferPagePagination();
        } else {
            console.error(new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442 AdminOfferController"));
            showAlert("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442 AdminOfferController", 'error');
        }
    } catch (e) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0435 \u0437\u0430\u044F\u0432\u043E\u043A:", e);
        const offerTableContainer = document.querySelector('#requests-tab .card-body');
        if (offerTableContainer) offerTableContainer.innerHTML = `<div class="text-center py-4 text-danger">\u{41D}\u{435} \u{443}\u{434}\u{430}\u{43B}\u{43E}\u{441}\u{44C} \u{437}\u{430}\u{433}\u{440}\u{443}\u{437}\u{438}\u{442}\u{44C} \u{437}\u{430}\u{44F}\u{432}\u{43A}\u{438}.</div>`;
    }
}
/**
 * Deletes an offer after user confirmation.
 * @param {string|number} offerId - The ID of the offer to delete.
 */ async function $d810eae5683564e2$var$deleteOffer(offerId) {
    // Use a more robust confirmation if a custom modal library is available
    if (!confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u0443 \u0437\u0430\u044F\u0432\u043A\u0443?")) return;
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
            showAlert("\u0417\u0430\u044F\u0432\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0434\u0430\u043B\u0435\u043D\u0430!", 'success');
            $d810eae5683564e2$var$loadOffers($d810eae5683564e2$var$currentOfferPage); // Refresh the list
        } else showAlert(result.error || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0438 \u0437\u0430\u044F\u0432\u043A\u0438", 'error');
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0437\u0430\u044F\u0432\u043A\u0438:", error);
        showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430", 'error');
    }
}
/**
 * Renders the main table of offers.
 * @param {Array<object>} offers - The array of offer objects to render.
 */ function $d810eae5683564e2$var$renderOffersTable(offers) {
    const offerTableContainer = document.querySelector('#requests-tab .card-body');
    if (!offerTableContainer) {
        console.error("\u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0434\u043B\u044F \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
        return;
    }
    offerTableContainer.innerHTML = `
    <div class="offers-table-container">
        <div class="data-table offers-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{437}\u{430}\u{44F}\u{432}\u{43E}\u{43A}</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-funnel"></i></span>
                        <select class="form-select form-select-sm" id="statusFilter">
                            <option value="all" ${$d810eae5683564e2$var$sortStatus === 'all' ? 'selected' : ''}>\u{412}\u{441}\u{435} \u{441}\u{442}\u{430}\u{442}\u{443}\u{441}\u{44B}</option>
                            <option value="PENDING" ${$d810eae5683564e2$var$sortStatus === 'PENDING' ? 'selected' : ''}>\u{41D}\u{430} \u{440}\u{430}\u{441}\u{441}\u{43C}\u{43E}\u{442}\u{440}\u{435}\u{43D}\u{438}\u{438}</option>
                            <option value="APPROVED" ${$d810eae5683564e2$var$sortStatus === 'APPROVED' ? 'selected' : ''}>\u{41E}\u{434}\u{43E}\u{431}\u{440}\u{435}\u{43D}\u{44B}\u{435}</option>
                            <option value="COMPLETED" ${$d810eae5683564e2$var$sortStatus === 'COMPLETED' ? 'selected' : ''}>\u{412}\u{44B}\u{43F}\u{43E}\u{43B}\u{43D}\u{435}\u{43D}\u{44B}\u{435}</option>
                            <option value="REJECTED" ${$d810eae5683564e2$var$sortStatus === 'REJECTED' ? 'selected' : ''}>\u{41E}\u{442}\u{43A}\u{43B}\u{43E}\u{43D}\u{435}\u{43D}\u{43D}\u{44B}\u{435}</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">\u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{44B}\u{432}\u{430}\u{442}\u{44C}</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect">
                            <option value="5" ${$d810eae5683564e2$var$offersPerPage === 5 ? 'selected' : ''}>5</option>
                            <option value="10" ${$d810eae5683564e2$var$offersPerPage === 10 ? 'selected' : ''}>10</option>
                            <option value="20" ${$d810eae5683564e2$var$offersPerPage === 20 ? 'selected' : ''}>20</option>
                            <option value="50" ${$d810eae5683564e2$var$offersPerPage === 50 ? 'selected' : ''}>50</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="table-content" id="offersTableContent">
                <!-- Table Header -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{422}\u{435}\u{43C}\u{430}</div>
                    <div class="table-cell">\u{41E}\u{43F}\u{438}\u{441}\u{430}\u{43D}\u{438}\u{435}</div>
                    <div class="table-cell">\u{41E}\u{442}\u{432}\u{435}\u{442}</div>
                    <div class="table-cell">\u{421}\u{442}\u{430}\u{442}\u{443}\u{441}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}\u{430}</div>
                    <div class="table-cell">\u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{430}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>

                <!-- Offer Rows -->
                ${offers.length > 0 ? offers.map((offer)=>`
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
                        <span class="course-description">${offer.response || "\u041D\u0435\u0442 \u043E\u0442\u0432\u0435\u0442\u0430"}</span>
                    </div>
                    <div class="table-cell">${$d810eae5683564e2$var$convertStatusIntoBadge(offer.status)}</div>
                    <div class="table-cell text-sm text-muted">${$d810eae5683564e2$var$extractDate(offer["createdAt"])}</div>
                    <div class="table-cell text-sm text-muted">${$d810eae5683564e2$var$extractDate(offer["updatedAt"])}</div>
                    <div class="table-cell action-buttons justify-content-center">
                        ${createOfferResponseButton(offer)}
                        <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" data-action="delete-offer" data-offer-id="${offer.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                `).join('') : `
                <div class="table-row" style="grid-template-columns: 1fr;">
                    <div class="text-center py-4 text-muted">
                        <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                        \u{417}\u{430}\u{44F}\u{432}\u{43A}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                    </div>
                </div>
                `}
            </div>
        </div>
    </div>`;
    $d810eae5683564e2$var$bindOfferTableEvents(); // Bind events after rendering
}
/**
 * Renders the pagination controls for the offers table.
 */ function $d810eae5683564e2$var$renderOfferPagePagination() {
    let offerPaginationContainer = document.querySelector('.pagination-container-edit-offers');
    if (!offerPaginationContainer) {
        const mainContainer = document.querySelector('#requests-tab .card-body');
        if (mainContainer) {
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination-container-edit-offers mt-3';
            mainContainer.appendChild(paginationDiv);
            offerPaginationContainer = paginationDiv;
        } else {
            console.error("\u041E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0434\u043B\u044F \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u0437\u0430\u044F\u0432\u043E\u043A \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D, \u043F\u0430\u0433\u0438\u043D\u0430\u0446\u0438\u044F \u043D\u0435 \u0431\u0443\u0434\u0435\u0442 \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0430.");
            return;
        }
    }
    if ($d810eae5683564e2$var$totalOfferPages <= 1) {
        offerPaginationContainer.innerHTML = '';
        return;
    }
    let offerPaginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <!-- Previous Button -->
                <li class="page-item ${$d810eae5683564e2$var$currentOfferPage === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${$d810eae5683564e2$var$currentOfferPage - 1}" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>`;
    const maxVisiblePages = 5;
    let offerStartPage = Math.max(1, $d810eae5683564e2$var$currentOfferPage - Math.floor(maxVisiblePages / 2));
    let offerEndPage = Math.min($d810eae5683564e2$var$totalOfferPages, offerStartPage + maxVisiblePages - 1);
    if (offerEndPage - offerStartPage + 1 < maxVisiblePages) offerStartPage = Math.max(1, offerEndPage - maxVisiblePages + 1);
    if (offerStartPage > 1) {
        offerPaginationHTML += `<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="1">1</a></li>`;
        if (offerStartPage > 2) offerPaginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
    }
    for(let i = offerStartPage; i <= offerEndPage; i++)offerPaginationHTML += `
            <li class="page-item ${i === $d810eae5683564e2$var$currentOfferPage ? 'active' : ''}">
                <a class="page-link" href="#" data-action="change-page" data-page-number="${i}">${i}</a>
            </li>`;
    if (offerEndPage < $d810eae5683564e2$var$totalOfferPages) {
        if (offerEndPage < $d810eae5683564e2$var$totalOfferPages - 1) offerPaginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        offerPaginationHTML += `<li class="page-item"><a class="page-link" href="#" data-action="change-page" data-page-number="${$d810eae5683564e2$var$totalOfferPages}">${$d810eae5683564e2$var$totalOfferPages}</a></li>`;
    }
    offerPaginationHTML += `
                <!-- Next Button -->
                <li class="page-item ${$d810eae5683564e2$var$currentOfferPage === $d810eae5683564e2$var$totalOfferPages ? 'disabled' : ''}">
                    <a class="page-link" href="#" data-action="change-page" data-page-number="${$d810eae5683564e2$var$currentOfferPage + 1}" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">\u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${$d810eae5683564e2$var$currentOfferPage} \u{438}\u{437} ${$d810eae5683564e2$var$totalOfferPages} \u{2022} \u{412}\u{441}\u{435}\u{433}\u{43E} \u{437}\u{430}\u{44F}\u{432}\u{43E}\u{43A}: ${$d810eae5683564e2$var$totalOfferItems}</small>
        </div>`;
    offerPaginationContainer.innerHTML = offerPaginationHTML;
    $d810eae5683564e2$var$bindOfferPaginationEvents(); // Bind events after rendering
}
/**
 * Binds event listeners for the offers table (filters, actions).
 */ function $d810eae5683564e2$var$bindOfferTableEvents() {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) statusFilter.addEventListener('change', (event)=>{
        $d810eae5683564e2$var$sortStatus = event.target.value;
        $d810eae5683564e2$var$loadOffers(1); // Reset to first page
    });
    const pageSizeSelect = document.getElementById('pageSizeSelect');
    if (pageSizeSelect) pageSizeSelect.addEventListener('change', (event)=>{
        $d810eae5683564e2$var$offersPerPage = parseInt(event.target.value, 10);
        $d810eae5683564e2$var$loadOffers(1); // Reset to first page
    });
    const tableContent = document.getElementById('offersTableContent');
    if (tableContent) tableContent.addEventListener('click', (event)=>{
        const target = event.target.closest('button[data-action="delete-offer"]');
        if (target) {
            const offerId = target.dataset.offerId;
            $d810eae5683564e2$var$deleteOffer(offerId);
        }
    });
}
/**
 * Binds event listeners for the pagination controls.
 */ function $d810eae5683564e2$var$bindOfferPaginationEvents() {
    const offerPaginationContainer = document.querySelector('.pagination-container-edit-offers');
    if (offerPaginationContainer) offerPaginationContainer.addEventListener('click', (event)=>{
        event.preventDefault();
        const target = event.target.closest('a[data-action="change-page"]');
        if (target) {
            const pageNumber = parseInt(target.dataset.pageNumber, 10);
            if (!isNaN(pageNumber)) $d810eae5683564e2$var$changeOfferPage(pageNumber);
        }
    });
}
/**
 * Changes the current page of offers.
 * @param {number} page - The page number to switch to.
 */ function $d810eae5683564e2$var$changeOfferPage(page) {
    if (page < 1 || page > $d810eae5683564e2$var$totalOfferPages || page === $d810eae5683564e2$var$currentOfferPage) return;
    $d810eae5683564e2$var$loadOffers(page);
}
/**
 * Formats a date string into YYYY-MM-DD.
 * @param {string} dateString - The input date string.
 * @returns {string} The formatted date.
 */ function $d810eae5683564e2$var$extractDate(dateString) {
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
 */ function $d810eae5683564e2$var$convertStatusIntoBadge(status) {
    switch(status){
        case 'PENDING':
            return '<span class="status-badge status-pending">\u041D\u0435 \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u0430</span>';
        case 'REJECTED':
            return '<span class="status-badge status-rejected">\u041E\u0442\u043A\u043B\u043E\u043D\u0435\u043D\u0430</span>';
        case 'APPROVED':
            return '<span class="status-badge status-review">\u041E\u0434\u043E\u0431\u0440\u0435\u043D\u0430</span>';
        case 'COMPLETED':
            return '<span class="status-badge status-completed">\u0412\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0430</span>';
        default:
            return `<span class="status-badge">${status || 'N/A'}</span>`;
    }
}
// Initial load when the DOM is ready and the tab is visible.
document.addEventListener('DOMContentLoaded', function() {
    // This assumes the tab is visible on load. A more robust solution might
    // use a MutationObserver or a custom event when the tab is shown.
    const offersTab = document.getElementById('requests-tab');
    if (offersTab) $d810eae5683564e2$var$loadOffers(1);
});
// Expose functions to the global scope if they are called from other scripts
// or legacy inline handlers we might have missed.
window.loadOffers = $d810eae5683564e2$var$loadOffers;


// offerModal.js - Merged functionality for handling offer responses.
let $a8947760f7180fbb$var$currentOffer = null;
// --- INITIALIZATION ---
// Initialize event listeners when the DOM is fully loaded.
document.addEventListener('DOMContentLoaded', $a8947760f7180fbb$var$initOfferModal);
/**
 * Initializes all event listeners for the offer response modal.
 */ function $a8947760f7180fbb$var$initOfferModal() {
    const modalElement = document.getElementById('offerResponseModal');
    // The form ID is 'adminUpdateForm' from admin.ftlh.
    const responseForm = document.getElementById('adminUpdateForm');
    if (modalElement) {
        // Use event delegation for all buttons that open the response modal.
        document.body.addEventListener('click', $a8947760f7180fbb$var$handleOpenModalClick);
        // Clear the form when the modal is closed.
        modalElement.addEventListener('hidden.bs.modal', $a8947760f7180fbb$var$clearModalForm);
    }
    if (responseForm) // Handle the form submission.
    responseForm.addEventListener('submit', $a8947760f7180fbb$var$handleSubmitResponse);
}
// --- EVENT HANDLERS ---
/**
 * Handles clicks on the body to open the modal if the target is a response button.
 * @param {Event} event - The click event.
 */ function $a8947760f7180fbb$var$handleOpenModalClick(event) {
    const button = event.target.closest('.js-open-response-modal');
    if (button) {
        const offerData = {
            id: button.dataset.id,
            description: button.dataset.description,
            response: button.dataset.response,
            status: button.dataset.status
        };
        $a8947760f7180fbb$var$openOfferResponseModal(offerData);
    }
}
/**
 * Handles the submission of the offer response form.
 * @param {Event} event - The submit event.
 */ async function $a8947760f7180fbb$var$handleSubmitResponse(event) {
    event.preventDefault();
    const form = event.target;
    const offerId = form.querySelector('#offerId').value;
    const status = form.querySelector('#responseStatus').value;
    const responseText = form.querySelector('#responseText').value;
    const updateData = {
        offerId: offerId,
        status: status,
        response: responseText.trim()
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435...';
        const response = await fetch('/admin/updateOffer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $a8947760f7180fbb$var$getCsrfToken()
            },
            body: JSON.stringify(updateData)
        });
        const result = await response.json();
        if (!response.ok) {
            const errorMessage = result.errors ? "\u041E\u0448\u0438\u0431\u043A\u0438 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438:\n" + Object.values(result.errors).join('\n') : `\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${result.message || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430"}`;
            showAlert(errorMessage, 'error');
            return;
        }
        showAlert("\u0417\u0430\u044F\u0432\u043A\u0430 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0430!", 'success');
        const modal = bootstrap.Modal.getInstance(document.getElementById('offerResponseModal'));
        modal.hide();
        // Refresh the offers list if the function exists.
        if (typeof loadOffers === 'function') loadOffers();
    } catch (error) {
        console.error('Error updating offer:', error);
        showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430", 'error');
    } finally{
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}
// --- MODAL AND FORM LOGIC ---
/**
 * Opens the modal and populates it with the offer data.
 * @param {object} offerData - The data for the offer.
 */ function $a8947760f7180fbb$var$openOfferResponseModal(offerData) {
    $a8947760f7180fbb$var$currentOffer = offerData;
    $a8947760f7180fbb$var$populateModalForm(offerData);
    const modal = new bootstrap.Modal(document.getElementById('offerResponseModal'));
    modal.show();
}
/**
 * Fills the modal's form with data from the selected offer.
 * @param {object} offerData - The data for the offer.
 */ function $a8947760f7180fbb$var$populateModalForm(offerData) {
    document.getElementById('responseOfferId').textContent = offerData.id;
    document.getElementById('offerId').value = offerData.id;
    document.getElementById('responseDescription').textContent = offerData.description || "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442";
    document.getElementById('responseStatus').value = offerData.status || 'PENDING';
    document.getElementById('responseText').value = offerData.response || '';
}
/**
 * Clears the form fields and resets the state.
 */ function $a8947760f7180fbb$var$clearModalForm() {
    const form = document.getElementById('adminUpdateForm');
    if (form) form.reset(); // Resets all form fields
    // Manually clear elements not part of the form if needed
    document.getElementById('responseOfferId').textContent = '';
    document.getElementById('responseDescription').textContent = "\u041E\u043F\u0438\u0441\u0430\u043D\u0438\u0435 \u043E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442";
    $a8947760f7180fbb$var$currentOffer = null;
}
// --- UTILITY FUNCTIONS ---
/**
 * Creates the HTML for the response button.
 * @param {object} offer - The offer object.
 * @returns {string} HTML string for the button.
 */ function $a8947760f7180fbb$var$createOfferResponseButton(offer) {
    return `
        <button class="btn btn-info btn-icon btn-sm js-open-response-modal"
                title="\u{41E}\u{442}\u{432}\u{435}\u{442}\u{438}\u{442}\u{44C}"
                data-id="${offer.id}"
                data-description="${$a8947760f7180fbb$var$escapeHtml(offer.description || '')}"
                data-response="${$a8947760f7180fbb$var$escapeHtml(offer.response || '')}"
                data-status="${offer.status}">
            <i class="bi bi-reply"></i>
        </button>
    `;
}
/**
 * Gets the CSRF token from the page's meta tags.
 * @returns {string} The CSRF token.
 */ function $a8947760f7180fbb$var$getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}
/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} text - The string to escape.
 * @returns {string} The escaped string.
 */ function $a8947760f7180fbb$var$escapeHtml(text) {
    if (typeof text !== 'string') return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"]|'(?!$)/g, (m)=>map[m]);
}
// --- GLOBAL EXPOSURE ---
// Expose functions to the global scope if they need to be called from inline scripts or other modules.
window.openOfferResponseModal = $a8947760f7180fbb$var$openOfferResponseModal;
window.createOfferResponseButton = $a8947760f7180fbb$var$createOfferResponseButton;


// Глобальные переменные для хранения данных
let $e0378f4fa6d23c5e$var$currentEditingUser = null;
// Функция открытия модального окна редактирования
async function $e0378f4fa6d23c5e$var$openEditUserModal(userId) {
    try {
        // Загружаем данные пользователя
        const userResponse = await fetch(`/admin/user/${userId}`);
        if (!userResponse.ok) throw new Error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
        const userData = await userResponse.json();
        if (!userData.success) throw new Error(userData.message || "\u041E\u0448\u0438\u0431\u043A\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
        $e0378f4fa6d23c5e$var$currentEditingUser = userData.data;
        console.log($e0378f4fa6d23c5e$var$currentEditingUser);
        const modalElement = document.getElementById('editUserModal');
        if (!modalElement) throw new Error("\u041C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0435 \u043E\u043A\u043D\u043E \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E \u0432 DOM");
        // Показываем модальное окно
        const modal = new bootstrap.Modal(modalElement);
        $('#editUserName').text(`${$e0378f4fa6d23c5e$var$currentEditingUser["firstName"]} ${$e0378f4fa6d23c5e$var$currentEditingUser["lastName"]}`);
        $('#editUserUsername').text(`${$e0378f4fa6d23c5e$var$currentEditingUser.username}`);
        $('#editUserDepartment').val(`${$e0378f4fa6d23c5e$var$currentEditingUser['department']}`);
        $('#editUserJobTitle').val(`${$e0378f4fa6d23c5e$var$currentEditingUser['jobTitle']}`);
        $('#editUserQualification').val(`${$e0378f4fa6d23c5e$var$currentEditingUser['qualification']}`);
        $('#userIdForUpdate').val(`${$e0378f4fa6d23c5e$var$currentEditingUser['id']}`);
        // noinspection JSUnresolvedReference
        modal.show();
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F \u043C\u043E\u0434\u0430\u043B\u044C\u043D\u043E\u0433\u043E \u043E\u043A\u043D\u0430:", error);
        showAlert("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0444\u043E\u0440\u043C\u0443 \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F", 'error');
    }
}
// Сохранение изменений
async function $e0378f4fa6d23c5e$var$saveUserChanges() {
    try {
        const formData = {
            userId: document.getElementById('userIdForUpdate').value,
            department: document.getElementById('editUserDepartment').value,
            jobTitle: document.getElementById('editUserJobTitle').value,
            qualification: document.getElementById('editUserQualification').value,
            role: document.getElementById('editUserRole').value
        };
        console.log(formData);
        const response = await fetch('/admin/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': $e0378f4fa6d23c5e$var$getCsrfToken()
            },
            body: JSON.stringify(formData)
        });
        const result = await response.json();
        console.log(result);
        if (response.ok && result.success) {
            showAlert("\u0414\u0430\u043D\u043D\u044B\u0435 \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u044B!", 'success');
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
            modal.hide();
            // Обновляем таблицу пользователей
            loadUsers();
        } else // Обработка ошибок валидации
        if (result.errors) $e0378f4fa6d23c5e$var$displayValidationErrors(result.errors);
        else showAlert(result.error || "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445", 'error');
    } catch (error) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F:", error);
        showAlert("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0438 \u0434\u0430\u043D\u043D\u044B\u0445", 'error');
    }
}
// Функция для отображения ошибок валидации
function $e0378f4fa6d23c5e$var$displayValidationErrors(errors) {
    let errorMessages = [];
    // Проходим по всем ошибкам и собираем сообщения
    for (const [field, message] of Object.entries(errors))errorMessages.push(`${$e0378f4fa6d23c5e$var$getFieldDisplayName(field)}: ${message}`);
    if (errorMessages.length > 0) showAlert("\u041E\u0448\u0438\u0431\u043A\u0438 \u0432\u0430\u043B\u0438\u0434\u0430\u0446\u0438\u0438:\n" + errorMessages.join('\n'), 'error');
}
// Функция для получения читаемого имени поля
function $e0378f4fa6d23c5e$var$getFieldDisplayName(field) {
    const fieldNames = {
        'userId': "ID \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F",
        'department': "\u041E\u0442\u0434\u0435\u043B",
        'jobTitle': "\u0414\u043E\u043B\u0436\u043D\u043E\u0441\u0442\u044C",
        'qualification': "\u041A\u0432\u0430\u043B\u0438\u0444\u0438\u043A\u0430\u0446\u0438\u044F",
        'role': "\u0420\u043E\u043B\u044C"
    };
    return fieldNames[field] || field;
}
// Функция для получения CSRF токена
function $e0378f4fa6d23c5e$var$getCsrfToken() {
    return document.querySelector('meta[name="_csrf"]')?.getAttribute('content') || '';
}
// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveUserChangesBtn').addEventListener('click', $e0378f4fa6d23c5e$var$saveUserChanges);
});
// Обновите функцию editUser в основном скрипте
function $e0378f4fa6d23c5e$var$editUser(userId) {
    $e0378f4fa6d23c5e$var$openEditUserModal(userId);
}
window.editUser = $e0378f4fa6d23c5e$var$editUser;


let $17191c1b889002bb$var$currentPageUsers = 1;
let $17191c1b889002bb$var$totalPagesUsers = 1;
let $17191c1b889002bb$var$totalItemsUsers = 0;
let $17191c1b889002bb$var$usersPerPage = 10; // Default page size
let $17191c1b889002bb$var$roleFilter = 'ALL'; // Default role filter
async function $17191c1b889002bb$var$loadUsers(page = 1, size = $17191c1b889002bb$var$usersPerPage, role = $17191c1b889002bb$var$roleFilter) {
    console.log("Refresh button clicked. Calling loadUsers."); // Added for debugging
    try {
        console.log(`\u{417}\u{430}\u{433}\u{440}\u{443}\u{437}\u{43A}\u{430} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}: \u{441}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${page}, \u{440}\u{430}\u{437}\u{43C}\u{435}\u{440} ${size}, \u{440}\u{43E}\u{43B}\u{44C} ${role}`);
        const response = await fetch(`/admin/users?page=${page}&size=${size}&role=${role}`);
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                $17191c1b889002bb$var$currentPageUsers = data.data.currentPage || page;
                $17191c1b889002bb$var$totalPagesUsers = data.data.totalPages || 1;
                $17191c1b889002bb$var$totalItemsUsers = data.data.totalItems || data.data.content.length;
                $17191c1b889002bb$var$renderUsersTable(data.data.content);
            } else throw new Error("\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u043E\u0442 \u0441\u0435\u0440\u0432\u0435\u0440\u0430");
        } else throw new Error(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.status}`);
    } catch (e) {
        console.error("\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439:", e);
        $17191c1b889002bb$var$showError("\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044C \u0434\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u0439");
    }
}
function $17191c1b889002bb$var$rowsInUserTable(size) {
    $17191c1b889002bb$var$usersPerPage = parseInt(size, 10);
    $17191c1b889002bb$var$loadUsers(1, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
}
function $17191c1b889002bb$var$filterByUserRole(role) {
    $17191c1b889002bb$var$roleFilter = role;
    $17191c1b889002bb$var$loadUsers(1, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
}
async function $17191c1b889002bb$var$deleteUsersRequest(userId) {
    try {
        const body = JSON.stringify({
            userId: userId
        });
        const deleteRequest = await fetch(`/admin/users/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        });
        const response = await deleteRequest.json();
        if (deleteRequest.ok) {
            if (response.success) {
                showAlert(response.message, 'success');
                // Перезагружаем список пользователей
                await $17191c1b889002bb$var$loadUsers($17191c1b889002bb$var$currentPageUsers, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
            } else showAlert(response.message, 'error');
        } else showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{441}\u{435}\u{440}\u{432}\u{435}\u{440}\u{430}: ${response.error || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430"}`, 'error');
    } catch (error) {
        showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430} \u{443}\u{434}\u{430}\u{43B}\u{435}\u{43D}\u{438}\u{44F}: ${error.message}`, 'error');
        console.error('Delete error:', error);
    }
}
function $17191c1b889002bb$var$renderUsersTable(users) {
    const tableContainer = document.querySelector('#users-tab .card-body');
    if (!tableContainer) {
        console.error("\u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0434\u043B\u044F \u0442\u0430\u0431\u043B\u0438\u0446\u044B \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
        return;
    }
    tableContainer.innerHTML = '';
    const tableHTML = `
    <div class="users-table-container">
        <div class="data-table users-table">
            <div class="table-header d-flex justify-content-between align-items-center">
                <h3 class="table-title">\u{421}\u{43F}\u{438}\u{441}\u{43E}\u{43A} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}</h3>
                <div class="table-header-actions d-flex align-items-center" style="gap: 1rem;">
                    <div class="input-group">
                        <span class="input-group-text"><i class="bi bi-people"></i></span>
                        <select class="form-select form-select-sm" id="roleFilter" onchange="filterByUserRole(this.value)">
                            <option value="ALL" ${$17191c1b889002bb$var$roleFilter === 'ALL' ? 'selected' : ''}>\u{412}\u{441}\u{435} \u{440}\u{43E}\u{43B}\u{438}</option>
                            <option value="USER" ${$17191c1b889002bb$var$roleFilter === 'USER' ? 'selected' : ''}>\u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44C}</option>
                            <option value="ADMIN" ${$17191c1b889002bb$var$roleFilter === 'ADMIN' ? 'selected' : ''}>\u{410}\u{434}\u{43C}\u{438}\u{43D}\u{438}\u{441}\u{442}\u{440}\u{430}\u{442}\u{43E}\u{440}</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-group-text">\u{41F}\u{43E}\u{43A}\u{430}\u{437}\u{44B}\u{432}\u{430}\u{442}\u{44C}</span>
                        <select class="form-select form-select-sm" id="pageSizeSelect" onchange="rowsInUserTable(this.value)">
                            <option value="5" ${$17191c1b889002bb$var$usersPerPage == 5 ? 'selected' : ''}>5</option>
                            <option value="10" ${$17191c1b889002bb$var$usersPerPage == 10 ? 'selected' : ''}>10</option>
                            <option value="20" ${$17191c1b889002bb$var$usersPerPage == 20 ? 'selected' : ''}>20</option>
                            <option value="50" ${$17191c1b889002bb$var$usersPerPage == 50 ? 'selected' : ''}>50</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <div class="table-content">
                <!-- \u{417}\u{430}\u{433}\u{43E}\u{43B}\u{43E}\u{432}\u{43E}\u{43A} \u{442}\u{430}\u{431}\u{43B}\u{438}\u{446}\u{44B} -->
                <div class="table-row header-row">
                    <div class="table-cell">ID</div>
                    <div class="table-cell">\u{410}\u{432}\u{430}\u{442}\u{430}\u{440}</div>
                    <div class="table-cell">\u{418}\u{43C}\u{44F}</div>
                    <div class="table-cell">\u{424}\u{430}\u{43C}\u{438}\u{43B}\u{438}\u{44F}</div>
                    <div class="table-cell">\u{41E}\u{442}\u{434}\u{435}\u{43B}</div>
                    <div class="table-cell">\u{414}\u{43E}\u{43B}\u{436}\u{43D}\u{43E}\u{441}\u{442}\u{44C}</div>
                    <div class="table-cell">\u{41A}\u{432}\u{430}\u{43B}\u{438}\u{444}\u{438}\u{43A}\u{430}\u{446}\u{438}\u{44F}</div>
                    <div class="table-cell">\u{41B}\u{43E}\u{433}\u{438}\u{43D}</div>
                    <div class="table-cell">\u{421}\u{43E}\u{437}\u{434}\u{430}\u{43D}</div>
                    <div class="table-cell">\u{420}\u{43E}\u{43B}\u{44C}</div>
                    <div class="table-cell">\u{414}\u{435}\u{439}\u{441}\u{442}\u{432}\u{438}\u{44F}</div>
                </div>
                
                ${users.length > 0 ? users.map((user)=>`
                    <div class="table-row">
                        <div class="table-cell text-muted">#${user.id || 'N/A'}</div>
                        <div class="table-cell">
                            <img src="/avatars/${user.avatar || 'avatar.png'}" alt="\u{410}\u{432}\u{430}\u{442}\u{430}\u{440}" class="user-avatar">
                        </div>
                        <div class="table-cell">${$17191c1b889002bb$var$escapeHtml(user.firstName || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E")}</div>
                        <div class="table-cell">${$17191c1b889002bb$var$escapeHtml(user.lastName || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E")}</div>
                        <div class="table-cell">${$17191c1b889002bb$var$escapeHtml(user.department || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D")}</div>
                        <div class="table-cell">${$17191c1b889002bb$var$escapeHtml(user.jobTitle || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u0430")}</div>
                        <div class="table-cell">
                            <span class="status-badge ${$17191c1b889002bb$var$getQualificationClass(user.qualification)}">
                                ${$17191c1b889002bb$var$escapeHtml(user.qualification || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u0430")}
                            </span>
                        </div>
                        <div class="table-cell">${$17191c1b889002bb$var$escapeHtml(user.username || "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D")}</div>
                        <div class="table-cell text-sm text-muted">${$17191c1b889002bb$var$formatDate(user.createdAt)}</div>
                        <div class="table-cell">${$17191c1b889002bb$var$displayRoles(user.role)}</div>
                        <div class="table-cell action-buttons justify-content-center">
                            <button class="btn btn-primary btn-icon btn-sm" title="\u{420}\u{435}\u{434}\u{430}\u{43A}\u{442}\u{438}\u{440}\u{43E}\u{432}\u{430}\u{442}\u{44C}" onclick="editUser(${user.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-danger btn-icon btn-sm" title="\u{423}\u{434}\u{430}\u{43B}\u{438}\u{442}\u{44C}" onclick="deleteUser(${user.id})">
                                <i class="bi bi-trash"></i>
                            </button>
                            <button class="btn btn-success btn-icon btn-sm" title="\u{417}\u{430}\u{43F}\u{438}\u{441}\u{430}\u{442}\u{44C} \u{43D}\u{430} \u{43A}\u{443}\u{440}\u{441}" onclick="openEnrollModal(${user.id}, '${$17191c1b889002bb$var$escapeHtml(user.firstName)} ${$17191c1b889002bb$var$escapeHtml(user.lastName)}')">
                                <i class="bi bi-plus-circle"></i>
                            </button>
                            <button class="btn btn-info btn-icon btn-sm" title="\u{41F}\u{440}\u{43E}\u{441}\u{43C}\u{43E}\u{442}\u{440} \u{43A}\u{443}\u{440}\u{441}\u{43E}\u{432}" onclick="openViewCoursesModal(${user.id}, '${$17191c1b889002bb$var$escapeHtml(user.firstName)} ${$17191c1b889002bb$var$escapeHtml(user.lastName)}')">
                                <i class="bi bi-card-list"></i>
                            </button>
                        </div>
                    </div>
                `).join('') : `
                    <div class="table-row" style="grid-template-columns: 1fr;">
                        <div class="text-center py-4 text-muted">
                            <i class="bi bi-inbox fs-3 d-block mb-2"></i>
                            \u{41F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{438} \u{43D}\u{435} \u{43D}\u{430}\u{439}\u{434}\u{435}\u{43D}\u{44B}
                        </div>
                    </div>
                `}
            </div>
        </div>
    </div>
        
    <!-- \u{41A}\u{43E}\u{43D}\u{442}\u{435}\u{439}\u{43D}\u{435}\u{440} \u{434}\u{43B}\u{44F} \u{43F}\u{430}\u{433}\u{438}\u{43D}\u{430}\u{446}\u{438}\u{438} -->
    <div class="pagination-container mt-3"></div>
    
    <!-- \u{41A}\u{43D}\u{43E}\u{43F}\u{43A}\u{430} \u{43E}\u{431}\u{43D}\u{43E}\u{432}\u{43B}\u{435}\u{43D}\u{438}\u{44F} -->
    <div class="text-center mt-3">
        <button class="btn btn-primary" onclick="refreshUsersTable()">
            <i class="bi bi-arrow-repeat"></i> \u{41E}\u{431}\u{43D}\u{43E}\u{432}\u{438}\u{442}\u{44C} \u{441}\u{43F}\u{438}\u{441}\u{43E}\u{43A}
        </button>
    </div>
    `;
    tableContainer.innerHTML = tableHTML;
    const paginationContainer = document.querySelector('#users-tab .pagination-container');
    if (!paginationContainer) {
        console.error("\u041A\u043E\u043D\u0442\u0435\u0439\u043D\u0435\u0440 \u0434\u043B\u044F \u043F\u0430\u0433\u0438\u043D\u0430\u0446\u0438\u0438 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
        return;
    }
    if ($17191c1b889002bb$var$totalPagesUsers <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    let paginationHTML = `
        <nav aria-label="Page navigation">
            <ul class="pagination justify-content-center">
                <li class="page-item ${$17191c1b889002bb$var$currentPageUsers === 1 ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${$17191c1b889002bb$var$currentPageUsers - 1}); return false;" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
    `;
    const maxVisiblePages = 5;
    let startPage = Math.max(1, $17191c1b889002bb$var$currentPageUsers - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min($17191c1b889002bb$var$totalPagesUsers, startPage + maxVisiblePages - 1);
    if (endPage - startPage + 1 < maxVisiblePages) startPage = Math.max(1, endPage - maxVisiblePages + 1);
    if (startPage > 1) paginationHTML += `
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(1); return false;">1</a>
            </li>
            ${startPage > 2 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
        `;
    for(let i = startPage; i <= endPage; i++)paginationHTML += `
            <li class="page-item ${i === $17191c1b889002bb$var$currentPageUsers ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeUsersPage(${i}); return false;">${i}</a>
            </li>
        `;
    if (endPage < $17191c1b889002bb$var$totalPagesUsers) paginationHTML += `
            ${endPage < $17191c1b889002bb$var$totalPagesUsers - 1 ? '<li class="page-item disabled"><span class="page-link">...</span></li>' : ''}
            <li class="page-item">
                <a class="page-link" href="#" onclick="changeUsersPage(${$17191c1b889002bb$var$totalPagesUsers}); return false;">${$17191c1b889002bb$var$totalPagesUsers}</a>
            </li>
        `;
    paginationHTML += `
                <li class="page-item ${$17191c1b889002bb$var$currentPageUsers === $17191c1b889002bb$var$totalPagesUsers ? 'disabled' : ''}">
                    <a class="page-link" href="#" onclick="changeUsersPage(${$17191c1b889002bb$var$currentPageUsers + 1}); return false;" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
        
        <div class="pagination-info text-center mt-2">
            <small class="text-muted">
                \u{421}\u{442}\u{440}\u{430}\u{43D}\u{438}\u{446}\u{430} ${$17191c1b889002bb$var$currentPageUsers} \u{438}\u{437} ${$17191c1b889002bb$var$totalPagesUsers} \u{2022} 
                \u{412}\u{441}\u{435}\u{433}\u{43E} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{435}\u{439}: ${$17191c1b889002bb$var$totalItemsUsers}
            </small>
        </div>
    `;
    paginationContainer.innerHTML = paginationHTML;
}
function $17191c1b889002bb$var$changeUsersPage(page) {
    if (page < 1 || page > $17191c1b889002bb$var$totalPagesUsers || page === $17191c1b889002bb$var$currentPageUsers) return;
    $17191c1b889002bb$var$loadUsers(page, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
}
// Вспомогательные функции
function $17191c1b889002bb$var$escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
function $17191c1b889002bb$var$formatDate(dateString) {
    if (!dateString) return "\u041D\u0435 \u0443\u043A\u0430\u0437\u0430\u043D\u043E";
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
function $17191c1b889002bb$var$getQualificationClass(qualification) {
    if (!qualification) return 'status-pending';
    const qual = qualification.toLowerCase();
    if (qual.includes('expert') || qual.includes('senior') || qual.includes('lead')) return 'status-completed';
    else if (qual.includes('middle') || qual.includes('intermediate')) return 'status-review';
    else if (qual.includes('junior') || qual.includes('trainee')) return 'status-pending';
    else return 'status-pending';
}
function $17191c1b889002bb$var$displayRoles(role) {
    return role === '[ROLE_USER]' ? "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C" : "\u0410\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440";
}
function $17191c1b889002bb$var$showError(message) {
    const tableContainer = document.querySelector('#users-tab .card-body');
    if (tableContainer) tableContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="fas fa-exclamation-triangle"></i>
                ${$17191c1b889002bb$var$escapeHtml(message)}
            </div>
            <div style="text-align: center; margin-top: 1rem;">
                <button class="btn btn-primary" onclick="loadUsers(1)">
                    <i class="fas fa-redo"></i> \u{41F}\u{43E}\u{43F}\u{440}\u{43E}\u{431}\u{43E}\u{432}\u{430}\u{442}\u{44C} \u{441}\u{43D}\u{43E}\u{432}\u{430}
                </button>
            </div>
        `;
}
function $17191c1b889002bb$var$deleteUser(userId) {
    if (confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u044D\u0442\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F?")) $17191c1b889002bb$var$deleteUsersRequest(userId);
}
// Функция для открытия модального окна
async function $17191c1b889002bb$var$openEnrollModal(userId, userName) {
    // 1. Устанавливаем имя и ID пользователя в модальном окне
    document.getElementById('enrollUserName').textContent = userName;
    document.getElementById('enrollUserId').value = userId;
    const courseSelect = document.getElementById('courseSelect');
    courseSelect.innerHTML = "<option>\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u0443\u0440\u0441\u043E\u0432...</option>";
    // 2. Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('enrollUserModal'));
    modal.show();
    // 3. Загружаем список курсов с бэкенда
    try {
        const response = await fetch('/admin/courses');
        const data = await response.json();
        console.log(data);
        if (data.success && data.data && data.data.content) {
            courseSelect.innerHTML = ''; // Очищаем
            if (data.data.content.length === 0) courseSelect.innerHTML = "<option>\u041D\u0435\u0442 \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0445 \u043A\u0443\u0440\u0441\u043E\u0432</option>";
            else data.data.content.forEach((course)=>{
                const option = document.createElement('option');
                option.value = course.id;
                option.textContent = course.title;
                courseSelect.appendChild(option);
            });
        }
    } catch (e) {
        courseSelect.innerHTML = "<option>\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0443\u0440\u0441\u043E\u0432</option>";
        console.error(e);
    }
}
// Функция для подтверждения и отправки запроса
async function $17191c1b889002bb$var$confirmEnrollment() {
    const userId = document.getElementById('enrollUserId').value;
    const courseId = document.getElementById('courseSelect').value;
    if (!courseId || isNaN(courseId)) {
        alert("\u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043A\u0443\u0440\u0441.");
        return;
    }
    const requestData = {
        userId: parseInt(userId),
        courseId: parseInt(courseId)
    };
    console.log("enrollment data ", requestData);
    try {
        const response = await fetch('/admin/user/enroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();
        if (response.ok && result.success) {
            showAlert(result.message);
            // Закрываем модальное окно
            const modal = bootstrap.Modal.getInstance(document.getElementById('enrollUserModal'));
            modal.hide();
        } else showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0437\u0430\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F."}`, 'error');
    } catch (e) {
        showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430", 'error');
        console.error(e);
    }
}
async function $17191c1b889002bb$var$openViewCoursesModal(userId, userName) {
    document.getElementById('viewUserName').textContent = userName;
    const userCoursesList = document.getElementById('userCoursesList');
    userCoursesList.innerHTML = '<li class="list-group-item">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u0443\u0440\u0441\u043E\u0432...</li>';
    // Сохраняем данные для перезагрузки
    userCoursesList.dataset.userId = userId;
    userCoursesList.dataset.userName = userName;
    const modal = new bootstrap.Modal(document.getElementById('viewUserCoursesModal'));
    modal.show();
    await $17191c1b889002bb$var$refreshUserCoursesList(userId, userName);
}
async function $17191c1b889002bb$var$refreshUserCoursesList(userId, userName) {
    const userCoursesList = document.getElementById('userCoursesList');
    userCoursesList.innerHTML = '<li class="list-group-item">\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043A\u0443\u0440\u0441\u043E\u0432...</li>';
    try {
        const response = await fetch(`/admin/user/${userId}/courses`);
        const data = await response.json();
        if (data.success && data.data) {
            userCoursesList.innerHTML = '';
            if (data.data.length === 0) userCoursesList.innerHTML = '<li class="list-group-item">\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u0437\u0430\u043F\u0438\u0441\u0430\u043D \u043D\u0438 \u043D\u0430 \u043E\u0434\u0438\u043D \u043A\u0443\u0440\u0441.</li>';
            else data.data.forEach((course)=>{
                const listItem = document.createElement('li');
                listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                const titleSpan = document.createElement('span');
                titleSpan.textContent = course.title;
                listItem.appendChild(titleSpan);
                const unenrollButton = document.createElement('button');
                unenrollButton.className = 'btn btn-danger btn-sm';
                unenrollButton.textContent = "\u041E\u0442\u043F\u0438\u0441\u0430\u0442\u044C";
                unenrollButton.onclick = ()=>$17191c1b889002bb$var$confirmUnenrollment(userId, userName, course.id, course.title);
                listItem.appendChild(unenrollButton);
                userCoursesList.append(listItem);
            });
        } else {
            userCoursesList.innerHTML = '<li class="list-group-item text-danger">\u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u043A\u0443\u0440\u0441\u043E\u0432.</li>';
            console.error('Failed to load user courses:', data.error);
        }
    } catch (e) {
        userCoursesList.innerHTML = '<li class="list-group-item text-danger">\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430.</li>';
        console.error('Network error loading user courses:', e);
    }
}
function $17191c1b889002bb$var$confirmUnenrollment(userId, userName, courseId, courseTitle) {
    const message = `\u{412}\u{44B} \u{443}\u{432}\u{435}\u{440}\u{435}\u{43D}\u{44B}, \u{447}\u{442}\u{43E} \u{445}\u{43E}\u{442}\u{438}\u{442}\u{435} \u{43E}\u{442}\u{43F}\u{438}\u{441}\u{430}\u{442}\u{44C} \u{43F}\u{43E}\u{43B}\u{44C}\u{437}\u{43E}\u{432}\u{430}\u{442}\u{435}\u{43B}\u{44F} "${userName}" \u{43E}\u{442} \u{43A}\u{443}\u{440}\u{441}\u{430} "${courseTitle}"?`;
    if (confirm(message)) $17191c1b889002bb$var$unenrollRequest(userId, courseId, userName);
}
async function $17191c1b889002bb$var$unenrollRequest(userId, courseId, userName) {
    const requestData = {
        userId: userId,
        courseId: courseId
    };
    try {
        const response = await fetch('/admin/user/unenroll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        });
        const result = await response.json();
        if (response.ok && result.success) {
            alert(result.message);
            // Обновляем список курсов в модальном окне
            await $17191c1b889002bb$var$refreshUserCoursesList(userId, userName);
        } else showAlert(`\u{41E}\u{448}\u{438}\u{431}\u{43A}\u{430}: ${result.message || "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043F\u0438\u0441\u0430\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F."}`, 'error');
    } catch (e) {
        showAlert("\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430", 'error');
        console.error(e);
    }
}
// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Загружаем пользователей при загрузке страницы
    const usersTab = document.getElementById('users-tab');
    if (usersTab) $17191c1b889002bb$var$loadUsers(1, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
});
// Expose functions to global scope for onclick attributes
window.loadUsers = $17191c1b889002bb$var$loadUsers;
window.deleteUser = $17191c1b889002bb$var$deleteUser;
window.openEnrollModal = $17191c1b889002bb$var$openEnrollModal;
window.confirmEnrollment = $17191c1b889002bb$var$confirmEnrollment;
window.openViewCoursesModal = $17191c1b889002bb$var$openViewCoursesModal;
window.confirmUnenrollment = $17191c1b889002bb$var$confirmUnenrollment;
window.unenrollRequest = $17191c1b889002bb$var$unenrollRequest;
window.changeUsersPage = $17191c1b889002bb$var$changeUsersPage;
window.currentPageUsers = $17191c1b889002bb$var$currentPageUsers;
window.rowsInUserTable = $17191c1b889002bb$var$rowsInUserTable;
window.filterByUserRole = $17191c1b889002bb$var$filterByUserRole;
window.refreshUsersTable = function() {
    $17191c1b889002bb$var$loadUsers($17191c1b889002bb$var$currentPageUsers, $17191c1b889002bb$var$usersPerPage, $17191c1b889002bb$var$roleFilter);
};




//# sourceMappingURL=index.js.map
