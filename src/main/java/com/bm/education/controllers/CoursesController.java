package com.bm.education.controllers;

import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
public class CoursesController {

    private final CoursesService coursesService;
    private final OfferService offerService;
    private final ModuleService moduleService;
    private final TaskService taskService;
    private final LessonService lessonService;
    private final UserService userService;

    @GetMapping("/")
    public String index(Model model, Authentication auth) {
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("courses", coursesService.getUserCourses(userService.getUserByUsername(auth.getName()).getId()));
        return "index";
    }

    @GetMapping("/course/{name}")
    public String getSelectedCourse(@PathVariable String name, Model model, Authentication auth) {
        if(coursesService.getSelectedCourseBySlug(name) != null) {
            model.addAttribute("user", userService.getUserByUsername(auth.getName()));
            model.addAttribute("selectedCourseData", coursesService.getSelectedCourseBySlug(name));
            model.addAttribute("modules", moduleService.getModulesByCourseId(coursesService.getSelectedCourseBySlug(name).getId()));
            model.addAttribute("totalLessons", moduleService.totalLessons(coursesService.getSelectedCourseBySlug(name).getId()));
            model.addAttribute("completedLessons", moduleService.completedLessons(
                    coursesService.getSelectedCourseBySlug(name).getId(),
                    userService.getUserByUsername(auth.getName()).getId()
            ));
            Integer totalLessons = moduleService.totalLessons(coursesService.getSelectedCourseBySlug(name).getId());
            Integer completedLessons = moduleService.completedLessons(coursesService.getSelectedCourseBySlug(name).getId(),
                    userService.getUserByUsername(auth.getName()).getId());
            model.addAttribute("percentageOfLearning", moduleService.countPercentOfLearning(completedLessons, totalLessons));
            return "selectedCourse";
        }else{
            return "404";
        }
    }

    @GetMapping("course/{name}/module/{moduleSlug}")
    public String getSelectedModule(@PathVariable String name, @PathVariable String moduleSlug, Model model, Authentication auth) {
        if(coursesService.getSelectedCourseBySlug(name) == null || moduleService.getModuleBySlug(moduleSlug) == null) {
            return "404";
        }
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("selectedCourseData", coursesService.getSelectedCourseBySlug(name));
        model.addAttribute("selectedModuleData", moduleService.getModuleBySlug(moduleSlug));
        model.addAttribute("moduleLessons", taskService.getTasksWithProgress(
                moduleService.getModuleBySlug(moduleSlug).getId(),
                userService.getUserByUsername(auth.getName()).getId()
        ));
        return "tasklist";
    }

    @GetMapping("course/{name}/module/{moduleSlug}/lesson/{lessonId}")
    public String getSelectedLesson(@PathVariable String name, @PathVariable String moduleSlug,
                                    @PathVariable Integer lessonId, Model model, Authentication auth
    ) {
        if(coursesService.getSelectedCourseBySlug(name) == null
                || moduleService.getModuleBySlug(moduleSlug) == null
                || lessonService.getLesson(lessonId, moduleService.getModuleBySlug(moduleSlug).getId()) == null) {
            return "error/404";
        }
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("selectedCourseSlug", coursesService.getSelectedCourseBySlug(name));
        model.addAttribute("moduleData", moduleService.getModuleBySlug(moduleSlug));
        model.addAttribute("lessonData", lessonService.getLesson(lessonId, moduleService.getModuleBySlug(moduleSlug).getId()));
        model.addAttribute("lessonIds", lessonService.getLessonIds(moduleService.getModuleBySlug(moduleSlug).getId()));
        model.addAttribute("courseData", coursesService.getSelectedCourseBySlug(name));

        return "lesson";
    }

    @GetMapping("cabinet/")
    public String getUserCabinet(Model model, Authentication auth) {
        Integer userId = userService.getUserByUsername(auth.getName()).getId();

        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("userOffers", offerService.getUserOffers(userId));
        model.addAttribute("availableCourses", coursesService.getCoursesWithProgress(userId));
        model.addAttribute("offerStatus", OfferStatus.values());
        return "cabinet";
    }


    @PostMapping("/course/offer/")
    public String saveOffer(@Valid Offer offer, BindingResult bindingResult, Model model) {
        if(bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getAllErrors().stream()
                    .map(error -> error.getDefaultMessage())
                    .collect(Collectors.toList());
            model.addAttribute("errors", errorMessages);
            model.addAttribute("showModal", true);
            return "selectedCourse";
        }else{
            offerService.saveOffer(offer);
            return "selectedCourse";
        }
    }
}
