package com.bm.education.services;

import com.bm.education.dto.*;
import com.bm.education.models.Lesson;
import com.bm.education.models.Module;
import com.bm.education.models.User;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.repositories.ModuleRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Service for managing lessons.
 */
@Service

@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;
    private final UserService userService;
    private final ModuleService moduleService;

    /**
     * Gets a lesson by its ID and module ID.
     *
     * @param id The ID of the lesson.
     * @param moduleId The ID of the module.
     * @return The lesson with the specified ID and module ID, or null if not found.
     */
    @Transactional
    public Lesson getLesson(int id, int moduleId) {
        return lessonRepository.findLessonByIdAndModuleId(id, moduleId).orElse(null);
    }

    /**
     * Gets all lessons for a module.
     *
     * @param moduleId The ID of the module.
     * @return A list of lessons for the module.
     */
    @Transactional
    public List<Lesson> getLessonIds(int moduleId) {
        return lessonRepository.findLessonsByModuleId(moduleId);
    }

    /**
     * Gets the total number of lessons.
     *
     * @return The total number of lessons.
     */
    @Transactional
    public long getLessonsCount() {return lessonRepository.count();}

    /**
     * Converts a lesson to a LessonRequestDTO.
     *
     * @param lesson The lesson to convert.
     * @return The converted LessonRequestDTO.
     */
    public LessonRequestDTO convertToDTO(Lesson lesson) {
        LessonRequestDTO lessonDTO = new LessonRequestDTO();
        lessonDTO.setId(lesson.getId());
        lessonDTO.setTitle(lesson.getTitle());
        lessonDTO.setModuleName(lesson.getModule().getTitle());
        lessonDTO.setModuleSlug(lesson.getModule().getSlug());
        lessonDTO.setCourseSlug(lesson.getModule().getCourse().getSlug());

        return lessonDTO;
    }

    /**
     * Gets all lessons for a module as a list of DTOs.
     *
     * @param moduleId The ID of the module.
     * @return A list of all lessons for the module as DTOs.
     */
    @Transactional
    public List<LessonRequestDTO> getModuleLessons(Integer moduleId) {
        List<Lesson> lessons = lessonRepository.findLessonsByModuleId(moduleId);
//        Пробегаемся по листу уроков конвертируем каждый обьект lesson в ДТО и собираем кучу дтошек в лист
        return lessons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Counts the number of lessons in a course.
     *
     * @param courseId The ID of the course.
     * @return The number of lessons in the course.
     */
    @Transactional(readOnly = true)
    public Integer countByModuleCourseId(Integer courseId) {
        return lessonRepository.countByModuleCourseId(courseId);
    }

    /**
     * Counts the number of completed lessons in a course for a user.
     *
     * @param courseId The ID of the course.
     * @param userId The ID of the user.
     * @return The number of completed lessons in the course for the user.
     */
    public Integer countCompletedLessons(Integer courseId, Integer userId) {
        return lessonRepository.countCompletedLessons(courseId, userId);
    }

    /**
     * Converts a lesson to a LessonResponseDTO.
     *
     * @param lesson The lesson to convert.
     * @return The converted LessonResponseDTO.
     */
    public LessonResponseDTO convertToLessonResponseDTO(Lesson lesson) {
        LessonResponseDTO lessonResponseDTO = new LessonResponseDTO();
        lessonResponseDTO.setId(lesson.getId());
        lessonResponseDTO.setTitle(lesson.getTitle());
        lessonResponseDTO.setModuleName(lesson.getModule().getTitle());
        lessonResponseDTO.setDescription(lesson.getDescription());
        lessonResponseDTO.setVideo(lesson.getVideo());
        lessonResponseDTO.setTestCode(lesson.getTestCode());
        return lessonResponseDTO;
    }

    /**
     * Gets a paginated list of lessons as DTOs.
     *
     * @param page The page number.
     * @param size The page size.
     * @param moduleId The ID of the module to filter by, or 0 to retrieve all lessons.
     * @return A paginated list of lessons as DTOs.
     */
    public Page<LessonResponseDTO> putLessonsInDTO(Integer page, Integer size, Integer moduleId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Lesson> lessons;
        if(moduleId == 0) {
            lessons = lessonRepository.findAllWithModule(pageable);
        }else{
            lessons = lessonRepository.findByModuleIdWithModule(moduleId, pageable);
        }
        return lessons.map(this::convertToLessonResponseDTO);
    }

    /**
     * Validates the binding result.
     *
     * @param bindingResult The binding result to validate.
     * @return A response entity with the validation errors, or null if there are no errors.
     */
    public ResponseEntity<?> validation(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error ->
                    errors.put(error.getField(), error.getDefaultMessage())
            );
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Ошибки валидации",
                    "errors", errors
            ));
        }
        return null;
    }

    /**
     * Saves a new lesson.
     *
     * @param dto The DTO containing the lesson details.
     * @return The saved lesson.
     */
    public Lesson saveLesson(CreateLessonDTO dto) {
        Module module = moduleRepository.findById(dto.getModuleId()).orElse(null);
        Lesson lesson = new Lesson();
        lesson.setTitle(dto.getTitle());
        lesson.setVideo(dto.getVideo());
        lesson.setDescription(dto.getDescription());
        lesson.setShortDescription(dto.getShortDescription());
        lesson.setTestCode(dto.getTestCode());
        lesson.setModule(module);

        return lessonRepository.save(lesson);
    }

    /**
     * Updates a lesson.
     *
     * @param lessonId The ID of the lesson to update.
     * @param lessonDto The DTO containing the updated lesson details.
     * @return The updated lesson.
     * @throws RuntimeException if the lesson is not found.
     */
    @Transactional
    public Lesson updateLesson(Integer lessonId, LessonDto lessonDto) {
        Lesson lessonToUpdate = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId)); // Or a more specific exception

        lessonToUpdate.setTitle(lessonDto.getTitle());
        lessonToUpdate.setDescription(lessonDto.getTextContent());
        lessonToUpdate.setVideo(lessonDto.getVideoUrl());

        return lessonRepository.save(lessonToUpdate);
    }

    /**
     * Gets a lesson by its video name.
     *
     * @param videoName The name of the video.
     * @return The lesson with the specified video name, or null if not found.
     */
    @Transactional(readOnly = true)
    public Lesson getLessonByVideoName(String videoName) {
       return lessonRepository.findLessonByVideo(videoName).orElse(null);
    }

    /**
     * Gets all lessons with progress for a user in a module.
     *
     * @param userName The username of the user.
     * @param moduleSlug The slug of the module.
     * @return A list of all lessons with progress for the user in the module.
     */
    @Transactional(readOnly = true)
    public List<ViewModuleDto> getLessonsWithProgress(String userName, String moduleSlug) {
        Integer userId = userService.getUserByUsername(userName).getId();
        Integer moduleId = moduleService.getModuleBySlug(moduleSlug).getId();
        List<Object[]> results = lessonRepository.findLessonsByModuleAndUserId(userId, moduleId);
        return results.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Maps an object array to a ViewModuleDto.
     *
     * @param result The object array to map.
     * @return The mapped ViewModuleDto.
     */
    private ViewModuleDto mapToDTO(Object[] result) {
        return new ViewModuleDto(
                ((Integer) result[0]),
                (String) result[1],
                (String) result[2],
                (String) result[3],
                (String) result[4],
                ((Integer) result[5]),
                result[6] != null ? ( (java.sql.Timestamp) result[6]).toLocalDateTime(): null
        );
    }
}