package com.bm.education.feat.auth.service;

import com.bm.education.feat.auth.dto.*;
import com.bm.education.feat.user.mapper.UserMapper;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.security.jwt.JwtService;
import com.bm.education.feat.maintenance.service.ApplicationSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import io.jsonwebtoken.MalformedJwtException;
import com.bm.education.shared.exception.RegistrationDisabledException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenService refreshTokenService;
    private final ApplicationSettingService settingService;
    private final UserMapper userMapper;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (!settingService.isRegistrationEnabled()) {
            throw new RegistrationDisabledException();
        }

        User newUser = userService.registerDtoToUser(request);
        userService.createUser(newUser);

        return authenticate(newUser.getUsername(), request.password());
    }

    public AuthResponse login(LoginRequest request) {
        return authenticate(request.username(), request.password());
    }

    @Transactional
    public AuthResponse refresh(RefreshTokenRequest request) {
        return refreshTokenService.findByToken(request.refreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(user -> {
                    String accessToken = jwtService.generateToken(user);
                    User refreshToken = refreshTokenService.createRefreshToken(user);

                    return AuthResponse.builder()
                            .user(userMapper.toResponse(user))
                            .accessToken(accessToken)
                            .refreshToken(refreshToken.getRefreshToken())
                            .build();
                })
                .orElseThrow(() -> new MalformedJwtException("Невалидный refresh token"));
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null) {
            return;
        }
        refreshTokenService.findByToken(refreshToken).ifPresent(user -> {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiryDate(null);
            userService.save(user);
        });
    }

    private AuthResponse authenticate(String username, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password));

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = (User) userDetails;

        String accessToken = jwtService.generateToken(userDetails);
        User refreshToken = refreshTokenService.createRefreshToken(user);

        return AuthResponse.builder()
                .user(userMapper.toResponse(user))
                .accessToken(accessToken)
                .refreshToken(refreshToken.getRefreshToken())
                .build();
    }
}
