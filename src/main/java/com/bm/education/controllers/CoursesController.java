package com.bm.education.controllers;

import com.bm.education.models.Course;
import com.bm.education.models.Offer;
import com.bm.education.models.OfferStatus;
import com.bm.education.models.User;
import com.bm.education.services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for handling course-related requests.
 */
@Controller
@RequiredArgsConstructor
public class CoursesController {

    private final CoursesService coursesService;
    private final OfferService offerService;
    private final ModuleService moduleService;
    private final LessonService lessonService;
    private final UserService userService;
    private final UserProgressService userProgressService;

    /**
     * Displays the index page with a list of courses for the authenticated user.
     *
     * @param model The model to add attributes to.
     * @param auth The authentication object for the current user.
     * @return The name of the index view.
     */
    @GetMapping("/")
    public String index(Model model, Authentication auth) {
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("courses", coursesService.getCoursesWithProgress(
                userService.getUserByUsername(
                        auth.getName()).getId()
        ));
        return "index";
    }

    /**
     * Displays the selected course page.
     *
     * @param name The slug of the course to display.
     * @param model The model to add attributes to.
     * @param auth The authentication object for the current user.
     * @return The name of the selected course view, or "404" if the course is not found.
     */
    @GetMapping("/course/{name}")
    public String getSelectedCourse(@PathVariable String name, Model model, Authentication auth) {
        if(coursesService.getSelectedCourseBySlug(name) != null) {
            User user = userService.getUserByUsername(auth.getName());
            Course course = coursesService.getSelectedCourseBySlug(name);
            model.addAttribute("user", user);
            model.addAttribute("selectedCourseData", course);
            model.addAttribute("modules", coursesService.getModulesOfCourseWithProgress(course.getId(), user.getId()));
            model.addAttribute("totalLessons", moduleService.totalLessons(course.getId()));
            model.addAttribute("completedLessons", moduleService.completedLessons(
                    course.getId(),
                    user.getId()
                    )
            );
            Integer totalLessons = moduleService.totalLessons(coursesService.getSelectedCourseBySlug(name).getId());
            Integer completedLessons = moduleService.completedLessons(coursesService.getSelectedCourseBySlug(name).getId(),
                    userService.getUserByUsername(auth.getName()).getId());
            model.addAttribute("percentageOfLearning", moduleService.countPercentOfLearning(completedLessons, totalLessons));
            model.addAttribute("progressMap", userProgressService.getCourseProgress(user.getId(), course.getId()));
            return "selectedCourse";
        }else{
            return "404";
        }
    }

    /**
     * Displays the selected module page.
     *
     * @param name The slug of the course.
     * @param moduleSlug The slug of the module.
     * @param model The model to add attributes to.
     * @param auth The authentication object for the current user.
     * @return The name of the tasklist view, or "404" if the course or module is not found.
     */
    @GetMapping("course/{name}/module/{moduleSlug}")
    public String getSelectedModule(@PathVariable String name, @PathVariable String moduleSlug, Model model, Authentication auth) {
        if(coursesService.getSelectedCourseBySlug(name) == null || moduleService.getModuleBySlug(moduleSlug) == null) {
            return "404";
        }
        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("selectedCourseData", coursesService.getSelectedCourseBySlug(name));
        model.addAttribute("selectedModuleData", moduleService.getModuleBySlug(moduleSlug));
        model.addAttribute("moduleLessons", lessonService.getLessonsWithProgress(auth.getName(), moduleSlug));
        return "tasklist";
    }

    /**
     * Displays the selected lesson page.
     *
     * @param name The slug of the course.
     * @param moduleSlug The slug of the module.
     * @param lessonId The ID of the lesson.
     * @param model The model to add attributes to.
     * @param auth The authentication object for the current user.
     * @return The name of the lesson view, or "error/404" if the course, module, or lesson is not found.
     */
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

    /**
     * Displays the user's cabinet page.
     *
     * @param model The model to add attributes to.
     * @param auth The authentication object for the current user.
     * @return The name of the cabinet view.
     */
    @GetMapping("cabinet/")
    public String getUserCabinet(Model model, Authentication auth) {
        Integer userId = userService.getUserByUsername(auth.getName()).getId();

        model.addAttribute("user", userService.getUserByUsername(auth.getName()));
        model.addAttribute("userOffers", offerService.getUserOffers(userId));
        model.addAttribute("availableCourses", coursesService.getCoursesWithProgress(userId));
        model.addAttribute("offerStatus", OfferStatus.values());
        return "cabinet";
    }

    /**
     * Saves a new offer.
     *
     * @param offer The offer to save.
     * @param bindingResult The result of the validation.
     * @param model The model to add attributes to.
     * @return The name of the selected course view.
     */
    @PostMapping("/course/offer/")
    public String saveOffer(@Valid Offer offer, BindingResult bindingResult, Model model) {
        if(bindingResult.hasErrors()) {
            List<String> errorMessages = bindingResult.getAllErrors().stream()
                    .map(DefaultMessageSourceResolvable::getDefaultMessage)
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