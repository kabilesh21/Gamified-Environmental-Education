package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.DashboardStatsResponse;
import com.ecoverse.demo.dto.UserActivityResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.UserActivity;
import com.ecoverse.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    public DashboardStatsResponse getDashboardStats(User user) {
        long completedCourses = enrollmentRepository.countByUserIdAndCompletedTrue(user.getId());
        long unlockedBadges = userBadgeRepository.findByUserId(user.getId()).size();
        long totalCourses = courseRepository.count();
        long totalQuizzes = quizRepository.count();

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
                .totalCoursesCount(totalCourses)
                .totalQuizzesCount(totalQuizzes)
                .build();
    }

    @Transactional
    public void logActivity(User user, String title, String xpChange, String type) {
        UserActivity activity = UserActivity.builder()
                .user(user)
                .title(title)
                .xpChange(xpChange)
                .type(type)
                .timestamp(LocalDateTime.now())
                .build();
        userActivityRepository.save(activity);
    }

    public List<UserActivityResponse> getRecentActivities(User user) {
        List<UserActivity> activities = userActivityRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return activities.stream()
                .filter(a -> "MISSION".equals(a.getType()) || "EVENT".equals(a.getType()))
                .limit(5)
                .map(a -> UserActivityResponse.builder()
                        .id(a.getId())
                        .title(a.getTitle())
                        .xpChange(a.getXpChange())
                        .type(a.getType())
                        .timestamp(a.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
}
