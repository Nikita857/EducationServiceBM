package com.bm.education.controllers;

import com.bm.education.dto.QuestionDTO;
import com.bm.education.models.Module;
import com.bm.education.models.User;
import com.bm.education.services.ModuleService;
import com.bm.education.services.ModuleTestService;
import com.bm.education.services.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import com.bm.education.dto.TestResultDTO;
import com.bm.education.dto.TestSubmissionDTO;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ModuleTestController {

    private final ModuleTestService moduleTestService;
    private final ModuleService moduleService;
    private final UserService userService;

    @GetMapping("/course/{course}/module/{moduleSlug}/test")
    public String showModuleTestPage(@PathVariable String course, @PathVariable String moduleSlug, Model model, Authentication auth, RedirectAttributes redirectAttributes) {
        Module module = moduleService.getModuleBySlug(moduleSlug);
        User user = userService.getUserByUsername(auth.getName());

        // Backend check to ensure all lessons are completed
        if (!moduleService.isModuleCompleted(module, user.getId())) {
            redirectAttributes.addFlashAttribute("error", "Вы должны пройти все уроки в модуле, прежде чем начинать тест.");
            return "redirect:/course/" + course;
        }

        List<QuestionDTO> questions = moduleTestService.getAllQuestionsForModule(module.getId(), false);

        model.addAttribute("questions", questions);
        model.addAttribute("moduleId", module.getId());
        model.addAttribute("user", user);
        model.addAttribute("moduleName", module.getTitle());
        return "module_test";
    }

    @PostMapping("/api/module/{moduleId}/check-test")
    @ResponseBody
    public TestResultDTO checkTest(@PathVariable Integer moduleId, @RequestBody TestSubmissionDTO submission, Authentication authentication) {
        return moduleTestService.checkAnswers(moduleId, submission, authentication);
    }
}
