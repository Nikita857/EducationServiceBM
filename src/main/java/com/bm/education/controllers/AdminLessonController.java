package com.bm.education.controllers;

import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AdminLessonController {
    private final LessonService lessonService;
    private final LessonRepository lessonRepository;

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

    @DeleteMapping("/admin/lessons/{id}/delete")
    public ResponseEntity<?> deleteLesson(@PathVariable int id){
        if(!lessonRepository.existsById(id))
            return ResponseEntity.notFound().build();

        Map<String, Object> response = new HashMap<>();
        try {
            lessonRepository.deleteById(id);
            boolean isDelete = lessonRepository.existsById(id);
            if(!isDelete) {
                response.put("success", true);
                return ResponseEntity.ok().body(response);
            }
            response.put("success", false);
            response.put("error", "lesson not found");
            return ResponseEntity.badRequest().body(response);
        }catch (Exception e){
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
