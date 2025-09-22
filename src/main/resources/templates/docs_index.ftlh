<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="css/indexPage.css">
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <title>Документация</title>
</head>
<body>
<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>

<div class="container hero-section">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-lg-8 mx-auto text-center">
                <h1 class="display-5 fw-bold mb-3">База знаний</h1>
                <p class="lead mb-4">Найдите нужную информацию и ответы на ваши вопросы</p>

                <form action="/docs" method="get" class="search-container">
                    <div class="input-group">
                        <input type="text" name="query" class="form-control search-input" placeholder="Поиск по категориям документации..." value="${query!}">
                        <button class="btn btn-primary" type="submit">
                            <i class="bi bi-search"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<div class="container main-content">
    <div class="d-flex justify-content-between align-items-center mb-4">
        <h2 class="h3 fw-bold">Категории</h2>
        <span class="badge bg-primary rounded-pill">${documentationCategories?size} категорий</span>
    </div>

    <#if documentationCategories?has_content>
        <div class="course-grid">
            <#list documentationCategories as category>
                <div class="course-card">
                    <div class="course-content">
                        <h3 class="course-title">${category.name}</h3>
                        <#if category.documentation.course??>
                            <a class="btn btn-primary" href="/course/${category.documentation.course.slug}/docs/category/${category.slug}">
                                Перейти к категории <i class="bi bi-arrow-right ms-1"></i>
                            </a>
                        </#if>
                        <span class="badge bg-secondary py-1">${category.documentation.course.title}</span>
                    </div>
                </div>
            </#list>
        </div>
    <#else>
        <div class="empty-state">
            <div class="empty-state-icon">
                <i class="bi bi-journal-x"></i>
            </div>
            <h3 class="h4 mb-3">Ничего не найдено</h3>
            <p class="text-muted mb-4">По вашему запросу не найдено ни одной категории документации.</p>
        </div>
    </#if>
</div>
<script src="${springMacroRequestContext.contextPath}/js/main.js"></script>
</body>
</html>
