package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String institutionName;
    private Integer grade;
    private String department;
    private String profilePicture;
    private Integer xp;
    private Integer level;
    private Integer currentStreak;
    private Integer coins;
    private Integer treeXp;
    private Integer treeLevel;
    private List<BadgeDto> unlockedBadges;
    private List<AchievementDto> unlockedAchievements;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class BadgeDto {
        private Long id;
        private String name;
        private String description;
        private String iconName;
        private String type;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AchievementDto {
        private Long id;
        private String name;
        private String description;
        private Integer xpReward;
        private String unlockedAt;
    }
}
