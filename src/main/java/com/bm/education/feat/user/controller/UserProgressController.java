package com.bm.education.feat.user.controller;

import com.bm.education.feat.user.dto.UserProgressRequestDto;
import com.bm.education.feat.user.service.UserProgressService;
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
     * @return A response entity indicating that the progress was saved
     *         successfully.
     */
    @PostMapping
    public ResponseEntity<?> saveUserProgress(@RequestBody UserProgressRequestDto request) {
        try {
            userProgressService.saveProgress(
                    request.userId(),
                    request.courseId(),
                    request.moduleId(),
                    request.lessonId());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error saving progress");
        }
    }
}