package com.bm.education.feat.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @Schema(description = "User's username", example = "john_doe") @NotBlank(message = "Username is required") String username,

        @Schema(description = "User's password", example = "password123") @NotBlank(message = "Password is required") String password) {
}
