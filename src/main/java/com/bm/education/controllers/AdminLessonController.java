package com.bm.education.controllers;

import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.models.Lesson;
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

    @GetMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> getLessonForEdit(@PathVariable int id) {
        try {
            Lesson lesson = lessonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

            com.bm.education.dto.LessonDto lessonDto = new com.bm.education.dto.LessonDto();
            lessonDto.setTitle(lesson.getTitle());
            lessonDto.setTextContent(lesson.getDescription());
            lessonDto.setVideoUrl(lesson.getVideo());

            return ResponseEntity.ok(lessonDto);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PutMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable int id, @RequestBody com.bm.education.dto.LessonDto lessonDto) {
        try {
            lessonService.updateLesson(id, lessonDto);
            return ResponseEntity.ok(Map.of("success", true, "message", "Lesson updated successfully"));
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
