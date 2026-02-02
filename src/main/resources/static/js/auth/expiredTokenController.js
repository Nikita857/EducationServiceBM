// token-controller.js

// ===== ЛОГГЕР =====
const createLogger = (prefix = 'TokenController') => ({
    info: (message, data) => console.log(`[${prefix}] INFO: ${message}`, data || ''),
    warn: (message, data) => console.warn(`[${prefix}] WARN: ${message}`, data || ''),
    error: (message, error) => console.error(`[${prefix}] ERROR: ${message}`, error || ''),
    debug: (message, data) => console.debug(`[${prefix}] DEBUG: ${message}`, data || '')
});

// ===== УТИЛИТЫ =====
const safeParseJSON = (jsonString, fallback = {}) => {
    try {
        return JSON.parse(jsonString);
    } catch {
        return fallback;
    }
};

const getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

// ===== ОСНОВНЫЕ ФУНКЦИИ =====
const createTokenController = (config = {}) => {
    const {
        tokenName = 'jwt',
        refreshTokenName = 'refresh_token',
        autoRefreshInterval = 3600000, // 1 минута
        expirationThreshold = 5 * 60 // 5 минут в секундах
    } = config;

    const logger = createLogger('TokenController');

    // ===== РАБОТА С COOKIES =====
    const getCookie = (name) => {
        const cookies = document.cookie.split(';').map(cookie => cookie.trim());
        const targetCookie = cookies.find(cookie => cookie.startsWith(`${name}=`));

        return targetCookie ? decodeURIComponent(targetCookie.split('=')[1]) : null;
    };

    const setCookie = (name, value, options = {}) => {
        const {
            days = 7,
            path = '/',
            secure = true,
            sameSite = 'Strict'
        } = options;

        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        const expires = `expires=${date.toUTCString()}`;
        const cookiePath = `path=${path}`;
        const cookieSecure = secure ? 'Secure' : '';
        const cookieSameSite = `SameSite=${sameSite}`;

        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; ${cookiePath}; ${cookieSecure}; ${cookieSameSite}`;

        logger.debug(`Cookie set: ${name}`, { expires: date.toISOString() });
    };

    // ===== РАБОТА С JWT =====
    const parseJwt = (token) => {
        if (!token || typeof token !== 'string') {
            logger.warn('Invalid token provided for parsing');
            return null;
        }

        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid JWT format');
            }

            const base64Url = parts[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = atob(base64);

            const decoded = decodeURIComponent(
                Array.from(jsonPayload).map(c =>
                    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                ).join('')
            );

            return safeParseJSON(decoded);
        } catch (error) {
            logger.error('JWT parsing failed', error);
            return null;
        }
    };

    // ===== ПРОВЕРКИ ТОКЕНОВ =====
    const getToken = () => {
        const token = getCookie(tokenName);
        logger.debug('Token retrieved', { exists: !!token });
        return token;
    };

    const getRefreshToken = () => {
        const refreshToken = getCookie(refreshTokenName);
        logger.debug('Refresh token retrieved', { exists: !!refreshToken });
        return refreshToken;
    };

    const isTokenValid = () => {
        const token = getToken();

        if (!token) {
            logger.warn('Token validation failed: no token');
            return false;
        }

        const payload = parseJwt(token);

        if (!payload || !payload.exp) {
            logger.warn('Token validation failed: invalid payload or expiration');
            return false;
        }

        const currentTime = getCurrentTimestamp();
        const isValid = payload.exp > currentTime;

        logger.debug('Token validation check', {
            isValid,
            expiresIn: payload.exp - currentTime
        });

        return isValid;
    };

    const isTokenExpiringSoon = (thresholdSeconds = expirationThreshold) => {
        const token = getToken();

        if (!token) {
            logger.warn('Token expiration check failed: no token');
            return false;
        }

        const payload = parseJwt(token);

        if (!payload || !payload.exp) {
            return false;
        }

        const currentTime = getCurrentTimestamp();
        const expiresIn = payload.exp - currentTime;
        const isExpiringSoon = expiresIn < thresholdSeconds;

        logger.debug('Token expiration check', {
            isExpiringSoon,
            expiresIn,
            threshold: thresholdSeconds
        });

        return isExpiringSoon;
    };

    // ===== ОБНОВЛЕНИЕ ТОКЕНОВ =====
    const refreshToken = async () => {
        const refreshTokenValue = getRefreshToken();

        if (!refreshTokenValue) {
            const error = new Error('No refresh token available');
            logger.error('Token refresh failed', error);
            throw error;
        }

        logger.info('Attempting token refresh');

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken: refreshTokenValue })
            });

            if (!response.ok) {
                const error = new Error(`Request failed with status ${response.status}`);
                error.response = { status: response.status }; // Mimic axios error structure
                throw error;
            }

            const data = await response.json();
            const { accessToken, refreshToken: newRefreshToken } = data;

            if (!accessToken) {
                throw new Error('No access token in response');
            }

            // Сохраняем новые токены
            const tokenActions = [];

            if (accessToken) {
                setCookie(tokenName, accessToken);
                tokenActions.push('access token updated');
            }

            if (newRefreshToken) {
                setCookie(refreshTokenName, newRefreshToken);
                tokenActions.push('refresh token updated');
            }

            logger.info('Token refresh successful', { actions: tokenActions });
            return accessToken;

        } catch (error) {
            logger.error('Token refresh API call failed', error);

            // Очищаем токены при ошибке аутентификации
            if (error.response?.status === 401) {
                logger.warn('Clearing tokens due to authentication error');
                setCookie(tokenName, '', { days: -1 });
                setCookie(refreshTokenName, '', { days: -1 });
            }

            throw error;
        }
    };

    // ===== АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ =====
    const createAutoRefresh = () => {
        let refreshInterval = null;

        const start = () => {
            if (refreshInterval) {
                logger.warn('Auto-refresh already running');
                return;
            }

            refreshInterval = setInterval(() => {
                const isValid = isTokenValid();
                const isExpiringSoon = isTokenExpiringSoon();

                if (isValid && isExpiringSoon) {
                    logger.info('Auto-refresh triggered');
                    refreshToken().catch(error => {
                        logger.error('Auto-refresh failed', error);
                    });
                }
            }, autoRefreshInterval);

            logger.info('Auto-refresh started', { interval: autoRefreshInterval });
        };

        const stop = () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
                refreshInterval = null;
                logger.info('Auto-refresh stopped');
            }
        };

        return { start, stop };
    };

    // ===== ПУБЛИЧНЫЙ API =====
    const { start: startAutoRefresh, stop: stopAutoRefresh } = createAutoRefresh();

    const initialize = () => {
        logger.info('Initializing token controller');
        startAutoRefresh();
    };

    const destroy = () => {
        logger.info('Destroying token controller');
        stopAutoRefresh();
    };

    // Получаем текущий статус
    const getStatus = () => ({
        hasToken: !!getToken(),
        hasRefreshToken: !!getRefreshToken(),
        isValid: isTokenValid(),
        isExpiringSoon: isTokenExpiringSoon()
    });

    return {
        // Геттеры
        getToken,
        getRefreshToken,
        getStatus,

        // Проверки
        isTokenValid,
        isTokenExpiringSoon,

        // Действия
        refreshToken,
        initialize,
        destroy,

        // Утилиты
        parseJwt
    };
};

// ===== СОЗДАНИЕ И ИНИЦИАЛИЗАЦИЯ ЭКЗЕМПЛЯРА =====
const tokenController = createTokenController();

// Автоматическая инициализация при загрузке DOM
const initializeOnDOMReady = () => {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tokenController.initialize);
    } else {
        tokenController.initialize();
    }
};

initializeOnDOMReady();

// Экспорт для использования в модульных системах
export default tokenController;