package com.bm.education.feat.lesson.dto;

import com.bm.education.feat.quiz.model.Question;

public record LessonResponseDTO(
        Long id,
        String moduleName,
        String title,
        String video,
        String description,
        String shortDescription,

        java.util.List<Question> questions) {
}