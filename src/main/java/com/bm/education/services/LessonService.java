package com.bm.education.services;

import com.bm.education.dto.CourseResponseDTO;
import com.bm.education.dto.LessonRequestDTO;
import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.models.Course;
import com.bm.education.models.Lesson;
import com.bm.education.repositories.LessonRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class LessonService {
    private final LessonRepository lessonRepository;

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
    public List<Lesson> findAllCourseLessons(Integer courseId) {
        return lessonRepository.findAllCourseLessons(courseId);
    }

    public List<Lesson> findAllCompletedLessonsOfCourseWithUser(Integer courseId, Integer userId) {
        return lessonRepository.findCompletedLessonsByCourseAndUser(courseId, userId);
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

    public Page<LessonResponseDTO> putLessonsInDTO(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Lesson> lessons = lessonRepository.findAll(pageable);
        return lessons.map(this::convertToLessonResponseDTO);
    }
}
