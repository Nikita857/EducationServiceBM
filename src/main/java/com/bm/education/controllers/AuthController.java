package com.bm.education.controllers;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.models.User;
import com.bm.education.services.UserService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@Controller
@Slf4j
public class AuthController {

    private final UserDetailsService userDetailsService;
    private final UserService userService;

    public AuthController(UserDetailsService userDetailsService, UserService userService) {
        this.userDetailsService = userDetailsService;
        this.userService = userService;
    }

    @GetMapping("/login")
    public String login(Model model, HttpSession session) {

        if (session.getAttribute("error") != null) {
            model.addAttribute("error", session.getAttribute("error"));
            session.removeAttribute("error");
        }
        return "login";
    }

    @GetMapping("/register")
    public String showRegistrationForm() {
        return "register";
    }

    @PostMapping("/register")
    public String createUser(@Valid User user, BindingResult bindingResult, Model model) {

        if (bindingResult.hasErrors()) {
            bindingResult.getAllErrors().forEach(objectError ->{
                    log.info("Поле "+objectError.getObjectName()+" Ошибка: "+objectError.getDefaultMessage());
                    });
            model.addAttribute("user", user);
            model.addAttribute("errorRegistration", bindingResult.getAllErrors());
            return "register";
        }

        try {
            userService.createUser(user);
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );

            SecurityContextHolder.getContext().setAuthentication(authToken);

            return SecurityContextHolder.getContext().getAuthentication().isAuthenticated() ? "redirect:/":null;

        } catch (ApiException e) {
            model.addAttribute("user", user);
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }
}
