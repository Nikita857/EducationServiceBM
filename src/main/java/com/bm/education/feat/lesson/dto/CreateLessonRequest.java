package com.bm.education.feat.lesson.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record CreateLessonRequest(
        String title,
        JsonNode content,
        String shortDescription,
        Long moduleId,
        Long contentLength) {
}
