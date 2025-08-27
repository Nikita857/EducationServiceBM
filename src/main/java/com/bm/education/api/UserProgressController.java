package com.bm.education.api;

import com.bm.education.dto.UserProgressRequestDto;
import com.bm.education.services.UserProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class UserProgressController {

    private final UserProgressService userProgressService;

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