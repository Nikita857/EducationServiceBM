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

/**
 * Controller for handling admin-related lesson requests.
 */
@RestController
@RequiredArgsConstructor
public class AdminLessonController {
    private final LessonService lessonService;
    private final LessonRepository lessonRepository;

    /**
     * Gets a paginated list of lessons.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param moduleId The ID of the module to filter by, or 0 to retrieve all
     *                 lessons.
     * @return A response entity containing the paginated list of lessons.
     */
    @GetMapping("/admin/lessons")
    public ResponseEntity<?> getLessonsWithPagination(@RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "0") Long moduleId) {
        try {
            Page<LessonResponseDTO> lessons = lessonService.putLessonsInDTO(page, size, moduleId);
            return ResponseEntity.ok(
                    ApiResponse.paginated(lessons));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal Server Error: %s", e.getMessage())));
        }
    }

    /**
     * Deletes a lesson by its ID.
     *
     * @param id The ID of the lesson to delete.
     * @return A response entity indicating that the lesson was deleted
     *         successfully, or an error if the lesson was not found.
     */
    @DeleteMapping("/admin/lessons/{id}/delete")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        if (!lessonRepository.existsById(id))
            return ResponseEntity.notFound().build();
        try {
            lessonRepository.deleteById(id);
            boolean isDelete = lessonRepository.existsById(id);
            if (!isDelete) {
                return ResponseEntity.ok().body(
                        ApiResponse.success(null));
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ApiResponse.error(
                            String.format("Урок с ID: %d не найден", id)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }

    /**
     * Gets a lesson for editing.
     *
     * @param id The ID of the lesson to get.
     * @return A response entity containing the lesson to edit.
     */
    @GetMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> getLessonForEdit(@PathVariable Long id) {
        try {
            Lesson lesson = lessonRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException(
                            String.format("Урок с ID: %d не найден", id)));

            LessonDto lessonDto = new LessonDto(
                    lesson.getTitle(),
                    lesson.getDescription(),
                    lesson.getVideo());

            return ResponseEntity.ok(
                    ApiResponse.success(lessonDto));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Error: %s", e.getMessage())));
        }
    }

    /**
     * Updates a lesson.
     *
     * @param id        The ID of the lesson to update.
     * @param lessonDto The DTO containing the updated lesson details.
     * @return A response entity indicating that the lesson was updated
     *         successfully.
     */
    @PutMapping("/api/admin/lessons/{id}")
    public ResponseEntity<?> updateLesson(@PathVariable Long id, @RequestBody LessonDto lessonDto) {
        try {
            lessonService.updateLesson(id, lessonDto);
            return ResponseEntity.ok(
                    ApiResponse.success(String.format("Урок: %d успешно обновлен", id)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(
                    ApiResponse.error(String.format("Internal server error: %s", e.getMessage())));
        }
    }
}