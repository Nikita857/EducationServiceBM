package com.bm.education.dto;

import lombok.Data;
import java.util.List;

@Data
public class TestSubmissionDTO {
    private List<UserAnswerDTO> answers;
}
