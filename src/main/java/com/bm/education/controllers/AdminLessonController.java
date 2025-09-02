package com.bm.education.controllers;

import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.models.Lesson;
import com.bm.education.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminLessonController {
    private final LessonService lessonService;

    @GetMapping("/admin/lessons")
    public ResponseEntity<?> getLessonsWithPagination(@RequestParam(defaultValue = "1") int page,
                                                      @RequestParam(defaultValue = "10") int size){
        Map<String, Object> response = new HashMap<>();
        try {
            Page<LessonResponseDTO> lessons = lessonService.putLessonsInDTO(page, size);

            response.put("success", true);
            response.put("lessons", lessons.getContent());
            response.put("currentPage", lessons.getNumber() + 1); // Spring Data pages are 0-based
            response.put("totalPages", lessons.getTotalPages());
            response.put("totalItems", lessons.getTotalElements());
            response.put("pageSize", size);

            return ResponseEntity.ok(response);
        }catch (Exception e){
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
