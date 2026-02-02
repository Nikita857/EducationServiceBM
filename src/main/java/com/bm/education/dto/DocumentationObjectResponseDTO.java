package com.bm.education.dto;

public record DocumentationObjectResponseDTO(
        Long id,
        String name,
        String file,
        Long categoryId) {
}
