package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizSubmissionRequest {

    private Long quizId;
    private List<Answer> answers;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Answer {
        private Long questionId;
        private Long optionId;
    }
}
