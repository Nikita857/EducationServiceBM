

async function logout(event) {
    event.preventDefault(); // 1. Отменяем стандартное поведение ссылки

    try {
        const response = await fetch("/logout/cookie", {
            method: 'POST'
        });

        // 3. Перенаправляем пользователя после успешного выхода
        if (response.ok || response.redirected) {
            window.location.href = '/login?logout';
        } else {
            console.error('Logout failed. Status:', response.status);
        }

    } catch (e) {
        console.error('Error during logout:', e);
    }
}

document.getElementById('logoutButton').addEventListener('click', logout);
