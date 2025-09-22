package com.bm.education.services;

import com.bm.education.dto.*;
import com.bm.education.repositories.LessonRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
            return allQuestions.subList(0, Math.min(allQuestions.size(), 20));
        }

    }
//fat cock
    @Transactional(readOnly = true)
    public TestResultDTO checkAnswers(Integer moduleId, @NotNull TestSubmissionDTO submission) {
        List<QuestionDTO> allQuestions = getAllQuestionsForModule(moduleId, true);
        int score = 0;

        Map<String, QuestionDTO> questionMap = allQuestions.stream()
                .collect(Collectors.toMap(QuestionDTO::getQuestion, q -> q, (q1, q2) -> q1));

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

        return new TestResultDTO(score, totalQuestionsInTest, percentage);
    }
}
