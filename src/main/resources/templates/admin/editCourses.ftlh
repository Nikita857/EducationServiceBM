<!-- Фильтры и поиск -->
<div class="card mb-4">
    <div class="card-body">
        <div class="row g-3">
            <div class="col-md-6">
                <div class="input-group">
                            <span class="input-group-text">
                                <i class="bi bi-search"></i>
                            </span>
                    <input type="text" class="form-control" placeholder="Поиск по названию..." id="courseSearch">
                </div>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="categoryFilter">
                    <option value="">Все категории</option>
                    <option value="programming">Программирование</option>
                    <option value="design">Дизайн</option>
                    <option value="marketing">Маркетинг</option>
                    <option value="business">Бизнес</option>
                    <option value="language">Языки</option>
                </select>
            </div>
            <div class="col-md-3">
                <select class="form-select" id="statusFilter">
                    <option value="">Все статусы</option>
                    <option value="published">Опубликован</option>
                    <option value="draft">Черновик</option>
                    <option value="archived">В архиве</option>
                </select>
            </div>
        </div>
    </div>
</div>

<!-- Таблица курсов -->
<div class="card">
    <div class="card-body p-0">
        <div class="table-responsive">
            <table class="table table-hover table-courses mb-0">
                <thead class="table-dark">
                <tr>
                    <th style="width: 60px">
                        <input type="checkbox" class="form-check-input" id="selectAll">
                    </th>
                    <th>ID</th>
                    <th>Название курса</th>
                    <th>Описание</th>>
                    <th>Статус</th>
                    <th>Дата создания</th>
                    <th>Операции</th>
                </tr>
                </thead>
                <tbody>
                <#if courses?has_content>
                    <#list courses as course>
                        <tr data-course-id="${course.id}" class="course-row">
                            <td>
                                <input type="checkbox" class="form-check-input course-checkbox"
                                       data-course-id="${course.id}">
                            </td>
                            <td>
                                <span class="text-muted">#${course.id}</span>
                            </td>
                            <td>
                                <div class="d-flex align-items-center">
                                    <div class="course-image me-3">
                                        <#if course.image??>
                                            <img src="img/${course.image}" alt="${course.title}"
                                                 class="rounded" width="40" height="40">
                                        <#else>
                                            <div class="bg-secondary rounded d-flex align-items-center justify-content-center"
                                                 style="width: 40px; height: 40px;">
                                                <i class="bi bi-image text-light"></i>
                                            </div>
                                        </#if>
                                    </div>
                                    <div>
                                        <div class="course-title fw-medium"
                                             contenteditable="true"
                                             data-field="title"
                                             data-course-id="${course.id}">
                                            ${course.title}
                                        </div>
                                        <div class="text-muted small course-slug"
                                             contenteditable="true"
                                             data-field="slug"
                                             data-course-id="${course.id}">
                                            /course/${course.slug}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span class="text-light">${course.description}</span>
                            </td>
                            <td>
                                <span class="text-muted small">${course.createdAt}</span>
                            </td>
                            <td>
                                <span class="text-muted small">
                                    <#if course.status == "ACTIVE">
                                    Активен
                                    <#elseif course.status == "INACTIVE">
                                    Неактивен
                                    <#else>
                                    В архиве
                                    </#if>
                                </span>
                            </td>
                            <td>
                                <div class="d-flex justify-content-center gap-1">
                                    <button class="btn btn-sm btn-outline-primary btn-edit"
                                            data-course-id="${course.id}"
                                            title="Полное редактирование">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger btn-delete"
                                            data-course-id="${course.id}"
                                            title="Удалить курс">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </#list>
                <#else>
                    <tr>
                        <td colspan="9" class="text-center py-4">
                            <i class="bi bi-inbox display-4 text-muted"></i>
                            <p class="mt-2 text-muted">Курсы не найдены</p>
                            <button class="btn btn-primary mt-2" onclick="showAddCourseForm()">
                                <i class="bi bi-plus-circle me-1"></i>Создать первый курс
                            </button>
                        </td>
                    </tr>
                </#if>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Пагинация и массовые действия -->
<#if courses?has_content>
    <div class="d-flex justify-content-between align-items-center mt-3">
        <div class="mass-actions">
            <select class="form-select form-select-sm d-inline-block" style="width: 150px;" id="massAction">
                <option value="">Массовые действия</option>
                <option value="publish">Опубликовать</option>
                <option value="unpublish">Снять с публикации</option>
                <option value="archive">В архив</option>
                <option value="delete">Удалить</option>
            </select>
            <button class="btn btn-sm btn-outline-secondary ms-2" id="applyMassAction">
                Применить
            </button>
        </div>

        <nav>
            <ul class="pagination mb-0">
                <li class="page-item disabled">
                    <a class="page-link" href="#">
                        <i class="bi bi-chevron-left"></i>
                    </a>
                </li>
                <li class="page-item active"><a class="page-link" href="#">1</a></li>
                <li class="page-item"><a class="page-link" href="#">2</a></li>
                <li class="page-item"><a class="page-link" href="#">3</a></li>
                <li class="page-item">
                    <a class="page-link" href="#">
                        <i class="bi bi-chevron-right"></i>
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</#if>