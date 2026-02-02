package com.bm.education.feat.auth.controller;

import com.bm.education.feat.auth.dto.*;
import com.bm.education.feat.auth.service.AuthService;
import com.bm.education.feat.auth.service.CookieService;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.shared.validation.ValidationService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

/**
 * Controller for handling authentication-related requests.
 */
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for user authentication and token management")
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;
    private final ValidationService validationService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user", description = "Creates a new user account and returns valid tokens")
    public ApiResponse<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
            HttpServletResponse response,
            BindingResult bindingResult) {

        validationService.validate(bindingResult);

        AuthResponse authResponse = authService.register(request);
        cookieService.setAuthCookies(response, authResponse);

        return ApiResponse.success("Регистрация успешна", authResponse);
    }

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user by username and password, returns tokens")
    public ApiResponse<AuthResponse> authenticate(@RequestBody LoginRequest request, HttpServletResponse response) {
        AuthResponse authResponse = authService.login(request);
        cookieService.setAuthCookies(response, authResponse);
        return ApiResponse.success("Авторизация успешна", authResponse);
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh token", description = "Generates new access token using a valid refresh token")
    public ApiResponse<AuthResponse> refreshToken(@RequestBody RefreshTokenRequest request,
            HttpServletResponse response) {
        AuthResponse authResponse = authService.refresh(request);
        cookieService.setAuthCookies(response, authResponse);
        return ApiResponse.success("Токен успешно обновлен", authResponse);
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Invalidates the refresh token and clears auth cookies")
    public ApiResponse<Void> logout(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;
        if (request.getCookies() != null) {
            refreshToken = Arrays.stream(request.getCookies())
                    .filter(c -> "refresh_token".equals(c.getName()))
                    .findFirst()
                    .map(Cookie::getValue)
                    .orElse(null);
        }

        authService.logout(refreshToken);
        cookieService.clearAuthCookies(response);

        return ApiResponse.success("Вы успешно вышли из системы");
    }

}
