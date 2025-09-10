package com.bm.education.services;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.dto.CourseSelectionDTO;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.dto.UserUpdateRequestDTO;
import com.bm.education.models.Role;
import com.bm.education.models.User;
import com.bm.education.models.UserCourses;
import com.bm.education.repositories.*;
import com.bm.education.models.Course;
import jakarta.persistence.EntityNotFoundException;
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
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserCourseRepository userCourseRepository;
    private final CoursesRepository coursesRepository;
    private final NotificationRepository notificationRepository;
    private final OfferRepository offerRepository;
    private final UserProgressRepository userProgressRepository;

    @Transactional
    public boolean enrollUserInCourse(Integer userId, Integer courseId) {
        if (userCourseRepository.existsByUserAndCourse(userRepository.findById(userId).get(), coursesRepository.findById(courseId).get())) {
            log.warn("User {} is already enrolled in course {}", userId, courseId);
            return false;
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Course course = coursesRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));

        UserCourses enrollment = new UserCourses();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        userCourseRepository.save(enrollment);
        log.info("Successfully enrolled user {} in course {}", userId, courseId);
        return true;
    }

    @Transactional
    public User findById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    @Transactional
    public boolean deleteUser(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found with id: " + userId);
        }

        // 1. Delete related entities from child tables
        notificationRepository.deleteByUser_Id(userId);
        offerRepository.deleteByUser_Id(userId);
        userProgressRepository.deleteByUser_Id(userId);
        userCourseRepository.deleteByUser_Id(userId);

        // 2. Delete from the join table for roles
        userRepository.deleteUserRolesByUserId(userId);

        // 3. Delete the user itself
        userRepository.deleteById(userId);

        return !userRepository.existsById(userId);
    }

    @Transactional
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

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public long getUsersCount() {
        return userRepository.count();
    }

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

    public Page<UserResponseDTO> getAllUsersByDTO(Integer page, Integer size, String role) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<User> usersPage;
        if(!role.equals("ALL")) {
            usersPage = userRepository.findAllByRoles(pageable, Role.valueOf("ROLE_".concat(role)));
        }else{
            usersPage = userRepository.findAll(pageable);
        }
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


            if (userUpdateRequestDTO.getRole() != null) {
                if (user.getRoles().toArray()[0].toString() == Role.ROLE_USER.toString()) {
                    user.setRoles(Set.of(Role.ROLE_USER));
                } else {
                    user.setRoles(Set.of(Role.ROLE_ADMIN));
                }
            }
            return true;
        } catch (Exception e) {
            log.error(e.getMessage());
            return false;
        }
    }

    public List<CourseSelectionDTO> getUserCourses(Integer userId) {
        if (!userRepository.existsById(userId)) {
            throw new EntityNotFoundException("User not found");
        }
            List<UserCourses> enrollments = userCourseRepository.findByUser(userRepository.findById(userId).get());

            return enrollments.stream()
                    .map(UserCourses::getCourse)
                    .map(course -> new CourseSelectionDTO(course.getId(), course.getTitle()))
                    .collect(Collectors.toList());
    }

    @Transactional
    public boolean unenrollUserFromCourse(Integer userId, Integer courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        Course course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

        if (!userCourseRepository.existsByUserAndCourse(user, course)) {
            log.warn("Enrollment for user {} in course {} does not exist.", userId, courseId);
            return false; // Или выбросить исключение
        }

        userCourseRepository.deleteByUserAndCourse(user, course);
        log.info("Successfully unenrolled user {} from course {}", userId, courseId);
        return true;
    }
}