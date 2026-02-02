package com.bm.education.feat.quiz.dto;

import com.bm.education.feat.user.dto.UserAnswerDTO;

import java.util.List;

public record TestSubmissionDTO(List<UserAnswerDTO> answers) {
}
