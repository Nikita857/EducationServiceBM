package com.bm.education.feat.lesson.dto;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.Builder;

@Builder
public record LessonShortResponse(
                String title,
                JsonNode content) {
}