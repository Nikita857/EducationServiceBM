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
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/custom-alert.css">
    <style>
        .tooltip-css {
          position: relative;
        }

        .tooltip-css[data-tooltip]::before,
        .tooltip-css[data-tooltip]::after {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease;
          pointer-events: none;
          z-index: 1000;
        }

        .tooltip-css[data-tooltip]::before {
          content: attr(data-tooltip);
          background-color: #212529; /* Dark color */
          color: #fff;
          padding: 6px 12px;
          border-radius: .375rem; /* Bootstrap's border-radius */
          font-size: 0.875em;
          white-space: nowrap;
          bottom: 130%;
        }

        .tooltip-css[data-tooltip]::after {
          content: '';
          border: 6px solid transparent;
          border-top-color: #212529;
          bottom: calc(130% - 6px);
        }

        .tooltip-css[data-tooltip]:hover::before,
        .tooltip-css[data-tooltip]:hover::after {
          opacity: 1;
          visibility: visible;
        }
    </style>
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
        <#-- First, find the index of the first uncompleted lesson -->
        <#assign firstUncompletedIndex = -1>
        <#list moduleLessons as lesson>
            <#if lesson.completed != 1 && firstUncompletedIndex == -1>
                <#assign firstUncompletedIndex = lesson_index>
            </#if>
        </#list>

        <#-- Now, loop through and render, using the index to lock lessons -->
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

                <#if firstUncompletedIndex == -1 || lesson_index <= firstUncompletedIndex>
                    <#-- This lesson is UNLOCKED -->
                    <a href="/course/${selectedCourseData.slug}/module/${selectedModuleData.slug}/lesson/${lesson.id}"
                       class="btn btn-primary">
                        <i class="bi bi-play-circle me-2"></i>Начать урок
                    </a>
                <#else>
                    <#-- This lesson is LOCKED -->
                    <span class="btn btn-primary disabled tooltip-css" data-tooltip="Этот урок заблокирован, сначала пройдите предыдущий">
                        <i class="bi bi-lock-fill me-2"></i>Начать урок
                    </span>
                </#if>

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


</body>
</html>