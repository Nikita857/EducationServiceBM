package com.bm.education.feat.module.controller;

import com.bm.education.feat.quiz.dto.QuestionDTO;
import com.bm.education.feat.quiz.dto.TestResultDTO;
import com.bm.education.feat.quiz.dto.TestSubmissionDTO;
import com.bm.education.feat.module.model.Module;
import com.bm.education.feat.module.service.ModuleService;
import com.bm.education.feat.module.service.ModuleTestService;
import com.bm.education.feat.user.model.User;
import com.bm.education.feat.user.service.UserService;
import com.bm.education.shared.common.ApiResponse;
import com.bm.education.shared.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API controller for module tests.
 */
@RestController
@RequestMapping("/api/v1/modules")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Module Tests", description = "Module test management")
public class ModuleTestController {

    private final ModuleTestService moduleTestService;
    private final ModuleService moduleService;
    private final UserService userService;

    /**
     * Get questions for a module test.
     */
    @GetMapping("/{moduleSlug}/test/questions")
    @Operation(summary = "Get test questions", description = "Returns all questions for module test")
    public ApiResponse<List<QuestionDTO>> getTestQuestions(
            @PathVariable String moduleSlug,
            Authentication auth) {

        Module module = moduleService.getModuleBySlug(moduleSlug);
        if (module == null) {
            throw new ApiException("Модуль не найден", HttpStatus.NOT_FOUND);
        }

        User user = userService.getUserByUsername(auth.getName());

        // Check if all lessons are completed
        if (!moduleService.isModuleCompleted(module, user.getId())) {
            throw new ApiException("Вы должны пройти все уроки в модуле, прежде чем начинать тест.",
                    HttpStatus.FORBIDDEN);
        }

        List<QuestionDTO> questions = moduleTestService.getAllQuestionsForModule(module.getId(), false);
        return ApiResponse.success(questions);
    }

    /**
     * Submit test answers and get results.
     */
    @PostMapping("/{moduleId}/test/submit")
    @Operation(summary = "Submit test", description = "Submits test answers and returns results")
    public ApiResponse<TestResultDTO> submitTest(
            @PathVariable Long moduleId,
            @RequestBody TestSubmissionDTO submission,
            Authentication authentication) {

        TestResultDTO result = moduleTestService.checkAnswers(moduleId, submission, authentication);
        return ApiResponse.success(result);
    }
}
