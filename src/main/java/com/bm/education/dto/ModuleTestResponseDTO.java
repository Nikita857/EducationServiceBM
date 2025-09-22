package com.bm.education.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleTestResponseDTO {
    private List<QuestionDTO> questions;
}