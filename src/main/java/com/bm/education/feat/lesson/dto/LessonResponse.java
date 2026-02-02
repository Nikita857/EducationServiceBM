package com.bm.education.feat.lesson.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record LessonResponse(
        Long id,
        String moduleName,
        String title,
        String shortDescription,
        JsonNode content,
        Integer lessonOrder,
        Long contentLength) {
}
