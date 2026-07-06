package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private String difficulty;
    private String imageUrl;
    private String badgeReward;
    
    // Progress fields
    private boolean enrolled;
    private boolean completed;
    private double progressPercentage; // e.g. 75.0
    private Integer totalLessons;
    private Integer completedLessons;
    
    private List<LessonResponse> lessons;
    private Long quizId;
}
