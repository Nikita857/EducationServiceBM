package com.bm.education.feat.auth.service;

import com.bm.education.feat.auth.dto.AuthResponse;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;

@Service
public class CookieService {

    public void setAuthCookies(HttpServletResponse response, AuthResponse authResponse) {
        setCookie("jwt", authResponse.accessToken(), response);
        setCookie("refresh_token", authResponse.refreshToken(), response);
    }

    public void clearAuthCookies(HttpServletResponse response) {
        clearCookie("jwt", response);
        clearCookie("refresh_token", response);
    }

    private void setCookie(String name, String value, HttpServletResponse response) {
        Cookie cookie = new Cookie(name, value);
        cookie.setPath("/");
        cookie.setHttpOnly(true); // Best practice
        // cookie.setSecure(true); // Uncomment if using HTTPS
        response.addCookie(cookie);
    }

    private void clearCookie(String name, HttpServletResponse response) {
        Cookie cookie = new Cookie(name, null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);
    }
}
