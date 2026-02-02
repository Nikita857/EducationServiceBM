package com.bm.education.feat.quiz.dto;

import com.bm.education.feat.user.dto.UserAnswer;

import java.util.List;

public record TestSubmissionDTO(List<UserAnswer> answers) {
}
