<!DOCTYPE html>
<html lang="ru" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>429 - Доступ заблокирован | BM Education</title>
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <style>
        :root {
            --primary-gradient: linear-gradient(135deg, #f59e0b, #ef4444);
            --card-bg: #1e293b;
            --glow-color: rgba(245, 158, 11, 0.3);
        }

        body {
            background: #0f172a;
            color: #e2e8f0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            position: relative;
        }

        .error-container {
            position: relative;
            z-index: 2;
            text-align: center;
            padding: 2rem;
        }

        .error-card {
            background: var(--card-bg);
            border: none;
            border-radius: 24px;
            padding: 3rem;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
            max-width: 500px;
            margin: 0 auto;
        }

        .error-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: var(--primary-gradient);
            opacity: 0.1;
            transform: rotate(-45deg);
            z-index: -1;
        }

        .error-icon {
            font-size: 4rem;
            color: #f59e0b;
            margin-bottom: 1.5rem;
            animation: float 3s ease-in-out infinite;
        }

        .timer-display {
            font-size: 5rem;
            font-weight: 800;
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 0.5rem;
            text-shadow: 0 0 30px var(--glow-color);
        }

        .error-title {
            font-size: 1.8rem;
            font-weight: 700;
            color: #f8fafc;
            margin-bottom: 1rem;
        }

        .error-message {
            color: #94a3b8;
            font-size: 1.1rem;
            line-height: 1.6;
            margin-bottom: 2rem;
        }

        /* Floating animation */
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }

        /* Background particles */
        .particles {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .particle {
            position: absolute;
            background: var(--primary-gradient);
            border-radius: 50%;
            opacity: 0.3;
            animation: float 6s ease-in-out infinite;
        }

        .particle:nth-child(1) { width: 20px; height: 20px; top: 20%; left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 15px; height: 15px; top: 60%; left: 80%; animation-delay: 1s; }
        .particle:nth-child(3) { width: 25px; height: 25px; top: 80%; left: 30%; animation-delay: 2s; }
        .particle:nth-child(4) { width: 10px; height: 10px; top: 40%; left: 60%; animation-delay: 3s; }
        .particle:nth-child(5) { width: 18px; height: 18px; top: 70%; left: 20%; animation-delay: 4s; }

        @media (max-width: 768px) {
            .error-card { padding: 2rem 1.5rem; margin: 1rem; }
            .timer-display { font-size: 4rem; }
            .error-title { font-size: 1.5rem; }
            .error-message { font-size: 1rem; }
        }

        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .error-card {
            animation: fadeInUp 0.8s ease-out;
        }
    </style>
</head>
<body>
<!-- Background particles -->
<div class="particles">
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
    <div class="particle"></div>
</div>

<div class="error-container">
    <div class="error-card">
        <div class="error-icon">
            <i class="bi bi-hourglass-split"></i>
        </div>

        <h1 class="error-title">Доступ временно заблокирован</h1>

        <p class="error-message">
            Вы превысили лимит неудачных попыток входа.
            Пожалуйста, попробуйте снова через:
        </p>

        <div id="timer" class="timer-display" data-duration="${banDuration}">--:--</div>

        <p class="text-muted small mt-3">Эта страница обновится автоматически.</p>

    </div>
</div>

<script src="${springMacroRequestContext.contextPath}/js/auth/blockPageTimer.js"></script>
</body>
</html>