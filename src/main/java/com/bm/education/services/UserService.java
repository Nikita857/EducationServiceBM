package com.bm.education.services;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.models.Role;
import com.bm.education.models.User;
import com.bm.education.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean createUser(User user) {

    if (userRepository.existsByUsername(user.getUsername())) {
        throw new ApiException("Username already exists", HttpStatus.CONFLICT);
    }

    user.setPassword(passwordEncoder.encode(user.getPassword()));
    user.setCreatedAt(Instant.now());
    user.setUpdatedAt(Instant.now());
    user.getRoles().add(Role.ROLE_USER);//Enum ролей, в будущем легко расшириить
    user.setAvatar("avatar.png");//Дефолтная аватарка

    log.info("Saving new User with role: {}", Role.ROLE_USER);

    userRepository.save(user);
    return true;

    }

    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    private static final String UPLOAD_DIR = "uploads/avatars/";

    @Transactional
    public void updateUserAvatar(Integer userId, String avatarPath) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Удаляем старый аватар если он не дефолтный
        String oldAvatar = user.getAvatar();
        if (oldAvatar != null && !oldAvatar.startsWith("/default")) {
            deleteOldAvatar(oldAvatar);
        }

        user.setAvatar(avatarPath);
        userRepository.save(user);
    }

    private void deleteOldAvatar(String avatarPath) {
        try {
            String filename = avatarPath.substring(avatarPath.lastIndexOf("/") + 1);
            Path oldAvatarPath = Paths.get(UPLOAD_DIR).resolve(filename);

            if (Files.exists(oldAvatarPath)) {
                Files.delete(oldAvatarPath);
            }
        } catch (IOException e) {
            // Логируем ошибку, но не прерываем выполнение
            System.err.println("Ошибка при удалении старого аватара: " + e.getMessage());
        }
    }

    @Transactional
    public void changePassword(String username, String currentPassword,
                               String newPassword, String confirmPassword) {

        // Находим пользователя
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        // Проверяем текущий пароль
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Текущий пароль неверен");
        }

        // Проверяем что новый пароль и подтверждение совпадают
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Новый пароль и подтверждение не совпадают");
        }

        // Проверяем что новый пароль отличается от старого
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("Новый пароль должен отличаться от старого");
        }

        // Обновляем пароль
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        log.info("Пароль изменен для пользователя: {}", username);
    }

    public List<User> getAllUsers() {return userRepository.findAll();}

}
