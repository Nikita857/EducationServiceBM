package com.bm.education.services;

import com.bm.education.dto.CreateLessonDTO;
import com.bm.education.dto.LessonRequestDTO;
import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.models.Lesson;
import com.bm.education.models.Module;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.repositories.ModuleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;
    private final ModuleRepository moduleRepository;

    public Lesson getLesson(int id, int moduleId) {
        return lessonRepository.findLessonByIdAndModuleId(id, moduleId).orElse(null);
    }

    public List<Lesson> getLessonIds(int moduleId) {
        return lessonRepository.findLessonsByModuleId(moduleId);
    }
    public List<Lesson> getAllLessons() {return lessonRepository.findAll();}

    public LessonRequestDTO convertToDTO(Lesson lesson) {
        LessonRequestDTO lessonDTO = new LessonRequestDTO();
        lessonDTO.setId(lesson.getId());
        lessonDTO.setTitle(lesson.getTitle());
        lessonDTO.setModuleName(lesson.getModule().getTitle());
        lessonDTO.setModuleSlug(lesson.getModule().getSlug());
        lessonDTO.setCourseSlug(lesson.getModule().getCourse().getSlug());
        // добавьте все необходимые поля
        return lessonDTO;
    }
    public List<LessonRequestDTO> getModuleLessons(Integer moduleId) {
        List<Lesson> lessons = lessonRepository.findLessonsByModuleId(moduleId);
//        Пробегаемся по листу уроков конвертируем каждый обьект lesson в ДТО и собираем кучу дтошек в лист
        return lessons.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    public Integer countByModuleCourseId(Integer courseId) {
        return lessonRepository.countByModuleCourseId(courseId);
    }

    public Integer countCompletedLessons(Integer courseId, Integer userId) {
        return lessonRepository.countCompletedLessons(courseId, userId);
    }

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

    public Page<LessonResponseDTO> putLessonsInDTO(Integer page, Integer size, Integer moduleId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Lesson> lessons;
        if(moduleId == 0) {
            lessons = lessonRepository.findAll(pageable);
        }else{
            lessons = lessonRepository.findByModuleId(moduleId, pageable);
        }
        return lessons.map(this::convertToLessonResponseDTO);
    }

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

    public Lesson updateLesson(Integer lessonId, com.bm.education.dto.LessonDto lessonDto) {
        Lesson lessonToUpdate = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId)); // Or a more specific exception

        lessonToUpdate.setTitle(lessonDto.getTitle());
        lessonToUpdate.setDescription(lessonDto.getTextContent());
        lessonToUpdate.setVideo(lessonDto.getVideoUrl());

        return lessonRepository.save(lessonToUpdate);
    }

    public Lesson getLessonByVideoName(String videoName) {
       return lessonRepository.findLessonByVideo(videoName).orElse(null);
    }
}
