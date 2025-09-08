<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/header.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/tasklist.css">
    <title>Курсы обучения</title>
</head>
<body>
<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>
<!-- Header Section -->
<div class="container module-header">
    <div class="container">
        <nav aria-label="breadcrumb ms-2">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a class="text-light text-decoration-underline" href="/">Главная</a></li>
                <li class="breadcrumb-item"><a class="text-light text-decoration-underline" href="/course/${selectedCourseData.slug}">${selectedCourseData.title}</a>
                </li>
                <li class="breadcrumb-item active text-light">${selectedModuleData.title}</li>
            </ol>
        </nav>

        <div class="row align-items-center ms-2">
            <div class="col-lg-8">
                <h1 class="display-5 fw-bold text-white mb-2">Уроки модуля</h1>
                <h2 class="h3 text-white-50">${selectedModuleData.title}</h2>
            </div>
            <div class="col-lg-4 text-lg-end">
                <div class="module-progress">
                    <h6 class="mb-2">Прогресс модуля</h6>
                    <div class="progress progress-container" aria-valuenow="${(moduleLessons?filter(lesson -> lesson.completed == 1)?size / moduleLessons?size) * 100}%" aria-valuemin="0" aria-valuemax="100">
                        <div class="progress-bar" style="width: ${(moduleLessons?filter(lesson -> lesson.completed == 1)?size / moduleLessons?size) * 100}%"></div>
                    </div>
                    <small class="text-muted">
                        ${moduleLessons?filter(lesson -> lesson.completed == 1)?size} из ${moduleLessons?size} уроков
                        завершено
                    </small>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Lessons Content -->
<div class="container">
    <div class="lessons-grid">
        <#list moduleLessons as lesson>
            <div class="lesson-card">
                <#if lesson.completed == 1>
                    <span class="completed-badge">
                            <i class="bi bi-check-circle me-1"></i>Завершено
                        </span>
                </#if>

                <div class="lesson-number">${lesson_index + 1}</div>

                <h3 class="lesson-title">${lesson.title}</h3>

                <p class="lesson-description">${lesson.shortDescription}</p>

                <a href="/course/${selectedCourseData.slug}/module/${selectedModuleData.slug}/lesson/${lesson.id}"
                   class="btn btn-primary">
                    <i class="bi bi-play-circle me-2"></i>Начать урок
                </a>

                <div class="lesson-status">
                    <#if lesson.completed == 1>
                        <div>
                                <span class="status-completed">
                                    <span class="checkmark"></span>
                                    Урок пройден
                                </span>
                            <div class="completed-date">${lesson.formattedCompletedDate}</div>
                        </div>
                        <i class="bi bi-check-circle-fill text-success"></i>
                    <#else>
                        <span class="status-pending">
                                <i class="bi bi-clock-history me-1"></i>Ожидает изучения
                            </span>
                        <i class="bi bi-dash-circle text-warning"></i>
                    </#if>
                </div>
            </div>
        </#list>
    </div>

    <#if moduleLessons?size == 0>
        <div class="text-center py-5">
            <div class="empty-state-icon mb-4">
                <i class="bi bi-journal-x" style="font-size: 4rem; color: #475569;"></i>
            </div>
            <h3 class="h4 mb-3">Уроки не найдены</h3>
            <p class="text-muted mb-4">В этом модуле пока нет доступных уроков.</p>
        </div>
    </#if>
</div>

<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/github-com-popperjs-popper-core/2.4.0/popper.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/jquery/3.7.1/jquery.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function () {
        // Анимация карточек при загрузке
        const lessonCards = document.querySelectorAll('.lesson-card');
        lessonCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Анимация прогресс-бара
        const progressBar = document.querySelector('.progress-bar');
        const progressValue = progressBar.style.width;
        progressBar.style.width = '0%';

        setTimeout(() => {
            progressBar.style.transition = 'width 1.5s ease-in-out';
            progressBar.style.width = progressValue;
        }, 500);
    });
</script>
<script src="${springMacroRequestContext.contextPath}/js/custom-alert.js"></script>
</body>
</html>