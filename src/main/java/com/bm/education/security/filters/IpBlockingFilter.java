package com.bm.education.security.filters;

import com.bm.education.services.LoginAttemptService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class IpBlockingFilter extends OncePerRequestFilter {

    private final LoginAttemptService loginAttemptService;

    public IpBlockingFilter(LoginAttemptService loginAttemptService) {
        this.loginAttemptService = loginAttemptService;
    }

    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain)
            throws ServletException, IOException {

        // Пропускаем статические ресурсы и ошибки
        if (isExcludedPath(request)) {
            filterChain.doFilter(request, response);
            return;
        }

        String ip = getClientIP(request);

        if (loginAttemptService.isBlocked(ip)) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"redirectUrl\": \"/blocked\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isExcludedPath(@NotNull HttpServletRequest request) {
        String path = request.getRequestURI();

        return path.startsWith("/css/") ||
                path.startsWith("/js/") ||
                path.startsWith("/images/") ||
                path.startsWith("/webjars/") ||
                path.startsWith("/static/") ||
                path.startsWith("/avatars/") ||
                path.startsWith("/videos/") ||
                path.startsWith("/img/") ||
                path.equals("/error") ||
                path.equals("/blocked") ||
                path.endsWith(".css") ||
                path.endsWith(".js") ||
                path.endsWith(".png") ||
                path.endsWith(".jpg") ||
                path.endsWith(".jpeg") ||
                path.endsWith(".gif") ||
                path.endsWith(".ico") ||
                path.endsWith(".svg");
    }

    private String getClientIP(@NotNull HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }

        // Берем первый IP из цепочки (клиентский IP)
        return xfHeader.split(",")[0].trim();
    }
}