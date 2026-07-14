package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {
    private Integer level;
    private Integer xp;
    private Integer nextLevelXpThreshold; // e.g. level * 100
    private Integer currentStreak;
    private double treesSaved;       // Simulated: xp / 100.0
    private double waterSavedLiters; // Simulated: xp * 2.5
    private double co2ReducedKg;    // Simulated: xp / 50.0
    private long completedCoursesCount;
    private long unlockedBadgesCount;
    private long totalCoursesCount;
    private long totalQuizzesCount;
}
