package com.bm.education.services;

import com.bm.education.dto.*;
import com.bm.education.models.*;
import com.bm.education.models.Module;
import com.bm.education.repositories.LessonRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.bm.education.repositories.ModuleTestResultRepository;
import com.bm.education.repositories.UserModuleCompletionRepository;
import com.bm.education.repositories.UserCourseCompletionRepository;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@Slf4j
public class ModuleTestService {


    private final LessonRepository lessonRepository;
    private final ModuleTestResultRepository moduleTestResultRepository;
    private final UserModuleCompletionRepository userModuleCompletionRepository;
    private final UserCourseCompletionRepository userCourseCompletionRepository;
    private final UserService userService;
    private final ModuleService moduleService;

    @Value("${module.test.answers.correct}")
    private static int MINIMAL_PERCENTAGE_OF_CORRECT_ANSWERS;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public List<QuestionDTO> getAllQuestionsForModule(Integer moduleId, boolean isForCheckAnswers) {
        List<String> testCodes = lessonRepository.findTestCodesByModuleId(moduleId);

        List<QuestionDTO> allQuestions = testCodes.stream()
                .filter(testCode -> testCode != null && !testCode.trim().isEmpty())
                .flatMap(testCode -> {
                    try {
                        String jsonContent = testCode;
                        int startIndex = testCode.indexOf('[');
                        int endIndex = testCode.lastIndexOf(']');
                        if (startIndex != -1 && endIndex != -1 && startIndex < endIndex) {
                            jsonContent = testCode.substring(startIndex, endIndex + 1);
                        }

                        ObjectMapper localMapper = new ObjectMapper();
                        localMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);
                        localMapper.configure(com.fasterxml.jackson.core.JsonParser.Feature.ALLOW_TRAILING_COMMA, true);

                        List<QuestionDTO> questions = localMapper.readValue(jsonContent, new TypeReference<List<QuestionDTO>>() {});
                        return questions != null ? questions.stream() : Stream.empty();
                    } catch (JsonProcessingException e) {
                        log.error("Failed to parse testCode JSON for moduleID {}: {}. Content: {}", moduleId, e.getMessage(), testCode);
                        return Stream.empty();
                    }
                })
                .collect(Collectors.toList());

        if(isForCheckAnswers) {
            return allQuestions;
        }else{
           Collections.shuffle(allQuestions);
            return allQuestions.subList(0, (int) Math.round(allQuestions.size() * 0.4));
        }

    }

    @Transactional
    public TestResultDTO checkAnswers(Integer moduleId, @NotNull @org.jetbrains.annotations.NotNull TestSubmissionDTO submission, Authentication authentication) {
        List<QuestionDTO> allQuestions = getAllQuestionsForModule(moduleId, true);
        int score = 0;

        Map<String, QuestionDTO> questionMap = allQuestions.stream()
                .collect(Collectors.toMap(
                        QuestionDTO::getQuestion, q -> q, (q1, q2) -> q1));

        for (UserAnswerDTO userAnswer : submission.getAnswers()) {
            QuestionDTO question = questionMap.get(userAnswer.getQuestion());
            if (question != null) {
                for (AnswerDTO answer : question.getAnswers()) {
                    if (answer.getCorrect() && answer.getText().equals(userAnswer.getAnswer())) {
                        score++;
                        break;
                    }
                }
            }
        }

        int totalQuestionsInTest = submission.getAnswers().size();
        double percentage = totalQuestionsInTest > 0 ? ((double) score / totalQuestionsInTest) * 100 : 0;

        User user = userService.getUserByUsername(authentication.getName());
        Module module = moduleService.getModuleById(moduleId);

        ModuleTestResult testResult = new ModuleTestResult();
        testResult.setUser(user);
        testResult.setModule(module);
        testResult.setScore(score);
        testResult.setTotalQuestions(totalQuestionsInTest);
        testResult.setCompletionDate(LocalDateTime.now());
        moduleTestResultRepository.save(testResult);

        // If the user passed, mark the module as completed
        if (percentage >= MINIMAL_PERCENTAGE_OF_CORRECT_ANSWERS) {
            boolean alreadyCompleted = userModuleCompletionRepository.existsByUser_IdAndModule_Id(user.getId(), module.getId());
            if (!alreadyCompleted) {
                UserModuleCompletion completion = new UserModuleCompletion(user, module, percentage);
                userModuleCompletionRepository.save(completion);

                notificationService.createNotification(
                        user,
                        String.format("Поздарвляем вы прошли модуль: %s", module.getTitle()),
                        "");

                // Check if the whole course is now completed
                Course course = module.getCourse();
                Integer totalModulesInCourse = moduleService.getModulesByCourseId(course.getId()).size();
                Integer completedModulesInCourse = userModuleCompletionRepository.countByUser_IdAndModule_Course_Id(user.getId(), course.getId());

                if (totalModulesInCourse.equals(completedModulesInCourse)) {
                    boolean courseAlreadyMarked = userCourseCompletionRepository.existsByUser_IdAndCourse_Id(user.getId(), course.getId());
                    if (!courseAlreadyMarked) {
                        UserCourseCompletion courseCompletion = new UserCourseCompletion(user, course);
                        userCourseCompletionRepository.save(courseCompletion);
                        notificationService.createNotification(
                                userService.getUserByUsername(authentication.getName()),
                                "Поздравляем! Вы прошли курс Инженер технолог БриНТ",
                                ""
                        );
                    }
                }
            }
        }

        return new TestResultDTO(score, totalQuestionsInTest, percentage);
    }

    public Integer getNumberOfCompletedModules(Integer userId) {
        return moduleTestResultRepository.countByUserId(userId);
    }
}
