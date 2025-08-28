package com.bm.education.services;

import com.bm.education.dto.ModuleCreateRequest;
import com.bm.education.models.Course;
import com.bm.education.models.Lesson;
import com.bm.education.models.ModuleStatus;
import com.bm.education.repositories.CoursesRepository;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.repositories.ModuleRepository;
import com.bm.education.models.Module;
import com.bm.education.repositories.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;


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
        return moduleRepository.getModuleBySlug(moduleSlug).orElse(null);
    }

    public int totalLessons(Integer courseId) {
        return lessonRepository.countLessonsByCourseId(courseId);
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
}
