package com.bm.education.controllers;

import com.bm.education.api.ApiResponse;
import com.bm.education.dto.LessonDto;
import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.models.Lesson;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.services.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
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
                                                      @RequestParam(defaultValue = "10") int size,
                                                      @RequestParam(defaultValue = "0") int moduleId){
        try {
            Page<LessonResponseDTO> lessons = lessonService.putLessonsInDTO(page, size, moduleId);
            return ResponseEntity.ok(
                    ApiResponse.paginated(lessons)
            );
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage()))
            );
        }
    }

    @DeleteMapping("/admin/lessons/{id}/delete")
    public ResponseEntity<?> deleteLesson(@PathVariable int id){
        if(!lessonRepository.existsById(id))
            return ResponseEntity.notFound().build();
        try {
            lessonRepository.deleteById(id);
            boolean isDelete = lessonRepository.existsById(id);
            if(!isDelete) {
                return ResponseEntity.ok().body(
                        ApiResponse.success(null)
                );
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(String.format("lesson not found for id %d", id))
            );
        }catch (Exception e){
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Error: %s", e.getMessage()))
            );
        }
    }

    @GetMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> getLessonForEdit(@PathVariable int id) {
        try {
            Lesson lesson = lessonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

            LessonDto lessonDto = new LessonDto();
            lessonDto.setTitle(lesson.getTitle());
            lessonDto.setTextContent(lesson.getDescription());
            lessonDto.setVideoUrl(lesson.getVideo());

            return ResponseEntity.ok(
                    ApiResponse.success(lessonDto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Error: %s", e.getMessage())));
        }
    }

    @PutMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable int id, @RequestBody LessonDto lessonDto) {
        try {
            lessonService.updateLesson(id, lessonDto);
            return ResponseEntity.ok(
                    ApiResponse.success(String.format("Lesson successfully updated with id %d", id))
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage()))
            );
        }
    }
}
