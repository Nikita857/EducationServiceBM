package com.bm.education.controllers;

import com.bm.education.dto.UserEnrollmentRequestDTO;
import com.bm.education.dto.UserResponseDTO;
import com.bm.education.dto.UserUpdateRequestDTO;
import com.bm.education.models.Course;
import com.bm.education.models.Notification;
import com.bm.education.services.CoursesService;
import com.bm.education.services.NotificationService;
import com.bm.education.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
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
    ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "1", name = "page") int page,
            @RequestParam(defaultValue = "10", required = false, name = "size") int size) {

        try {
            Map<String, Object> response = new HashMap<>();

            // Получаем пагинированный список
            Page<UserResponseDTO> usersPage = userService.getAllUsersByDTO(page, size);

            response.put("success", true);
            response.put("users", usersPage.getContent());
            response.put("currentPage", usersPage.getNumber() + 1); // Spring Data pages are 0-based
            response.put("totalPages", usersPage.getTotalPages());
            response.put("totalItems", usersPage.getTotalElements());
            response.put("pageSize", size);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error getting users: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "error", "Internal server error"));
        }
    }

    @PostMapping("/admin/users/delete")
    ResponseEntity<?> deleteUserById(@RequestBody Map<String, Integer> request) {
        try {
            Integer userId = request.get("userId");
            log.debug("Deleting user: {}", userId);
            Map<String, Object> response = new HashMap<>();
            boolean isDelete = userService.deleteUser(userId);
            log.debug("User deleted: {}", isDelete);
            if (isDelete) {
                response.put("success", isDelete);
                response.put("message", String.format("Пользователь %d успешно удален",userId));
                return ResponseEntity.ok(response);
            }else {
                response.put("success", isDelete);
                response.put("message", "Ошибка удаления пользователя");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error deleting user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(
                    Map.of("error", e.getMessage())
            );
        }
    }

    @GetMapping("/admin/user/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        try {
            Map<String, Object> response = new HashMap<>();
            UserResponseDTO userResponseDTO = userService.getUserById(id);
            if(userResponseDTO != null) {
                response.put("success", true);
                response.put("user", userResponseDTO);
                return ResponseEntity.ok(response);
            }else{
                response.put("success", true);
                response.put("error", "User not found");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/admin/user/{id}/courses")
    public ResponseEntity<?> getUserCourses(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(Map.of("success", true, "courses", userService.getUserCourses(id)));
        } catch (Exception e) {
            log.error("Error getting user courses: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    @PostMapping("/admin/user/update")
    public ResponseEntity<?> updateUserById(@Valid @RequestBody UserUpdateRequestDTO updateRequestDTO,
                                            BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(fieldError -> {
                errors.put(fieldError.getField(), fieldError.getDefaultMessage());
            });
            return ResponseEntity.badRequest().body(Map.of( "errors", errors));
        }

        try {
            if(userService.updateUserById(updateRequestDTO)) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "user", updateRequestDTO)
                );
            }else{
                return ResponseEntity.internalServerError().body(Map.of(
                        "success", false,
                        "error", "Internal server error")
                );
            }
        } catch (Exception e) {
            log.error("Error updating user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of(
                    "error", e.getMessage())
            );
        }
    }

    @PostMapping("/admin/user/enroll")
    public ResponseEntity<?> enrollUserInCourse(@Valid @RequestBody UserEnrollmentRequestDTO request, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, Object> errors = new HashMap<>();
            bindingResult
                    .getAllErrors()
                    .forEach(error -> {
                        errors.put(error.getObjectName(), error.getDefaultMessage());
                    });
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            boolean isEnrolled = userService.enrollUserInCourse(request.getUserId(), request.getCourseId());

            if (isEnrolled) {
                Course userEnrolledCourse = coursesService.findCourseById(request.getCourseId());
                notificationService.createNotification(
                        userService.findById(request.getUserId()),
                        String.format("Вас записали на курс %s", userEnrolledCourse.getTitle()),
                        String.format("/courses/%s", userEnrolledCourse.getSlug())
                );
                return ResponseEntity.ok(Map.of("success", true, "message", "Пользователь успешно записан на курс."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Пользователь уже записан на этот курс или произошла ошибка."));
            }
        } catch (Exception e) {
            log.error("Error enrolling user: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
