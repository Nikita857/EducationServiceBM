package com.bm.education.dto.auth;

import lombok.Builder;

@Builder
public record AuthResponse(String token, String redirect) {
}