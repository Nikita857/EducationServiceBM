<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Личный кабинет</title>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${staticHost}/css/header.css">
    <link rel="stylesheet" href="${staticHost}/css/cabinet.css">
    <link rel="stylesheet" href="${staticHost}/css/custom-alert.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
</head>
<body style="background-color: #0f172a; color: #e2e8f0; min-height: 100vh">
<style>
    :root{
        --card-bg: #1e293b;
    }
    .modal-content {
        background: var(--card-bg);
        border: none;
        border-radius: 20px;
        box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
        background: var(--primary-gradient);
        border-bottom: none;
        padding: 1.5rem 2rem;
        border-radius: 20px 20px 0 0;
    }

    .modal-title {
        color: white;
        font-weight: 700;
    }

    .form-control {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        border-radius: 12px;
        color: #e2e8f0;
        padding: 0.875rem 1.25rem;
    }

    .form-control:focus {
        background: rgba(255, 255, 255, 0.12);
        border-color: #6366f1;
        box-shadow: 0 0 0 0.25rem rgba(99, 102, 241, 0.25);
    }

    textarea.form-control {
        min-height: 120px;
        resize: vertical;
    }
</style>
<div class="container mb-5">
    <#include "layouts/header.ftlh">
</div>
<div class="container py-5">
    <div class="row">
        <!-- Боковая панель с информацией о пользователе -->
        <div class="col-lg-4 mb-4">
            <div class="card shadow-sm bg-transparent">
                <div class="card-body text-center">
                    <!-- Аватар и форма загрузки -->
                    <div class="avatar-container mb-3">
                        <img src="/avatars/${user.avatar}" alt="Аватар" class="avatar rounded-circle" id="userAvatar">
                        <span class="status-badge-profile">
<span class="badge" style="background: linear-gradient(135deg, #6366f1, #8b5cf6);">Онлайн</span>
</span>
                    </div>

                    <form id="avatarUploadForm" action="/profile/avatar/upload" method="post"
                          enctype="multipart/form-data">
                        <div class="mb-3">
                            <input type="file" class="form-control" id="avatarInput" name="avatar"
                                   accept="image/jpeg,image/png,image/gif,image/webp" style="display: none;">
                            <button type="button" class="btn btn-outline-primary btn-sm"
                                    onclick="document.getElementById('avatarInput').click()">
                                <i class="bi bi-camera"></i> Сменить аватар
                            </button>
                            <div class="form-text">Разрешены JPG, PNG, GIF, WebP до 10MB</div>
                        </div>
                        <button type="submit" class="btn btn-primary btn-sm">
                            <i class="bi bi-upload"></i> Загрузить
                        </button>
                    </form>

                    <hr>

                    <!-- Информация о пользователе -->
                    <h5 class="card-title">${user.firstName} ${user.lastName}</h5>
                    <p class="text-muted mb-1">Отдел: ${user.department}</p>
                    <p class="text-muted">Должность: ${user.jobTitle}</p>
                    <p class="text-muted">Квалификация: ${user.qualification}</p>

                    <div class="d-grid gap-2 mb-3">
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#changePasswordModal">
                            <i class="bi bi-lock"></i> Сменить пароль
                        </button>
                    </div>
                    <div class="d-grid gap-2">
                        <a href="/" class="btn btn-primary">
                            Личное дело сотрудника
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Основной контент -->
        <div class="col-lg-8">
            <!-- Заявки пользователя -->
            <div class="card shadow-sm mb-4 bg-transparent">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-list-check"></i> Мои заявки</h5>
                </div>
                <div class="card-body">
                    <div class="offers-container">
                        <#if userOffers?has_content>
                            <div class="offers-header">
                                <h3 class="offers-title">Мои заявки</h3>
                                <span class="offers-count">${userOffers?size} заявок</span>
                            </div>

                            <div class="offers-table">
                                <div class="table-header">
                                    <div class="table-row header-row">
                                        <div class="table-cell">Название заявки</div>
                                        <div class="table-cell">Дата подачи</div>
                                        <div class="table-cell">Статус</div>
                                        <div class="table-cell">Действия</div>
                                    </div>
                                </div>

                                <div class="table-body">
                                    <#list userOffers as offer>
                                        <div class="table-row offer-row" data-offer-id="${offer.id}">
                                            <div class="table-cell">
                                                <div class="offer-title">
                                                    <i class="bi bi-journal-text"></i>
                                                    ${offer.topic}
                                                </div>
                                            </div>

                                            <div class="table-cell">
                                                <div class="offer-date">
                                                    ${offer.createdAt}
                                                    <span class="offer-time">
                                                        ${offer.createdAt}
                                        <#--   ?datetime("yyyy-MM-dd HH:mm:ss")?string("HH:mm")-->
                                                    </span>
                                                </div>
                                            </div>

                                            <div class="table-cell">
                                                <#if offer.status == "PENDING">
                                                    <span class="status-badge status-pending">
                                                    <i class="bi bi-clock"></i>
                                                    Ожидает рассмотрение
                                                </span>
                                                <#elseif offer.status == "REJECTED">
                                                    <span class="status-badge status-rejected">
                                                    <i class="bi bi-x-circle"></i>
                                                    Отклонена
                                                </span>
                                                <#else>
                                                    <span class="status-badge status-completed">
                                                    <i class="bi bi-check-circle"></i>
                                                    Принята
                                                </span>
                                                </#if>
                                            </div>

                                            <div class="table-cell">
                                                <button class="btn-view-offer" data-bs-toggle="modal"
                                                        data-bs-target="#offerModal${offer.id}">
                                                    <i class="bi bi-eye"></i>
                                                    Просмотр
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Modal for offer details -->
                                        <div class="modal fade" id="offerModal${offer.id}" tabindex="-1"
                                             aria-hidden="true">
                                            <div class="modal-dialog modal-lg">
                                                <div class="modal-content">
                                                    <div class="modal-header">
                                                        <h5 class="modal-title">
                                                            <i class="bi bi-journal-text me-2"></i>
                                                            Заявка: ${offer.topic}
                                                        </h5>
                                                        <button type="button" class="btn-close btn-close-white"
                                                                data-bs-dismiss="modal" aria-label="Close"></button>
                                                    </div>
                                                    <div class="modal-body">
                                                        <div class="offer-details">
                                                            <div class="detail-row">
                                                                <span class="detail-label">Тема:</span>
                                                                <span class="detail-value">${offer.topic}</span>
                                                            </div>
                                                            <div class="detail-row">
                                                                <span class="detail-label">Дата подачи:</span>
                                                                <span class="detail-value">${offer.createdAt}</span>
                                                            </div>
                                                            <div class="detail-row">
                                                                <span class="detail-label">Статус:</span>
                                                                <span class="detail-value">
                                                                <#if offer.status == "PENDING">
                                                                    <span class="status-badge status-pending">Ожидает рассмотрения</span>
                                                                <#elseif offer.status == "REJECTED">
                                                                    <span class="status-badge status-rejected">Отклонена</span>
                                                                <#else>
                                                                    <span class="status-badge status-completed">Принята</span>
                                                                </#if>
                                                            </span>
                                                            </div>
                                                            <div class="detail-row full-width">
                                                                <span class="detail-label">Описание:</span>
                                                                <div class="detail-value description">
                                                                    ${offer.description}
                                                                </div>
                                                            </div>

                                                            <#if offer.response?has_content>
                                                                <div class="detail-row full-width">
                                                                    <span class="detail-label">Ответ администратора:</span>
                                                                    <div class="detail-value description">
                                                                        ${offer.response}
                                                                    </div>
                                                                </div>
                                                            </#if>
                                                        </div>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-secondary"
                                                                data-bs-dismiss="modal">
                                                            <i class="bi bi-x-circle me-2"></i>Закрыть
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </#list>
                                </div>
                            </div>
                        <#else>
                            <div class="empty-state">
                                <div class="empty-icon">
                                    <i class="bi bi-inbox"></i>
                                </div>
                                <h4>Заявки не найдены</h4>
                                <p>Вы еще не отправляли ни одной заявки. Создайте первую заявку!</p>
                                <button class="btn btn-primary" id="newOffer" data-bs-toggle="modal" data-bs-target="offerModal">
                                    <i class="bi bi-plus-circle me-2"></i>Создать заявку
                                </button>
                            </div>
                        </#if>
                    </div>
                </div>
            </div>

            <!-- Доступные курсы -->
            <div class="card shadow-sm bg-transparent">
                <div class="card-header">
                    <h5 class="mb-0"><i class="bi bi-book"></i> Доступные курсы</h5>
                </div>
                <div class="card-body">
                    <div class="row">
                        <#if availableCourses?has_content>
                            <#list availableCourses as course>
                                <div class="col-md-6 mb-3">
                                    <div class="course-card">
                                        <div class="course-content">
                                            <h3 class="course-title">${course.title}</h3>
                                            <p class="course-description">${course.description}</p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <a class="btn btn-primary" href="/course/${course.slug}">
                                                    Начать обучение <i class="bi bi-arrow-right ms-1"></i>
                                                </a>
                                                <div class="progress" style="width: 60px; height: 6px;">
                                                    <div class="progress-bar" role="progressbar" style="width: ${course.progress}%;"
                                                         aria-valuenow="${course.progress}" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </#list>
                        <#else>
                            <p class="text-center">У вас нет доступных курсов</p>
                        </#if>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- Модальное окно смены пароля -->
<div class="modal fade" id="changePasswordModal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><i class="bi bi-lock"></i> Смена пароля</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="passwordChangeForm">
                    <div class="mb-3">
                        <label for="currentPassword" class="form-label">Текущий пароль</label>
                        <input type="password" class="form-control" id="currentPassword" required>
                    </div>
                    <div class="mb-3">
                        <label for="newPassword" class="form-label">Новый пароль</label>
                        <input type="password" class="form-control" id="newPassword" required>
                        <div class="form-text">Минимум 6 символов, должны быть буквы и цифры</div>
                    </div>
                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Подтвердите новый пароль</label>
                        <input type="password" class="form-control" id="confirmPassword" required>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Отмена</button>
                        <button type="button" form="passwordChangeForm" class="btn btn-primary"
                                onclick="submitPasswordChange()">Сменить пароль
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<#--Модальное окно отправки заявок-->
<div class="modal fade" id="offerModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-lightbulb me-2"></i>Форма обратной связи
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Close"></button>
            </div>

            <form id="sendOffer">
                <div class="modal-body">
                    <input type="hidden" name="userId" value="${user.id}">

                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Тема заявки</label>
                            <input type="text" name="topic" class="form-control"
                                   placeholder="Введите тему заявки" required>
                        </div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Опишите ваше предложение</label>
                        <textarea name="description" class="form-control"
                                  placeholder="Напишите подробное описание вашего предложения..."
                                  minlength="50" maxlength="2000" rows="5" required></textarea>
                        <div class="form-text">Минимум 50 символов</div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-send me-2"></i>Отправить
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
<script src="${staticHost}/js/changePassword.js"></script>
<script src="${staticHost}/js/formCatcher.js"></script>
<script>
    document.getElementById('newOffer').onclick = function () {
        $('#offerModal').modal('show');
    };
</script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
// Анимация строк таблицы
        const offerRows = document.querySelectorAll('.offer-row');
        offerRows.forEach((row, index) => {
            row.style.opacity = '0';
            row.style.transform = 'translateX(-20px)';
            setTimeout(() => {
                row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                row.style.opacity = '1';
                row.style.transform = 'translateX(0)';
            }, index * 100);
        });

// Обработка модальных окон
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.addEventListener('show.bs.modal', function () {
// Дополнительная логика при открытии модального окна
            });
        });
    });
</script>
</body>
</html>