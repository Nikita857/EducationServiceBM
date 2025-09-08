<!doctype html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Просмотр видео</title>
    <link href="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        body {
            background-color: #212529;
            color: #e8e6e3;
        }
        .main-content {
            padding: 2rem;
        }
        .video-card {
            background-color: #2b3035;
            border: 1px solid #495057;
        }
        .video-container {
            position: relative;
            width: 100%;
            padding-bottom: 56.25%; /* 16:9 aspect ratio */
            height: 0;
        }
        .video-container video {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 0.375rem;
        }
    </style>
</head>
<body>

<div class="main-content">
    <section class="content-section">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="section-title mb-0"><i class="bi bi-camera-video me-2"></i>Просмотр видео</h2>
            <a href="/admin" class="btn btn-outline-secondary">Вернуться в панель</a>
        </div>
        <div class="card video-card">
            <div class="card-body">
                <div class="video-container">
                    <video controls>
                        <source src="${springMacroRequestContext.contextPath}/videos/${video}" type="video/mp4">
                    </video>
                </div>
            </div>
            <div class="card-footer text-muted">
                <p class="mb-1">Название видео: ${title}</p>
                <p class="mb-0">Описание: Это стандартный HTML5-проигрыватель для просмотра видеоконтента.</p>
            </div>
        </div>
    </section>
</div>

<script src="${springMacroRequestContext.contextPath}/webjars/bootstrap/5.3.8/js/bootstrap.bundle.js"></script>
</body>
</html>
