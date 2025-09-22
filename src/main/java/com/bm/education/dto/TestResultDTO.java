package com.bm.education.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResultDTO {
    private int score;
    private int totalQuestions;
    private double percentage;
}
