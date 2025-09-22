package com.bm.education.services;

import com.bm.education.Exceptions.ApiException;
import com.bm.education.dto.CourseSelectionDTO;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.dto.UserUpdateRequestDTO;
import com.bm.education.dto.auth.RegisterRequest;
import com.bm.education.models.Role;
import com.bm.education.models.User;
import com.bm.education.models.UserCourses;
import com.bm.education.repositories.*;
import com.bm.education.models.Course;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for managing users.
 */
@Service

@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserCourseRepository userCourseRepository;
    private final CoursesRepository coursesRepository;
    private final NotificationRepository notificationRepository;
    private final OfferRepository offerRepository;
    private final UserProgressRepository userProgressRepository;

    /**
     * Enrolls a user in a course.
     *
     * @param userId The ID of the user.
     * @param courseId The ID of the course.
     * @return true if the user was enrolled successfully, false otherwise.
     * @throws EntityNotFoundException if the user or course is not found.
     */
    @Transactional
    public boolean enrollUserInCourse(Integer userId, Integer courseId) {
        if (userCourseRepository.existsByUserAndCourse(userRepository.findById(userId).get(), coursesRepository.findById(courseId).get())) {
            
            return false;
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
        Course course = coursesRepository.findById(courseId).orElseThrow(() -> new EntityNotFoundException("Course not found"));

        UserCourses enrollment = new UserCourses();
        enrollment.setUser(user);
        enrollment.setCourse(course);

        userCourseRepository.save(enrollment);
        
        return true;
    }

    /**
     * Finds a user by their ID.
     *
     * @param userId The ID of the user.
     * @return The user with the specified ID.
     * @throws EntityNotFoundException if the user is not found.
     */
    @Transactional
    public User findById(Integer userId) {
        return userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    /**
     * Deletes a user by their ID.
     *
     * @param id The ID of the user to delete.
     * @return true if the user was deleted successfully, false otherwise.
     * @throws EntityNotFoundException if the user is not found.
     */
    public boolean deleteUser(Integer id) {
        userRepository.deleteById(id);
        return userRepository.existsById(id);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    /**
     * Creates a new user.
     *
     * @param user The user to create.
     * @throws ApiException if the username already exists.
     */
    @Transactional
    public void createUser(User user) {

        if (userRepository.existsByUsername(user.getUsername())) {
            throw new ApiException("Username already exists", HttpStatus.CONFLICT);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.getRoles().add(Role.ROLE_USER);
        user.setAvatar("avatar.png");

        userRepository.save(user);
    }

    /**
     * Gets a user by their username.
     *
     * @param username The username of the user.
     * @return The user with the specified username, or null if not found.
     */
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

    private static final String UPLOAD_DIR = "uploads/avatars/";

    /**
     * Updates the avatar of a user.
     *
     * @param userId The ID of the user.
     * @param avatarPath The path to the new avatar.
     * @throws FileNotFoundException if the avatar file is not found.
     */
    @Transactional
    public void updateUserAvatar(Integer userId, String avatarPath) throws FileNotFoundException {
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

    /**
     * Deletes the old avatar of a user.
     *
     * @param avatarPath The path to the old avatar.
     * @throws FileNotFoundException if the avatar file is not found.
     */
    @Transactional
    protected void deleteOldAvatar(String avatarPath) throws FileNotFoundException {
        try {
            String filename = avatarPath.substring(avatarPath.lastIndexOf("/") + 1);
            Path oldAvatarPath = Paths.get(UPLOAD_DIR).resolve(filename);

            if (Files.exists(oldAvatarPath)) {
                Files.delete(oldAvatarPath);
            }
        } catch (IOException e) {
            throw new FileNotFoundException(String.format("Ошибка удаления файла: %s",e.getMessage()));
        }
    }

    /**
     * Changes the password of a user.
     *
     * @param username The username of the user.
     * @param currentPassword The current password of the user.
     * @param newPassword The new password of the user.
     * @param confirmPassword The confirmation of the new password.
     * @throws RuntimeException if the user is not found, the current password is incorrect, the new password and confirmation do not match, or the new password is the same as the old password.
     */
    @Transactional
    public void changePassword(String username, String currentPassword,
                               String newPassword, String confirmPassword) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new RuntimeException("Текущий пароль неверен");
        }
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Новый пароль и подтверждение не совпадают");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("Новый пароль должен отличаться от старого");
        }
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    /**
     * Gets the total number of users.
     *
     * @return The total number of users.
     */
    @Transactional(readOnly = true)
    public long getUsersCount() {
        return userRepository.count();
    }

    /**
     * Converts a user to a UserResponseDTO.
     *
     * @param user The user to convert.
     * @return The converted UserResponseDTO.
     */
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
                user.getCreatedAt().toString(),
                user.getRoles().toString()
        );
    }

    /**
     * Gets a paginated list of all users as DTOs.
     *
     * @param page The page number.
     * @param size The page size.
     * @param role The role to filter by, or "ALL" to retrieve all users.
     * @return A paginated list of all users as DTOs.
     */
    @Transactional(readOnly = true)
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

    /**
     * Gets a user by their ID as a DTO.
     *
     * @param userId The ID of the user.
     * @return The user with the specified ID as a DTO.
     */
    public UserResponseDTO getUserById(Integer userId) {
        return convertToUserDTO(userRepository.findById(userId).isPresent() ? userRepository.findById(userId).get() : new User());
    }

    /**
     * Updates a user by their ID.
     *
     * @param userUpdateRequestDTO The request object containing the updated user details.
     * @return true if the user was updated successfully, false otherwise.
     * @throws ApiException if the role is invalid.
     */
    @Modifying
    @Transactional
    public boolean updateUserById(UserUpdateRequestDTO userUpdateRequestDTO) {
        try {
            User user = userRepository.findById(userUpdateRequestDTO.getUserId()).orElse(null);

            Objects.requireNonNull(user).setDepartment(userUpdateRequestDTO.getDepartment());
            user.setJobTitle(userUpdateRequestDTO.getJobTitle());
            user.setQualification(userUpdateRequestDTO.getQualification());

            try {
                Role newRole = null;
                if (userUpdateRequestDTO.getRole().isEmpty()) {
                    newRole = user.getRoles().stream().findFirst().get();
                }else {
                    Role.valueOf(userUpdateRequestDTO.getRole());
                }
                user.setRoles(Set.of(Objects.requireNonNull(newRole)));
                
            } catch (IllegalArgumentException e) {
                
                throw new ApiException("Неверно указана роль: " + userUpdateRequestDTO.getRole(), HttpStatus.BAD_REQUEST);
            }

            return true;
        } catch (Exception e) {
            
            return false;
        }
    }

    /**
     * Gets all courses for a user.
     *
     * @param userId The ID of the user.
     * @return A list of courses for the user.
     * @throws EntityNotFoundException if the user is not found.
     */
    @Transactional
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

    /**
     * Unenrolls a user from a course.
     *
     * @param userId The ID of the user.
     * @param courseId The ID of the course.
     * @return true if the user was unenrolled successfully, false otherwise.
     * @throws EntityNotFoundException if the user or course is not found.
     */
    @Transactional
    public boolean unenrollUserFromCourse(Integer userId, Integer courseId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
        Course course = coursesRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

        if (!userCourseRepository.existsByUserAndCourse(user, course)) {
            
            return false; // Или выбросить исключение
        }

        userCourseRepository.deleteByUserAndCourse(user, course);
        
        return true;
    }

    public User registerDtoToUser(@NotNull RegisterRequest registerRequest) {
        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setDepartment(registerRequest.getDepartment());
        user.setJobTitle(registerRequest.getJobTitle());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());

        return user;
    }

}