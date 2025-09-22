package com.bm.education.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
public class QuestionDTO {
    private String question;
    private List<AnswerDTO> answers;
}
