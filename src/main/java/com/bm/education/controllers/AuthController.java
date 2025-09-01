package com.bm.education.controllers;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.models.User;
import com.bm.education.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;    
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@Slf4j
public class AuthController {

    private final UserDetailsService userDetailsService;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;

    public AuthController(UserDetailsService userDetailsService, UserService userService, AuthenticationManager authenticationManager) {
        this.userDetailsService = userDetailsService;
        this.userService = userService;
        this.authenticationManager = authenticationManager;
    }

    @GetMapping("/login")
    public String login(Model model, HttpSession session) {

        if (session.getAttribute("error") != null) {
            model.addAttribute("error", session.getAttribute("error"));
            session.removeAttribute("error"); // Очищаем после использования
        }

        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @GetMapping("/logout")
    public String logout(HttpSession httpSession) {
        httpSession.invalidate();

        return "login?logout=true";
    }

    @PostMapping("/register")
    public String createUser(@Valid User user,
                             BindingResult bindingResult,
                             Model model,
                             RedirectAttributes redirectAttributes,
                             HttpServletRequest request) {

        if (bindingResult.hasErrors()) {

            model.addAttribute("user", user);
            model.addAttribute("errorRegistration", bindingResult.getAllErrors());
            return "register";
        }

        try {

            String rawPassword = request.getParameter("password").trim();
            userService.createUser(user);
            if(authenticateUserManually(user.getUsername(), rawPassword, request)) {
                return "redirect:/";
            }
            return null;

        } catch (ApiException e) {
            model.addAttribute("user", user);
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    //Метод авторизации
    private boolean authenticateUserManually(String username, String rawPassword, HttpServletRequest request) {
        try {
            // Загружаем UserDetails чтобы получить правильные данные для аутентификации
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            log.info("raw password: " + rawPassword);

            // Создаем токен аутентификации
            UsernamePasswordAuthenticationToken authToken =
                    new UsernamePasswordAuthenticationToken(userDetails.getUsername(), rawPassword, userDetails.getAuthorities());
            log.info("Authenticating user: {}", username);

            log.info("Credentials: "+authToken.getCredentials().toString());
            log.info("Principal: "+authToken.getPrincipal().toString());
            log.info("Authorities: "+authToken.getAuthorities().toString());

            // Аутентифицируем
            log.info("break point");
            Authentication authentication = authenticationManager.authenticate(authToken);

            // Устанавливаем аутентификацию в SecurityContext
            SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
            log.info("Security Context: "+securityContext.toString());
            securityContext.setAuthentication(authentication);
            log.info("Authentication: "+securityContext.getAuthentication().getName());
            SecurityContextHolder.setContext(securityContext);

            // Сохраняем в сессии
            HttpSession session = request.getSession(true);
            session.setAttribute("SPRING_SECURITY_CONTEXT", securityContext);

            return true;

        } catch (Exception e) {
            throw new ApiException("Auto-login failed: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
