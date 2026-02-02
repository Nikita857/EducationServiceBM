package com.bm.education.feat.auth.dto;

import lombok.Builder;

@Builder
public record AuthResponse(String token, String redirect) {
}