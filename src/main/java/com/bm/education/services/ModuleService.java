package com.bm.education.services;

import com.bm.education.dto.LessonResponseDTO;
import com.bm.education.dto.ModuleCreateRequest;
import com.bm.education.dto.ModuleResponseDTO;
import com.bm.education.models.Course;
import com.bm.education.models.Lesson;
import com.bm.education.models.Module;
import com.bm.education.models.ModuleStatus;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.repositories.ModuleRepository;
import com.bm.education.repositories.UserProgressRepository;
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
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository userProgressRepository;
    private final CoursesRepository coursesRepository;

    public List<Module> getModulesByCourseId(Integer courseId) {
        return moduleRepository.getModulesByCourseId(courseId);
    }

    public Module getModuleBySlug(String moduleSlug) {
        return moduleRepository.getModuleBySlugAndStatus(moduleSlug, ModuleStatus.ACTIVE).orElse(null);
    }

    public int totalLessons(Integer courseId) {
        return lessonRepository.countByModuleCourseId(courseId);
    }

    public int completedLessons(Integer courseId, Integer userId) {
        return userProgressRepository.totalCompletedLessonByUserId(userId, courseId);
    }

    public int countPercentOfLearning(Integer completedLessons, Integer totalLessons) {
        if(totalLessons == 0) return 0;
        return (completedLessons * 100) / totalLessons;
    }

    public List<Module> getAllModules() {return moduleRepository.findAll();}

    public boolean deleteModule(Integer moduleId) {
        if (moduleRepository.findById(moduleId).isPresent()) {
            moduleRepository.deleteById(moduleId);
            return true;
        }else return false;
    }

    public boolean updateModuleStatus(Integer moduleId, ModuleStatus moduleStatus) {
        if(moduleRepository.findById(moduleId).isEmpty()){
            return false;
        }
        moduleRepository.updateStatusById(moduleId, moduleStatus.toString());
        return true;
    }

    public boolean createModule(ModuleCreateRequest moduleCreateRequest, CoursesRepository coursesRepository) {
        try {
            Module module = new Module();
            module.setTitle(moduleCreateRequest.getTitle());
            module.setSlug(moduleCreateRequest.getSlug());

            Course course = coursesRepository.findById(moduleCreateRequest.getCourseId()).orElseThrow(
                    () -> new RuntimeException("Could not find course with id: " + moduleCreateRequest.getCourseId())
            );
            course.setId(moduleCreateRequest.getCourseId());
            module.setCourse(course);

            moduleRepository.save(module);
            return true;
        }catch (Exception e){
            throw new IllegalArgumentException(e);
        }
    }

    private ModuleResponseDTO convertToModuleResponseDTO(Module module) {
        return new ModuleResponseDTO(
                module.getId(),
                module.getCourse().getTitle(),
                module.getTitle(),
                module.getSlug(),
                module.getStatus().toString()
        );
    }

    public List<ModuleResponseDTO> getAllModulesByDTO() {
        List<Module> modules = moduleRepository.findAll();
        return modules.stream()
                .map(this::convertToModuleResponseDTO)
                .collect(Collectors.toList());
    }

    public Page<ModuleResponseDTO> putModulesInDTO(Integer page, Integer size) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Module> modules = moduleRepository.findAll(pageable);
        return modules.map(this::convertToModuleResponseDTO);
    }

    public ModuleResponseDTO findModuleById(Integer id) {
        Module module = moduleRepository.findById(id).orElse(null);
        return module!=null? convertToModuleResponseDTO(module): null;
    }

    public boolean updateModule(com.bm.education.dto.ModuleUpdateRequest request) {
        try {
            Module module = moduleRepository.findById(request.getModuleId()).orElseThrow(
                    () -> new RuntimeException("Could not find module with id: " + request.getModuleId())
            );

            module.setTitle(request.getName());
            module.setSlug(request.getSlug());

            if (request.getCourseId() != null) {
                Course course = coursesRepository.findById(request.getCourseId()).orElseThrow(
                        () -> new RuntimeException("Could not find course with id: " + request.getCourseId())
                );
                module.setCourse(course);
            }

            moduleRepository.save(module);
            return true;
        } catch (Exception e) {
            log.error("Error updating module: {}", e.getMessage(), e);
            return false;
        }
    }
}
