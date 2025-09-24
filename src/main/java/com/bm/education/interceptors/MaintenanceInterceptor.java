package com.bm.education.interceptors;

import com.bm.education.models.Role;
import com.bm.education.services.ApplicationSettingService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
@RequiredArgsConstructor
public class MaintenanceInterceptor implements HandlerInterceptor {

    private final ApplicationSettingService settingService;

    @Override
    public boolean preHandle(@NotNull HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow access to essential pages and resources even in maintenance mode
        String uri = request.getRequestURI();
        if (uri.equals("/maintenance") || uri.equals("/error") || uri.startsWith("/css/") || uri.startsWith("/js/") || uri.startsWith("/img/") || uri.startsWith("/webjars/")) {
            return true;
        }

        if (settingService.isMaintenanceModeEnabled()) {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

            // Check if user is authenticated and is an admin
            boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(grantedAuthority -> grantedAuthority.getAuthority().equals(Role.ROLE_ADMIN.name()));

            if (!isAdmin) {
                response.sendRedirect("/maintenance");
                return false;
            }
        }
        return true;
    }
}
