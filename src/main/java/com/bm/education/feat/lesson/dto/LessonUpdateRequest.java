package com.bm.education.feat.lesson.dto;

import com.fasterxml.jackson.databind.JsonNode;

public record LessonUpdateRequest(
        String title,
        JsonNode content,
        String shortDescription,
        String videoUrl) { // Keeping videoUrl optionally if user wants to keep it in a separate field
                           // implicitly or removed?
    // User said "legacy fields (video...)" removed.
    // But in LessonShortResponse user kept videoUrl (then removed it).
    // Let's stick to content and shortDescription.
}
