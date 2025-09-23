package com.bm.education.services;

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

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service for managing modules.
 */
@Service

@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository userProgressRepository;
    private final CoursesRepository coursesRepository;

    /**
     * Gets all modules for a course.
     *
     * @param courseId The ID of the course.
     * @return A list of modules for the course.
     */
    @Transactional(readOnly = true)
    public List<Module> getModulesByCourseId(Integer courseId) {
        return moduleRepository.getModulesByCourseId(courseId);
    }

    /**
     * Gets a module by its slug.
     *
     * @param moduleSlug The slug of the module.
     * @return The module with the specified slug, or null if not found.
     */
    @Transactional(readOnly = true)
    public Module getModuleBySlug(String moduleSlug) {
        return moduleRepository.getModuleBySlugAndStatus(moduleSlug, ModuleStatus.ACTIVE).orElse(null);
    }

    /**
     * Gets the total number of lessons in a course.
     *
     * @param courseId The ID of the course.
     * @return The total number of lessons in the course.
     */
    @Transactional(readOnly = true)
    public int totalLessons(Integer courseId) {
        return lessonRepository.countByModuleCourseId(courseId);
    }

    /**
     * Gets the number of completed lessons in a course for a user.
     *
     * @param courseId The ID of the course.
     * @param userId   The ID of the user.
     * @return The number of completed lessons in the course for the user.
     */
    @Transactional(readOnly = true)
    public int completedLessons(Integer courseId, Integer userId) {
        return userProgressRepository.totalCompletedLessonByUserId(userId, courseId);
    }

    /**
     * Calculates the percentage of completed lessons.
     *
     * @param completedLessons The number of completed lessons.
     * @param totalLessons     The total number of lessons.
     * @return The percentage of completed lessons.
     */
    public int countPercentOfLearning(Integer completedLessons, Integer totalLessons) {
        if (totalLessons == 0) return 0;
        return (completedLessons * 100) / totalLessons;
    }

    /**
     * Gets the total number of modules.
     *
     * @return The total number of modules.
     */
    @Transactional(readOnly = true)
    public long getModulesCount() {
        return moduleRepository.count();
    }

    /**
     * Deletes a module by its ID.
     *
     * @param moduleId The ID of the module to delete.
     */
    @Transactional
    public void deleteModule(Integer moduleId) {
        if (moduleRepository.findById(moduleId).isPresent()) {
            moduleRepository.deleteById(moduleId);
        }
    }

    /**
     * Updates the status of a module.
     *
     * @param moduleId     The ID of the module to update.
     * @param moduleStatus The new status of the module.
     * @return true if the module status was updated successfully, false otherwise.
     */
    @Transactional
    public boolean updateModuleStatus(Integer moduleId, ModuleStatus moduleStatus) {
        if (moduleRepository.findById(moduleId).isEmpty()) {
            return false;
        }
        moduleRepository.updateStatusById(moduleId, moduleStatus.toString());
        return true;
    }

    /**
     * Creates a new module.
     *
     * @param moduleCreateRequest The request object containing the module details.
     * @return The created module as a DTO.
     * @throws IllegalStateException                       if the module with the same slug already exists.
     * @throws jakarta.persistence.EntityNotFoundException if the course is not found.
     */
    @Transactional
    public ModuleResponseDTO createModule(ModuleCreateRequest moduleCreateRequest) {
        // 1. Check for slug uniqueness
        if (moduleRepository.findBySlug(moduleCreateRequest.getSlug()).isPresent()) {
            throw new IllegalStateException("Модуль с таким URI (slug) уже существует: " + moduleCreateRequest.getSlug());
        }

        // 2. Find the associated course
        Course course = coursesRepository.findById(moduleCreateRequest.getCourseId())
                .orElseThrow(() -> new jakarta.persistence.EntityNotFoundException("Курс с ID " + moduleCreateRequest.getCourseId() + " не найден"));

        // 3. Create and map the entity
        Module module = new Module();
        module.setTitle(moduleCreateRequest.getTitle());
        module.setSlug(moduleCreateRequest.getSlug());
        module.setCourse(course);

        // 4. Save and return DTO
        Module savedModule = moduleRepository.save(module);
        return convertToModuleResponseDTO(savedModule);
    }

    /**
     * Converts a module to a ModuleResponseDTO.
     *
     * @param module The module to convert.
     * @return The converted ModuleResponseDTO.
     */
    private ModuleResponseDTO convertToModuleResponseDTO(Module module) {
        return new ModuleResponseDTO(
                module.getId(),
                module.getCourse().getTitle(),
                module.getTitle(),
                module.getSlug(),
                module.getStatus().toString(),
                false
        );
    }

    /**
     * Gets all modules as a list of DTOs.
     *
     * @return A list of all modules as DTOs.
     */
    public List<ModuleResponseDTO> getAllModulesByDTO() {
        List<Module> modules = moduleRepository.findAllWithCourse();
        return modules.stream()
                .map(this::convertToModuleResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Gets a paginated list of modules as DTOs.
     *
     * @param page     The page number.
     * @param size     The page size.
     * @param courseId The ID of the course to filter by, or null to retrieve all modules.
     * @return A paginated list of modules as DTOs.
     */
    @Transactional
    public Page<ModuleResponseDTO> putModulesInDTO(Integer page, Integer size, Integer courseId) {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("id").descending());
        Page<Module> modules;

        if (courseId != null && courseId > 0) {
            modules = moduleRepository.findAllByCourse_Id(courseId, pageable);
        } else {
            modules = moduleRepository.findAll(pageable);
        }

        return modules.map(this::convertToModuleResponseDTO);
    }

    /**
     * Finds a module by its ID.
     *
     * @param id The ID of the module.
     * @return The module with the specified ID as a DTO, or null if not found.
     */
    @Transactional(readOnly = true)
    public ModuleResponseDTO findModuleById(Integer id) {
        Module module = moduleRepository.findById(id).orElse(null);
        return module != null ? convertToModuleResponseDTO(module) : null;
    }

    /**
     * Updates a module.
     *
     * @param request The request object containing the updated module details.
     * @return true if the module was updated successfully, false otherwise.
     */
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

            return false;
        }
    }

    @Transactional(readOnly = true)
    public Module getModuleById(Integer id) {
        return moduleRepository.findById(id).orElse(null);
    }

    @Transactional(readOnly = true)
    public boolean isModuleCompleted(Module module, Integer userId) {
        if (module == null || userId == null) {
            return false;
        }
        Integer totalLessons = lessonRepository.findLessonsByModuleId(module.getId()).size();
        if (totalLessons == 0) {
            return true; // An empty module is considered complete.
        }
        Integer completedLessons = userProgressRepository.countByModuleIdAndUserId(userId, module.getId());
        return totalLessons.equals(completedLessons);
    }

}