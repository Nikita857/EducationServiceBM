package com.bm.education.dto.auth;

public record TokenRefreshResponse(String accessToken, String refreshToken) {
}
