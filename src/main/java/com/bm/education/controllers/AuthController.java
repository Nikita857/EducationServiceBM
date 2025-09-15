package com.bm.education.controllers;

import com.bm.education.dto.auth.AuthRequest;
import com.bm.education.dto.auth.AuthResponse;
import com.bm.education.models.Role;
import com.bm.education.models.User;
import com.bm.education.security.jwt.JwtService;
import com.bm.education.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@Controller
@RequestMapping
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/api/auth/register")
    @ResponseBody // Поскольку контроллер должен возвращать и представления и JSON,
    // то для методов возвращающих JSON используем эту аннотацию
    public ResponseEntity<AuthResponse> register(@RequestBody User user) {
        userService.createUser(user);
        UserDetails userDetails = userService.getUserByUsername(user.getUsername()); // Получаем UserDetails для генерации токена
        String jwtToken = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).build());
    }

    @PostMapping("/api/auth/login")
    @ResponseBody
    public ResponseEntity<AuthResponse> authenticate(@RequestBody AuthRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(userDetails);

        Cookie cookie = new Cookie("jwt", jwtToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);

        if(userDetails.getAuthorities().stream()
                .anyMatch(
                        grantedAuthority ->
                                grantedAuthority.getAuthority().equals(Role.ROLE_ADMIN.toString()
                                )
                )
        ) {
            return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).redirect("/admin").build());
        }
        return ResponseEntity.ok(AuthResponse.builder().token(jwtToken).redirect("/").build());
    }

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    @GetMapping("/register")
    public String register() {
        return "register";
    }

    @PostMapping("/logout/cookie")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.ok().build();
    }
}