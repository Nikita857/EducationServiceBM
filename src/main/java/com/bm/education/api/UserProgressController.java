package com.bm.education.api;

import com.bm.education.dto.UserProgressRequestDto;
import com.bm.education.services.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller for handling user progress requests.
 */
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;

    /**
     * Saves the progress of a user for a lesson.
     *
     * @param request The request object containing the user progress details.
     * @return A response entity indicating that the progress was saved successfully.
     */
    @PostMapping
    public ResponseEntity<?> saveUserProgress(@RequestBody UserProgressRequestDto request) {
        try {
            userProgressService.saveProgress(
                    request.getUserId(),
                    request.getCourseId(),
                    request.getModuleId(),
                    request.getLessonId()
            );
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving progress");
        }
    }
}