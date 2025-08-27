package com.bm.education.services;

import com.bm.education.models.Course;
import com.bm.education.models.UserProgress;
import com.bm.education.repositories.LessonRepository;
import com.bm.education.repositories.ModuleRepository;
import com.bm.education.models.Module;
import com.bm.education.repositories.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;
    private final UserProgressRepository userProgressRepository;

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

}
