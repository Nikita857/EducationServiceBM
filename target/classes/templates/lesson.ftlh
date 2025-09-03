<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <meta name="_csrf" content=""${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>

    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/lessonPage.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/css/header.css">

    <title>Урок ${moduleData.id}.${lessonData.id} ${lessonData.title}</title>
</head>
<body>
<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>
<!-- Header Section -->
<div class="container lesson-header">
    <div class="container ms-2">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a class="text-light text-decoration-underline" href="/">Главная</a></li>
                <li class="breadcrumb-item"><a class="text-light text-decoration-underline" href="/course/${selectedCourseSlug.slug}">${selectedCourseSlug.title}/</a></li>
                <li class="breadcrumb-item"><a class="text-light text-decoration-underline" href="/course/${selectedCourseSlug.slug}/module/${moduleData.slug}">${moduleData.title}/</a></li>
                <li class="breadcrumb-item active text-light">${lessonData.title}</li>
            </ol>
        </nav>

        <div class="row align-items-center">
            <div class="col-lg-8">
                <h1 class="display-5 fw-bold text-white mb-2">Урок ${lessonData.id}</h1>
                <h2 class="h3 text-white-50">${lessonData.title}</h2>
            </div>
        </div>
    </div>
</div>

<!-- Main Content -->
<div class="container">
    <!-- Video Section -->
    <div class="video-container">
        <video controls autoplay name="media">
            <source src="${springMacroRequestContext.contextPath}/videos/1.mp4">
        </video>
    </div>

    <!-- Lesson Description -->
    <div class="lesson-content">
        <h4 class="mb-3">Описание урока</h4>
        <div class="lesson-description">
            ${lessonData.description?no_esc}
        </div>
    </div>

    <!-- Action Cards -->
    <div class="action-cards">
        <!-- Test Card -->
        <div class="action-card">
            <div class="action-icon">
                <i class="bi bi-patch-question"></i>
            </div>
            <h5 class="mb-3">Проверка знаний</h5>
            <p class="text-muted mb-3">Пройдите тест для закрепления материала</p>
            <button class="btn btn-primary" onclick="startQuiz(questions);">
                <i class="bi bi-play-circle me-2"></i>Пройти тест
            </button>
        </div>

        <!-- Navigation Card -->
        <div class="action-card">
            <div class="action-icon">
                <i class="bi bi-journals"></i>
            </div>
            <h5 class="mb-3">Навигация по урокам</h5>
            <p class="text-muted mb-3">Перейдите к другому уроку модуля</p>
            <div class="dropdown">
                <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                    <i class="bi bi-list me-2"></i>Выбрать урок
                </button>
                <ul class="dropdown-menu">
                    <#list lessonIds as ids>
                        <li class="lessonNav">
                            <a class="dropdown-item text-dark" href="/course/${selectedCourseSlug.slug}/module/${moduleData.slug}/lesson/${ids.id}">
                                <i class="bi bi-play-circle me-2"></i>
                                Урок ${ids.id}: ${ids.title}
                            </a>
                        </li>
                    </#list>
                </ul>
            </div>
        </div>
    </div>
</div>

<!-- Quiz Modal -->
<div class="modal fade" id="quizModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-patch-question me-2"></i>
                    Тест по теме: "${lessonData.title}"
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <div class="modal-body" id="quizContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <span class="text-muted" id="questionCounter">Вопрос 1 из 10</span>
                    <span class="badge bg-primary rounded-pill" id="score">0 баллов</span>
                </div>

                <div class="progress-container mb-4">
                    <div class="progress-bar" id="quizProgress" style="width: 0%"></div>
                </div>

                <h4 class="quiz-question mb-4" id="question"></h4>
                <div id="answers" class="d-grid gap-2"></div>
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                    <i class="bi bi-x-circle me-2"></i>Закрыть
                </button>
                <button type="button" class="btn btn-primary" id="nextQuestion" style="display: none;">
                    <i class="bi bi-arrow-right me-2"></i>Следующий вопрос
                </button>
            </div>
        </div>
    </div>
</div>

<!-- Hidden inputs -->
<input type="hidden" id="userId" value="${user.id}">
<input type="hidden" id="lessonId" value="${lessonData.id}">
<input type="hidden" id="moduleId" value="${moduleData.id}">
<input type="hidden" id="courseId" value="${courseData.id}">


<script>${lessonData.testCode?no_esc}</script>
<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/github-com-popperjs-popper-core/2.4.0/popper.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/jquery/3.7.1/jquery.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/modalTest.js"></script>
<script>
    // Анимация элементов при загрузке
    document.addEventListener('DOMContentLoaded', function() {
        // Анимация карточек действий
        const actionCards = document.querySelectorAll('.action-card');
        actionCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });

        // Анимация контента урока
        const lessonContent = document.querySelector('.lesson-content');
        lessonContent.style.opacity = '0';
        setTimeout(() => {
            lessonContent.style.transition = 'opacity 0.8s ease';
            lessonContent.style.opacity = '1';
        }, 300);
    });
</script>
</body>
</html>