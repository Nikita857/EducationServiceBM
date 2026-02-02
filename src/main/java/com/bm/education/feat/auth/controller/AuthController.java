package com.bm.education.feat.auth.controller;

import com.bm.education.feat.auth.dto.*;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.maintenance.service.ApplicationSettingService;
import com.bm.education.feat.auth.service.RefreshTokenService;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.security.jwt.JwtService;
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

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
    private final RefreshTokenService refreshTokenService;
    private final ApplicationSettingService settingService;

    @PostMapping("/api/auth/register")
    @ResponseBody
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
            HttpServletResponse response,
            BindingResult bindingResult) {

        if (!settingService.isRegistrationEnabled()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Регистрация в данный момент отключена."));
        }

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult
                    .getAllErrors()
                    .forEach(error -> errors.put(
                            error.getObjectName(),
                            error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        User newUser = userService.registerDtoToUser(request);
        userService.createUser(newUser);

        return performAuthenticationAndSetCookie(newUser.getUsername(), request.password(), response);
    }

    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<?> authenticate(@RequestBody AuthRequest request, HttpServletRequest httpServletRequest,
                                          HttpServletResponse response) {
        try {
            return performAuthenticationAndSetCookie(request.username(), request.password(), response);
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.error("Неверный логин или пароль"));
        }
    }

    @PostMapping("/api/auth/refresh")
    @ResponseBody
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request, HttpServletResponse response) {
        String requestRefreshToken = request.refreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(user -> {
                    String token = jwtService.generateToken(user);
                    User newRefreshToken = refreshTokenService.createRefreshToken(user);
                    setCookie("jwt", token, response);
                    setCookie("refresh_token", newRefreshToken.getRefreshToken(), response);
                    return ResponseEntity.ok(new TokenRefreshResponse(token, newRefreshToken.getRefreshToken()));
                })
                .orElse(null);
    }

    private @NotNull ResponseEntity<AuthResponse> performAuthenticationAndSetCookie(String username, String password,
                                                                                    HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) userDetails;

        String jwtToken = jwtService.generateToken(userDetails);
        User refreshToken = refreshTokenService.createRefreshToken(user);

        setCookie("jwt", jwtToken, response);
        setCookie("refresh_token", refreshToken.getRefreshToken(), response);

        return ResponseEntity
                .ok(AuthResponse.builder().token(jwtToken).redirect(determineRoleAndRouting(userDetails)).build());
    }

    private void setCookie(String name, String value, @NotNull HttpServletResponse response) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        response.addCookie(cookie);
    }

    private @NotNull String determineRoleAndRouting(@NotNull UserDetails userDetails) {
        if (userDetails
                .getAuthorities()
                .stream()
                .anyMatch(
                        grantedAuthority -> grantedAuthority.getAuthority().equals("ROLE_ADMIN")))
            return "/admin";
        else
            return "/";
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        if (!settingService.isRegistrationEnabled()) {
            return "redirect:/login";
        }
        return "register";
    }

    @PostMapping("/logout/cookie")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        Optional<Cookie> refreshTokenCookie = Arrays.stream(request.getCookies())
                .filter(c -> c.getName().equals("refresh_token"))
                .findFirst();

        refreshTokenCookie.ifPresent(cookie -> {
            refreshTokenService.findByToken(cookie.getValue()).ifPresent(user -> {
                user.setRefreshToken(null);
                user.setRefreshTokenExpiryDate(null);
                userService.save(user);
            });
        });

        Cookie jwtCookie = new Cookie("jwt", null);
        jwtCookie.setMaxAge(0);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        response.addCookie(jwtCookie);

        Cookie rtCookie = new Cookie("refresh_token", null);
        rtCookie.setMaxAge(0);
        rtCookie.setHttpOnly(true);
        rtCookie.setPath("/");
        response.addCookie(rtCookie);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/maintenance")
    public String getMaintenancePage(Model model) {
        String endTime = settingService.getSetting(ApplicationSettingService.KEY_MAINTENANCE_END_TIME);
        model.addAttribute("maintenanceEndTime", endTime);
        return "maintenance";
    }
}
