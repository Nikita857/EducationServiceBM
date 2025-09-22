// token-controller.js

class TokenController {
    constructor() {
        this.tokenName = 'jwt';
        this.refreshTokenName = 'refresh_jwt';
    }

    // Получить токен из куки
    getToken() {
        return this.getCookie(this.tokenName);
    }

    // Получить refresh токен из куки
    getRefreshToken() {
        return this.getCookie(this.refreshTokenName);
    }

    // Проверить валидность токена
    isTokenValid() {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = this.parseJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return payload.exp && payload.exp > currentTime;
        } catch (error) {
            return false;
        }
    }

    // Проверить, скоро ли истечет токен
    isTokenExpiringSoon(minutes = 5) {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = this.parseJwt(token);
            const currentTime = Math.floor(Date.now() / 1000);
            return (payload.exp - currentTime) < (minutes * 60);
        } catch (error) {
            return false;
        }
    }

    // Парсинг JWT токена
    parseJwt(token) {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

    // Получить куки по имени
    getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Установить куки
    setCookie(name, value, days = 7) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/; Secure; SameSite=Strict`;
    }

    // Обновить токен
    async refreshToken() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await axios.post('/api/auth/refresh', {
                refreshToken: refreshToken
            });

            const data = response.data;

            // Сохраняем новые токены
            if (data.accessToken) {
                this.setCookie(this.tokenName, data.accessToken);
            }
            if (data.refreshToken) {
                this.setCookie(this.refreshTokenName, data.refreshToken);
            }
            console.log('Token refreshed successfully.');
            return data.accessToken;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }

    // Автоматическое обновление токена
    setupAutoRefresh() {
        // Проверяем каждую минуту
        setInterval(() => {
            if (this.isTokenValid() && this.isTokenExpiringSoon(5)) {
                this.refreshToken().catch(error => {
                    console.error('Auto-refresh failed:', error);
                });
            }
        }, 60000); // Каждую минуту
    }

    // Инициализация
    initialize() {
        this.setupAutoRefresh();
    }
}

// Создаем глобальный экземпляр
const tokenController = new TokenController();

// Инициализируем при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    tokenController.initialize();
});