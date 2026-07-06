package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultResponse {
    private Integer score; // Percentage (e.g. 100)
    private boolean passed;
    private Integer correctCount;
    private Integer totalCount;
    private Integer xpEarned;
    private String unlockedBadge; // Name of the badge unlocked (if any)
    private String certificateId; // UUID of generated certificate (if any)
}
