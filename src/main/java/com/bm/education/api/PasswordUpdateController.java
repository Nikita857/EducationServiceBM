package com.bm.education.api;

import com.bm.education.models.User;
import com.bm.education.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class PasswordUpdateController {

    private final UserService userService;

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(Authentication userDetails,
                                            @RequestBody PasswordChangeRequest request) {

        try {
            userService.changePassword(
                    userDetails.getName(),
                    request.getCurrentPassword(),
                    request.getNewPassword(),
                    request.getConfirmPassword()
            );

            return ResponseEntity.ok().body(
                    new PasswordChangeResponse("success", "Пароль успешно изменен")
            );

        } catch (Exception e) {
            log.error("Ошибка при изменении пароля: {}", e.getMessage());
            return ResponseEntity.badRequest().body(
                    new PasswordChangeResponse("error", e.getMessage())
            );
        }
    }

    // DTO для запроса
    public static class PasswordChangeRequest {
        private String currentPassword;
        private String newPassword;
        private String confirmPassword;

        // Getters and Setters
        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
        public String getConfirmPassword() { return confirmPassword; }
        public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
    }

    // DTO для ответа
    public static class PasswordChangeResponse {
        private String status;
        private String message;

        public PasswordChangeResponse(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() { return status; }
        public String getMessage() { return message; }
    }
}
