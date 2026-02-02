package com.bm.education.shared.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class CustomAuthenticationFailureHandler implements AuthenticationFailureHandler {

    @Override
    public void onAuthenticationFailure(HttpServletRequest request,
                                        HttpServletResponse response,
                                        AuthenticationException exception) throws IOException {

        String errorMessage;

        if (exception instanceof BadCredentialsException) {
            errorMessage = "Неверное имя пользователя или пароль";
        } else if (exception instanceof LockedException) {
            errorMessage = "Аккаунт заблокирован";
        } else if (exception instanceof DisabledException) {
            errorMessage = "Аккаунт отключен";
        } else if (exception instanceof AccountExpiredException) {
            errorMessage = "Срок действия аккаунта истек";
        } else if (exception instanceof CredentialsExpiredException) {
            errorMessage = "Срок действия пароля истек";
        } else {
            errorMessage = "Ошибка аутентификации";
        }

        // Сохраняем ошибку в сессии и перенаправляем на login page
        request.getSession().setAttribute("error", errorMessage);
        response.sendRedirect("/login?error");
    }
}