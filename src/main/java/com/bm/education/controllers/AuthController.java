package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.auth.AuthRequest;
import com.bm.education.dto.auth.AuthResponse;
import com.bm.education.dto.auth.RegisterRequest;
import com.bm.education.models.Role;
import com.bm.education.security.jwt.JwtService;
import com.bm.education.services.LoginAttemptService;
import com.bm.education.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling authentication-related requests.
 */
@Controller
@RequestMapping
@RequiredArgsConstructor

public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final LoginAttemptService loginAttemptService;

    /**
     * Registers a new user.
     *
     * @param request The DTO to register.
     * @return A response entity containing the authentication response.
     */
    @PostMapping("/api/auth/register")
    @ResponseBody // Поскольку контроллер должен возвращать и представления и JSON,
    // то для методов возвращающих JSON используем эту аннотацию
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                                 HttpServletResponse response,
                                                 BindingResult bindingResult) {

        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult
                    .getAllErrors()
                    .forEach(error -> errors.put(
                            error.getObjectName(),
                            error.getDefaultMessage())
                    );
            return ResponseEntity.badRequest().body(errors);
        }

        userService.createUser(userService.registerDtoToUser(request));
        UserDetails userDetails = userService.getUserByUsername(request.getUsername()); // Получаем UserDetails для генерации токена
        String jwtToken = jwtService.generateToken(userDetails);

        setCookie(jwtToken, response);

        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).redirect(determineRoleAndRouting(userDetails)).build());
    }

    /**
     * Authenticates a user.
     *
     * @param request The authentication request.
     * @param response The HTTP servlet response.
     * @return A response entity containing the authentication response.
     */
    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request, HttpServletRequest httpServletRequest, HttpServletResponse response) {
        try {
            return performAuthenticationAndSetCookie(request.getUsername(), request.getPassword(), response);
        } catch (BadCredentialsException e) {
            String ip = getClientIP(httpServletRequest);
            loginAttemptService.loginFailed(ip);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.error("Неверный логин или пароль")
            );
        }
    }

    private @NotNull ResponseEntity<AuthResponse> performAuthenticationAndSetCookie(String username, String password, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);

        setCookie(jwtToken, response);

        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).redirect(determineRoleAndRouting(userDetails)).build());
    }

    private void setCookie(String jwtToken, @NotNull HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private String getClientIP(@NotNull HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null || xfHeader.isEmpty()) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0].trim();
    }

    private @NotNull String determineRoleAndRouting(@NotNull UserDetails userDetails) {
        if(userDetails
                .getAuthorities()
                .stream()
                .anyMatch(
                        grantedAuthority ->
                                grantedAuthority.getAuthority().equals(Role.ROLE_ADMIN.toString())))
            return "/admin";
        else
            return "/";
    }

    /**
     * Displays the login page.
     *
     * @return The name of the login view.
     */
    @GetMapping("/login")
    public String login() {
        return "login";
    }

    /**
     * Displays the register page.
     *
     * @return The name of the register view.
     */
    @GetMapping("/register")
    public String register() {
        return "register";
    }

    /**
     * Logs out a user.
     *
     * @param response The HTTP servlet response.
     * @return A response entity indicating that the user has been logged out.
     */
    @PostMapping("/logout/cookie")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/blocked")
    public String blockedPage(Model model) {
        model.addAttribute("banDuration", loginAttemptService.getBanDuration() * 60);
        return "error/blocked";
    }
}