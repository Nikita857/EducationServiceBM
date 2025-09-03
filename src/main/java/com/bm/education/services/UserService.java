package com.bm.education.services;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.dto.UserUpdateRequestDTO;
import com.bm.education.models.Role;
import com.bm.education.models.User;
import com.bm.education.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean deleteUser(Integer userId) {
        userRepository.deleteById(userId);
        return userRepository.existsById(userId) ? false : true;
    }

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

    private UserResponseDTO convertToUserDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getDepartment(),
                user.getJobTitle(),
                user.getQualification(),
                user.getUsername(),
                user.getAvatar(),
                user.getCreatedAt(),
                user.getRoles().toString()
                );
    }

    public Page<UserResponseDTO> getAllUsersByDTO(Integer page, Integer size) {
        // Создаем объект пагинации (Spring Data pages are 0-based)
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());

        // Получаем пагинированный результат
        Page<User> usersPage = userRepository.findAll(pageable);

        // Конвертируем в DTO
        return usersPage.map(this::convertToUserDTO);
    }
    public UserResponseDTO getUserById(Integer userId) {
        return convertToUserDTO(userRepository.findById(userId).isPresent() ? userRepository.findById(userId).get() : new User());
    }

    @Modifying
    @Transactional
    public boolean updateUserById(UserUpdateRequestDTO userUpdateRequestDTO) {
        try {
            User user = userRepository.findById(userUpdateRequestDTO.getUserId()).orElse(null);

            user.setDepartment(userUpdateRequestDTO.getDepartment());
            user.setJobTitle(userUpdateRequestDTO.getJobTitle());
            user.setQualification(userUpdateRequestDTO.getQualification());


            if(userUpdateRequestDTO.getRole() != null) {
                if (user.getRoles().toArray()[0].toString() == Role.ROLE_USER.toString()) {
                    user.setRoles(Set.of(Role.ROLE_USER));
                }else{
                    user.setRoles(Set.of(Role.ROLE_ADMIN));
                }
            }
            return true;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

}
