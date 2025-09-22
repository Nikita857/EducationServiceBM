package com.bm.education.services;

import com.bm.education.models.User;
import com.bm.education.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final UserRepository userRepository;

    public Optional<User> findByToken(String token) {
        return userRepository.findByRefreshToken(token);
    }

    @Transactional
    public User createRefreshToken(User user) {
        user.setRefreshToken(UUID.randomUUID().toString());
        // 1 day for refresh token
        final long refreshTokenDurationMs = 24 * 60 * 60 * 1000;
        user.setRefreshTokenExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        return userRepository.save(user);
    }

    @Transactional
    public User verifyExpiration(User user) {
        if (user.getRefreshTokenExpiryDate().isBefore(Instant.now())) {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiryDate(null);
            userRepository.save(user);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return user;
    }
}
