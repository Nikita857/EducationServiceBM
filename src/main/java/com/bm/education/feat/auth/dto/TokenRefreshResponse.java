package com.bm.education.feat.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record TokenRefreshResponse(
        @NotBlank(message = "Access token is required") String accessToken,
        @NotBlank(message = "Refresh token is required") String refreshToken) {
}
