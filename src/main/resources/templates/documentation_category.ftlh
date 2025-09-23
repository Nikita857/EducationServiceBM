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
    <title>${category.name}</title>
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
                <#if category.documentation.course??>
                    <li class="breadcrumb-item">
                        <a class="text-light text-decoration-underline" href="/course/${category.documentation.course.slug}">
                            Открыть
                        </a>
                    </li>
                </#if>
                <li class="breadcrumb-item active text-light">${category.name}</li>
            </ol>
        </nav>

        <div class="row align-items-center ms-2">
            <div class="col-lg-8">
                <h1 class="display-5 fw-bold text-white mb-2">Документация</h1>
                <h2 class="h3 text-white-50">${category.name}</h2>
            </div>
        </div>
    </div>
</div>

<!-- Documentation Objects Content -->
<div class="container">
    <#if category.documentationObjects?has_content>
        <div class="lessons-grid">
            <#list category.documentationObjects as object>
                <div class="lesson-card">
                    <h3 class="lesson-title">${object.name}</h3>

                    <#if object.text?? && object.text?has_content>
                        <div class="lesson-description">${object.text}</div>
                    </#if>

                    <a href="/docs/${object.file}" class="btn btn-primary w-50">Открыть</a>

                    <#if object.tags?? && object.tags?has_content>
                        <div class="mt-3">
                            <#list object.tags?split(",") as tag>
                                <span class="badge bg-secondary">${tag?trim}</span>
                            </#list>
                        </div>
                    </#if>
                </div>
            </#list>
        </div>
    <#else>
        <div class="empty-state-container">
            <div class="text-center py-5">
                <div class="empty-state-icon mb-4">
                    <i class="bi bi-journal-x" style="font-size: 4rem; color: #475569;"></i>
                </div>
                <h3 class="h4 mb-3">Объекты не найдены</h3>
                <p class="text-muted mb-4">В этой категории пока нет доступных объектов документации.</p>
            </div>
        </div>
    </#if>
</div>

</body>
</html>
