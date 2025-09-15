package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.UserEnrollmentRequestDTO;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.dto.UserUpdateRequestDTO;
import com.bm.education.models.Course;
import com.bm.education.services.CoursesService;
import com.bm.education.services.NotificationService;
import com.bm.education.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RequiredArgsConstructor
@Slf4j
@RestController
public class AdminUserController {
    private final UserService userService;
    private final NotificationService notificationService;
    private final CoursesService coursesService;

    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String role) {
        try {
            Page<UserResponseDTO> usersPage = userService.getAllUsersByDTO(page, size, role);
            return ResponseEntity.ok(ApiResponse.paginated(usersPage));
        } catch (Exception e) {
            log.error("Error getting users: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error("Internal server error"));
        }
    }

    @PostMapping("/admin/users/delete")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            log.debug("Deleting user: {}", userId);
            boolean isDelete = userService.deleteUser(userId);
            log.debug("User deleted: {}", isDelete);
            if (isDelete) {
                return ResponseEntity.ok(ApiResponse.success(String.format("Пользователь %d успешно удален", userId)));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Ошибка удаления пользователя"));
            }
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<ApiResponse<?>> getUserById(@PathVariable Integer id) {
        try {
            UserResponseDTO userResponseDTO = userService.getUserById(id);
            if (userResponseDTO != null) {
                return ResponseEntity.ok(ApiResponse.success(userResponseDTO));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ApiResponse.error(String.format("Пользователь с ID: %d не найден", id)));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage()))
            );
        }
    }

    @GetMapping("/admin/user/{id}/courses")
    public ResponseEntity<ApiResponse<?>> getUserCourses(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(userService.getUserCourses(id)));
        } catch (Exception e) {
            log.error("Error getting user courses: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    @PostMapping("/admin/user/update")
    public ResponseEntity<ApiResponse<?>> updateUserById(@Valid @RequestBody UserUpdateRequestDTO updateRequestDTO,
                                                                                BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError ->
                    errors.put(fieldError.getField(), fieldError.getDefaultMessage()));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            if (userService.updateUserById(updateRequestDTO)) {
                return ResponseEntity.ok(ApiResponse.success(updateRequestDTO));
            } else {
                return ResponseEntity.internalServerError().body(
                        ApiResponse.error(String.format("Не удалось обновить данные пользователя: %s", updateRequestDTO.getUserId()))
                );
            }
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage()))
            );
        }
    }

    @PostMapping("/admin/user/enroll")
    public ResponseEntity<ApiResponse<Void>> enrollUserInCourse(@Valid @RequestBody UserEnrollmentRequestDTO request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> errors.put(error.getObjectName(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            boolean isEnrolled = userService.enrollUserInCourse(request.getUserId(), request.getCourseId());

            if (isEnrolled) {
                Course userEnrolledCourse = coursesService.findCourseById(request.getCourseId());
                notificationService.createNotification(
                        userService.findById(request.getUserId()),
                        String.format("Вас записали на курс %s", userEnrolledCourse.getTitle()),
                        String.format("/course/%s", userEnrolledCourse.getSlug())
                );
                return ResponseEntity.ok(ApiResponse.success("Пользователь успешно записан на курс."));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Пользователь уже записан на этот курс или произошла ошибка."));
            }
        } catch (Exception e) {
            log.error("Error enrolling user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/admin/user/unenroll")
    public ResponseEntity<ApiResponse<Void>> unenrollUserFromCourse(@Valid @RequestBody UserEnrollmentRequestDTO request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getAllErrors().forEach(error -> errors.put(error.getObjectName(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(ApiResponse.validationError(errors));
        }

        try {
            boolean isUnenrolled = userService.unenrollUserFromCourse(request.getUserId(), request.getCourseId());

            if (isUnenrolled) {
                return ResponseEntity.ok(ApiResponse.success("Пользователь успешно отписан от курса."));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Произошла ошибка. Возможно, пользователь не был записан на этот курс."));
            }
        } catch (Exception e) {
            log.error("Error unenrolling user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }
}