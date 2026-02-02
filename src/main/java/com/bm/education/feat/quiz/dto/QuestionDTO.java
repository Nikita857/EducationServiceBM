package com.bm.education.feat.quiz.dto;

import java.util.List;

public record QuestionDTO(String question, List<AnswerDTO> answers) {
}
