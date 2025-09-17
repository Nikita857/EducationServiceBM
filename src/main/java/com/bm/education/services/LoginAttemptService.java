package com.bm.education.services;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class LoginAttemptService {

    @Value("${login.attempts}")
    private int MAX_ATTEMPTS;
    @Value("${ip.ban.duration}")
    private int BAN_DURATION;
    private LoadingCache<String, Integer> attemptsCache;

    @PostConstruct
    public void init() {
        attemptsCache = Caffeine.newBuilder().
                expireAfterWrite(BAN_DURATION, TimeUnit.MINUTES).
                build(key -> 0);
    }

    public void loginSucceeded(String key) {
        attemptsCache.invalidate(key);
    }

    public void loginFailed(String key) {
        int attempts = attemptsCache.get(key);
        attemptsCache.put(key, attempts + 1);
        log.info("Cache login attempts: {}", attempts);
    }

    public boolean isBlocked(String key) {
        log.info("Attempts: {}", attemptsCache.get(key));
        return attemptsCache.get(key) >= MAX_ATTEMPTS;
    }

    public int getBanDuration() {
        return BAN_DURATION;
    }
}
