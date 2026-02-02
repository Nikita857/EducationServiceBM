package com.bm.education.dto;

import com.bm.education.models.quiz.Question;

public record LessonResponseDTO(
        Long id,
        String moduleName,
        String title,
        String video,
        String description,
        String shortDescription,

        java.util.List<Question> questions) {
}