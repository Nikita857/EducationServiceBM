<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="_csrf" content="${_csrf.token}"/>
    <meta name="_csrf_header" content="${_csrf.headerName}"/>
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="css/indexPage.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <title>Курсы обучения</title>
</head>
<body>
<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>

<div class="container hero-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
                <h1 class="display-5 fw-bold mb-3">Добро пожаловать в BM Education</h1>
                <p class="lead mb-4">Изучайте новое и повышайте свою квалификацию</p>

                <div class="search-container">
                    <div class="input-group">
                        <input type="text" class="form-control search-input" placeholder="Поиск курсов..." aria-label="Поиск курсов">
                        <button class="btn btn-primary" type="button">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="container main-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 fw-bold">Ваши программы обучения</h2>
        <span class="badge bg-primary rounded-pill">${courses?size} курсов</span>
    </div>

    <#if courses?has_content>
        <div class="course-grid">
            <#list courses as course>
                <div class="course-card">
                    <img src="img/course-brand/${course.image}" class="course-image" alt="${course.title}">
                    <div class="course-content">
                        <h3 class="course-title">${course.title}</h3>
                        <p class="course-description">${course.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <a class="btn btn-primary" href="/course/${course.slug}">
                                Начать обучение <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                            <div class="progress" style="width: 60px; height: 6px;">
                                <div class="progress-bar" role="progressbar" style="width: 25%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </#list>
        </div>
    <#else>
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="bi bi-book"></i>
            </div>
            <h3 class="h4 mb-3">Курсы не найдены</h3>
            <p class="text-muted mb-4">Вы еще не записаны ни на один курс. Изучите наш каталог и начните обучение!</p>
            <a href="/catalog" class="btn btn-primary">
                <i class="bi bi-search me-2"></i> Найти курсы
            </a>
        </div>
    </#if>
</div>
<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
<script type="module" src="${springMacroRequestContext.contextPath}/webjars/github-com-popperjs-popper-core/2.4.0/popper.js"></script>
<script src="${springMacroRequestContext.contextPath}/webjars/jquery/3.7.1/jquery.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/indexPage.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/main.js"></script>
<script src="${springMacroRequestContext.contextPath}/js/custom-alert.js"></script>
</body>
</html>