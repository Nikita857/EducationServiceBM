package com.bm.education.feat.auth.dto;

public record TokenRefreshResponse(String accessToken, String refreshToken) {
}
