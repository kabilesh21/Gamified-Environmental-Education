package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseCreateRequest {
    private String title;
    private String description;
    private String difficulty;
    private String imageUrl;
    private String badgeReward;
    private List<LessonCreateDto> lessons;
    private QuizCreateDto quiz;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonCreateDto {
        private String title;
        private String content;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuizCreateDto {
        private Integer xpReward;
        private List<QuestionCreateDto> questions;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionCreateDto {
        private String questionText;
        private List<OptionCreateDto> options;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionCreateDto {
        private String optionText;
        @com.fasterxml.jackson.annotation.JsonProperty("isCorrect")
        private boolean isCorrect;
    }
}
