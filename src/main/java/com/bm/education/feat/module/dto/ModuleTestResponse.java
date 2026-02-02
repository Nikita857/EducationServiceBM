package com.bm.education.feat.module.dto;

import com.bm.education.feat.quiz.dto.QuestionDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ModuleTestResponse {
    private List<QuestionDTO> questions;
}
