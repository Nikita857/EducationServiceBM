<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Итоговый тест по модулю | BM Education</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css">
    <link rel="stylesheet" href="${staticHost}/css/header.css">
    <link rel="stylesheet" href="${staticHost}/css/custom-alert.css">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #6366f1, #8b5cf6);
            --card-bg: #1e293b;
            --sidebar-bg: #0f172a;
            --danger-color: #ef4444;
            --success-color: #10b981;
            --warning-color: #f59e0b;
            --header-height: 70px;
        }
        body {
            background-color: #0f172a;
            color: #e2e8f0;
        }
        .test-container {
            max-width: 800px;
            margin: 2rem auto;
        }
        .question-card {
            background-color: #1e293b;
            border-radius: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            margin-bottom: 1.5rem;
            padding: 1.5rem 2rem;
        }
        .question-text {
            font-size: 1.25rem;
            font-weight: 500;
            margin-bottom: 1rem;
        }
        .answer-option {
            margin-bottom: 0.75rem;
        }
        .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            font-weight: 500;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }

        .btn-primary {
            background: var(--primary-gradient);
            color: white;
        }

        .btn-primary:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
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
    </style>
</head>
<body>

<div class="container container-fluid mb-5" id="navbarWrapper">
    <#include "layouts/header.ftlh">
</div>

<div class="test-container">
    <div class="test-header mb-4">
        <h1>Итоговый тест по модулю ${moduleName}</h1>
        <#-- Breadcrumbs can be added here if module info is passed -->
    </div>

    <div class="test-body">
        <#if questions?? && questions?has_content>
            <form id="testForm" data-module-id="${moduleId}">
                
                <#list questions as question>
                    <div class="question-card">
                        <p class="question-text"><strong>Вопрос ${question?counter}:</strong> ${question.question}</p>
                        <div class="answers">
                            <#list question.answers as answer>
                                <div class="form-check answer-option">
                                    <input class="form-check-input" type="radio" name="question_${question?index}" id="answer_${question?index}_${answer?index}" value="${answer.text}" required>
                                    <label class="form-check-label" for="answer_${question?index}_${answer?index}">
                                        ${answer.text}
                                    </label>
                                </div>
                            </#list>
                        </div>
                    </div>
                </#list>

                <div class="text-center mt-4">
                    <button type="submit" class="btn btn-primary btn-lg">Завершить тест</button>
                </div>

            </form>
        <#else>
            <div class="alert alert-info text-center">
                <p>Для этого модуля нет вопросов для теста.</p>
            </div>
        </#if>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" id="resultModal" tabindex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="resultModalLabel">Результаты теста</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
            <div class="modal-body">
                <h3 class="text-center" id="isCompleted"></h3>
                <p class="text-center fs-4" id="resultText"></p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
            </div>
        </div>
    </div>
</div>

<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.min.js"></script>
<script src="${staticHost}/js/custom-alert.js"></script>
<script src="${staticHost}/js/moduleTestHandler.js"></script>
<script src="${staticHost}/js/auth/expiredTokenController.js"></script>
</body>
</html>
