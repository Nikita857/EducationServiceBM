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

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Controller for handling admin-related user requests.
 */
@RequiredArgsConstructor

@RestController
public class AdminUserController {
    private final UserService userService;
    private final NotificationService notificationService;
    private final CoursesService coursesService;

    /**
     * Gets a paginated list of all users.
     *
     * @param page The page number.
     * @param size The page size.
     * @param role The role to filter by, or "ALL" to retrieve all users.
     * @return A response entity containing the paginated list of all users.
     */
    @GetMapping("/admin/users")
    public ResponseEntity<ApiResponse<?>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String role) {
        try {
            Page<UserResponseDTO> usersPage = userService.getAllUsersByDTO(page, size, role);
            return ResponseEntity.ok(ApiResponse.paginated(usersPage));
        } catch (Exception e) {
            
            return ResponseEntity.internalServerError().body(ApiResponse.error("Internal server error"));
        }
    }

    /**
     * Deletes a user by their ID.
     *
     * @param request The request body containing the user ID.
     * @return A response entity indicating that the user was deleted successfully.
     */
    @PostMapping("/admin/users/delete")
    public ResponseEntity<ApiResponse<Void>> deleteUserById(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            
            boolean isDelete = userService.deleteUser(userId);
            
            if (isDelete) {
                return ResponseEntity.ok(ApiResponse.success(String.format("Пользователь %d успешно удален", userId)));
            } else {
                return ResponseEntity.badRequest().body(ApiResponse.error("Ошибка удаления пользователя"));
            }
        } catch (Exception e) {
            
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Gets a user by their ID.
     *
     * @param id The ID of the user to get.
     * @return A response entity containing the user.
     */
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

    /**
     * Gets all courses for a user.
     *
     * @param id The ID of the user.
     * @return A response entity containing a list of all courses for the user.
     */
    @GetMapping("/admin/user/{id}/courses")
    public ResponseEntity<ApiResponse<?>> getUserCourses(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(ApiResponse.success(userService.getUserCourses(id)));
        } catch (Exception e) {
            
            return ResponseEntity.internalServerError().body(ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    /**
     * Updates a user by their ID.
     *
     * @param updateRequestDTO The request object containing the updated user details.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the user was updated successfully.
     */
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
            
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage()))
            );
        }
    }

    /**
     * Enrolls a user in a course.
     *
     * @param request The request object containing the user and course IDs.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the user was enrolled successfully.
     */
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
            
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }

    /**
     * Unenrolls a user from a course.
     *
     * @param request The request object containing the user and course IDs.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the user was unenrolled successfully.
     */
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
            
            return ResponseEntity.internalServerError().body(ApiResponse.error(e.getMessage()));
        }
    }
}