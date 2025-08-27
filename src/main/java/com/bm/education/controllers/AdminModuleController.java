package com.bm.education.controllers;

import com.bm.education.services.CoursesService;
import com.bm.education.services.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
public class AdminModuleController {

    private final ModuleService moduleService;
    private final CoursesService coursesService;

    @GetMapping("/admin/modules")
    public String addModule(Model model) {
        model.addAttribute("modules", moduleService.getAllModules());
        model.addAttribute("courses", coursesService.getAllCourses());
        return "adminModule";
    }
    @GetMapping("/admin/module/sort/course/{id}")
    public String findModulesOfCourse(Model model, @PathVariable("id") Integer id) {
        model.addAttribute("modules", moduleService.getModulesByCourseId(id));
        return "adminModule";
    }

    @PostMapping("/admin/module/add")
    public void addModule(@RequestParam Object object, Model model) {
//        Код для добавления новго модуля
    }

}
