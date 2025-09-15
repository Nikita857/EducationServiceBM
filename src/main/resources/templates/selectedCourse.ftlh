<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/header.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/selectedCourse.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/custom-alert.css">
    <title>Какой то курс</title>
</head>
<body>
<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>
<!-- Hero Section -->
<div class="container course-hero">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-6">
                <img src="${springMacroRequestContext.contextPath}/img/course-brand/${selectedCourseData.image}"
                     alt="${selectedCourseData.title}" class="course-image">
            </div>
            <div class="col-lg-6 mt-4 mt-lg-0">
                <h1 class="display-5 fw-bold text-white mb-3">${selectedCourseData.title}</h1>
                <p class="lead text-white-50">Освойте новые навыки и достигните своих целей</p>
            </div>
        </div>
    </div>
</div>

<!-- Main Content -->
<div class="container">
    <div class="row">
        <!-- Left Column -->
        <div class="col-lg-6">
            <div class="course-description">
                <h4 class="mb-3">О курсе</h4>
                <p class="mb-0">${selectedCourseData.description}</p>
            </div>

            <div class="stats-card">
                <h5 class="mb-4">Ваш прогресс</h5>

                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">${completedLessons}/${totalLessons}</div>
                        <div class="stat-label">Тем пройдено</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">${completedLessons}/10</div>
                        <div class="stat-label">Тестов пройдено</div>
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-bar" role="progressbar"
                         style="width: ${percentageOfLearning}%;"
                         aria-valuenow="${percentageOfLearning}"
                         aria-valuemin="0"
                         aria-valuemax="100">
                        <span class="progress-text">${percentageOfLearning}%</span>
                    </div>
                </div>

                <#if percentageOfLearning == 80>
                    <div class="achievement-badge">
                        <i class="bi bi-trophy"></i>
                        Отличный прогресс!
                    </div>
                </#if>
            </div>

            <div class="support-card">
                <div class="module-icon">
                    <i class="bi bi-chat-dots"></i>
                </div>
                <h5 class="mb-3">Нужна помощь?</h5>
                <p class="text-muted mb-3">Не нашли нужную информацию? Свяжитесь с нами</p>
                <button class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#offerModal">
                    <i class="bi bi-lightbulb me-2"></i>Отправить предложение
                </button>
            </div>
        </div>

        <!-- Right Column -->
        <div class="col-lg-6">
            <div class="module-container">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">Модули курса</h4>
                    <span class="badge bg-primary rounded-pill">${modules?size} модулей</span>
                </div>

                <div class="module-list">
                    <#list modules as module>
                        <a href="/course/${selectedCourseData.slug}/module/${module.moduleTitle}" class="module-btn">
                            <h6 class="module-title">${module.moduleSlug}</h6>
                            <small class="text-muted">Модуль ${module?index + 1}</small>
                        </a>
                    </#list>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Modal -->
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
                            <label class="form-label">Тема</label>
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
<script src="${springMacroRequestContext.contextPath}/js/formCatcher.js"></script>
<script>
    document.getElementById('openModalBtn').onclick = function () {
        $('#myModal').modal('show');
    };
</script>
<script>
    // Анимация прогресс-бара
    document.addEventListener('DOMContentLoaded', function () {
        const progressBar = document.querySelector('.progress-bar');
        const progressValue = progressBar.style.width;

        // Сбрасываем ширину для анимации
        progressBar.style.width = '0%';

        // Запускаем анимацию
        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-in-out';
            progressBar.style.width = progressValue;
        }, 500);

        // Обработка формы
        document.getElementById('sendOffer').addEventListener('submit', function (e) {
            e.preventDefault();
            // Здесь будет код отправки формы
            alert('Ваше предложение отправлено!');
            bootstrap.Modal.getInstance(document.getElementById('offerModal')).hide();
        });
    });
</script>
</body>
</html>