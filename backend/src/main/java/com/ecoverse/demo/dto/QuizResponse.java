package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponse {
    private Long id;
    private Long courseId;
    private String courseTitle;
    private Integer xpReward;
    private List<QuestionDto> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionDto {
        private Long id;
        private String questionText;
        private List<OptionDto> options;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionDto {
        private Long id;
        private String optionText;
    }
}
