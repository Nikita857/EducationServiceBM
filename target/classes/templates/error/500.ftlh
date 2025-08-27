<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ошибка сервера</title>
    <!-- Bootstrap 5 CSS -->
    <link rel="stylesheet" href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.7/css/bootstrap.css">
    <style>
        .error-page {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .error-content {
            text-align: center;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 20px rgb(182, 172, 172);
        }
        .error-code {
            font-size: 6rem;
            font-weight: 700;
            color: #dc3545;
            margin-bottom: 1rem;
        }
        .error-message {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
        }
    </style>
</head>
<body>
<div class="error-page">
    <div class="error-content">
        <div class="error-code">500</div>
        <h1 class="error-message">Ошибка сервера</h1>
        <p class="lead">Запрашиваемая страница не существует или была перемещена.</p>
        <div class="d-flex justify-content-center gap-3">
            <a href="${springMacroRequestContext.contextPath}/" class="btn btn-primary">На главную</a>
            <a href="mailto:support@example.com" class="btn btn-outline-secondary">Написать в поддержку</a>
        </div>
    </div>
</div>

</body>
</html>