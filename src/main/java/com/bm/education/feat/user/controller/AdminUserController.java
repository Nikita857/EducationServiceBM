package com.bm.education.feat.user.controller;

import com.bm.education.shared.common.ApiResponse;
import com.bm.education.feat.user.dto.UserEnrollmentRequestDTO;
import com.bm.education.feat.user.dto.UserResponse;
import com.bm.education.feat.user.dto.UserUpdateRequestDTO;
import com.bm.education.feat.course.model.Course;
import com.bm.education.feat.course.service.CoursesService;
import com.bm.education.feat.notification.service.NotificationService;
import com.bm.education.feat.user.service.UserService;
import jakarta.validation.Valid;
import com.bm.education.shared.validation.ValidationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller for handling admin-related user requests.
 */
@RequiredArgsConstructor

@RestController
@Tag(name = "Admin User Management", description = "Endpoints for managing users, enrollments, and progress")
public class AdminUserController {
    private final UserService userService;
    private final NotificationService notificationService;
    private final CoursesService coursesService;
    private final ValidationService validationService;

    /**
     * Gets a paginated list of all users.
     *
     * @param page The page number.
     * @param size The page size.
     * @param role The role to filter by, or "ALL" to retrieve all users.
     * @return A response entity containing the paginated list of all users.
     */
    @GetMapping("/admin/users")
    @Operation(summary = "Get all users", description = "Retrieve a paginated list of all users filtered by role")
    public ApiResponse<?> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam String role) {

        Page<UserResponse> usersPage = userService.getAllUsersByDTO(page, size, role);
        return ApiResponse.paginated(usersPage);
    }

    /**
     * Deletes a user by their ID.
     *
     * @param request The request body containing the user ID.
     * @return A response entity indicating that the user was deleted successfully.
     */
    @PostMapping("/admin/users/delete")
    @Operation(summary = "Delete user", description = "Soft delete or permanently delete a user by ID")
    public ApiResponse<Void> deleteUserById(@RequestBody Map<String, Long> request) {
        Long userId = request.get("userId");
        boolean isDelete = userService.deleteUser(userId);

        if (isDelete) {
            return ApiResponse.success(String.format("Пользователь %d успешно удален", userId));
        } else {
            return ApiResponse.error("Ошибка удаления пользователя");
        }
    }

    /**
     * Gets a user by their ID.
     *
     * @param id The ID of the user to get.
     * @return A response entity containing the user.
     */
    @GetMapping("/admin/user/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieve detailed information about a specific user")
    public ApiResponse<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse userResponse = userService.getUserById(id);
        if (userResponse != null) {
            return ApiResponse.success(userResponse);
        } else {
            return ApiResponse.error(String.format("Пользователь с ID: %d не найден", id), HttpStatus.NOT_FOUND);
        }
    }

    /**
     * Gets all courses for a user.
     *
     * @param id The ID of the user.
     * @return A response entity containing a list of all courses for the user.
     */
    @GetMapping("/admin/user/{id}/courses")
    @Operation(summary = "Get user courses", description = "Retrieve list of courses enrolled by the user")
    public ApiResponse<?> getUserCourses(@PathVariable Long id) {
        return ApiResponse.success(userService.getUserCourses(id));
    }

    /**
     * Updates a user by their ID.
     *
     * @param updateRequestDTO The request object containing the updated user
     *                         details.
     * @param bindingResult    The result of the validation.
     * @return A response entity indicating that the user was updated successfully.
     */
    @PostMapping("/admin/user/update")
    @Operation(summary = "Update user", description = "Update user details like department, role, etc.")
    public ApiResponse<?> updateUserById(@Valid @RequestBody UserUpdateRequestDTO updateRequestDTO,
            BindingResult bindingResult) {

        validationService.validate(bindingResult);

        if (userService.updateUserById(updateRequestDTO)) {
            return ApiResponse.success(updateRequestDTO);
        } else {
            return ApiResponse.error(String.format("Не удалось обновить данные пользователя: %s",
                    updateRequestDTO.userId()));
        }
    }

    /**
     * Enrolls a user in a course.
     *
     * @param request       The request object containing the user and course IDs.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the user was enrolled successfully.
     */
    @PostMapping("/admin/user/enroll")
    @Operation(summary = "Enroll user", description = "Enroll a user into a specific course")
    public ApiResponse<Void> enrollUserInCourse(@Valid @RequestBody UserEnrollmentRequestDTO request,
            BindingResult bindingResult) {

        validationService.validate(bindingResult);

        boolean isEnrolled = userService.enrollUserInCourse(request.userId(), request.courseId());

        if (isEnrolled) {
            Course userEnrolledCourse = coursesService.findCourseById(request.courseId());
            notificationService.createNotification(
                    userService.findById(request.userId()),
                    String.format("Вас записали на курс %s", userEnrolledCourse.getTitle()),
                    String.format("/course/%s", userEnrolledCourse.getSlug()));
            return ApiResponse.success("Пользователь успешно записан на курс.");
        } else {
            return ApiResponse.error("Пользователь уже записан на этот курс или произошла ошибка.");
        }
    }

    /**
     * Unenrolls a user from a course.
     *
     * @param request       The request object containing the user and course IDs.
     * @param bindingResult The result of the validation.
     * @return A response entity indicating that the user was unenrolled
     *         successfully.
     */
    @PostMapping("/admin/user/unenroll")
    @Operation(summary = "Unenroll user", description = "Remove a user from a course")
    public ApiResponse<Void> unenrollUserFromCourse(
            @Valid @RequestBody UserEnrollmentRequestDTO request, BindingResult bindingResult) {

        validationService.validate(bindingResult);

        boolean isUnenrolled = userService.unenrollUserFromCourse(request.userId(), request.courseId());

        if (isUnenrolled) {
            return ApiResponse.success("Пользователь успешно отписан от курса.");
        } else {
            return ApiResponse.error("Произошла ошибка. Возможно, пользователь не был записан на этот курс.");
        }
    }
}