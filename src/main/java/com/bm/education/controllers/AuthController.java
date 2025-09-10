package com.bm.education.controllers;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.models.User;
import com.bm.education.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;


@Controller
@Slf4j
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final UserDetailsService userDetailsService;

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
    public String createUser(@Valid User user, BindingResult bindingResult, Model model, HttpServletRequest request) {

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

            // Manually create the Authentication object
            UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
            
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails, 
                null, // Credentials can be null as we are already authenticated
                userDetails.getAuthorities()
            );

            // Set the authentication in the SecurityContext
            SecurityContextHolder.getContext().setAuthentication(authToken);

            // Manually update the session
            request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            return "redirect:/";

        } catch (ApiException e) {
            model.addAttribute("user", user);
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }
}
