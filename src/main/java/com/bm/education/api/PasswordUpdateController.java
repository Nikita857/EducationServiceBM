package com.bm.education.api;

import com.bm.education.services.UserService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling password update requests.
 */
@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class PasswordUpdateController {

    private final UserService userService;

    /**
     * Changes the password of the authenticated user.
     *
     * @param userDetails The authentication object for the current user.
     * @param request The request object containing the current and new passwords.
     * @return A response entity indicating that the password was changed successfully, or an error if the password could not be changed.
     */
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
            
            return ResponseEntity.badRequest().body(
                    new PasswordChangeResponse("error", e.getMessage())
            );
        }
    }

    /**
     * Data transfer object for a password change request.
     */
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

    /**
     * Data transfer object for a password change response.
     */
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