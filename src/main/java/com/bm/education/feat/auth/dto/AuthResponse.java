package com.bm.education.feat.auth.dto;

import com.bm.education.feat.user.dto.UserResponse;
import lombok.Builder;

@Builder
public record AuthResponse(
                UserResponse user,
                String accessToken,
                String refreshToken) {
}
