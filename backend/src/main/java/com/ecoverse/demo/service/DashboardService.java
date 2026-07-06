package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.DashboardStatsResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.EnrollmentRepository;
import com.ecoverse.demo.repository.UserBadgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    public DashboardStatsResponse getDashboardStats(User user) {
        long completedCourses = enrollmentRepository.countByUserIdAndCompletedTrue(user.getId());
        long unlockedBadges = userBadgeRepository.findByUserId(user.getId()).size();

        // Level threshold: 100 XP per level. Target for next level is current level * 100 XP
        int nextLevelXpThreshold = user.getLevel() * 100;

        // Eco-stats based on user XP
        double treesSaved = user.getXp() / 100.0;
        double waterSaved = user.getXp() * 2.5;
        double co2Reduced = user.getXp() / 50.0;

        return DashboardStatsResponse.builder()
                .level(user.getLevel())
                .xp(user.getXp())
                .nextLevelXpThreshold(nextLevelXpThreshold)
                .currentStreak(user.getCurrentStreak())
                .treesSaved(treesSaved)
                .waterSavedLiters(waterSaved)
                .co2ReducedKg(co2Reduced)
                .completedCoursesCount(completedCourses)
                .unlockedBadgesCount(unlockedBadges)
                .build();
    }
}
