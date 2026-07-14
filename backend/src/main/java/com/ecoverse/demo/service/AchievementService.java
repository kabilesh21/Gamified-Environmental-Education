package com.ecoverse.demo.service;

import com.ecoverse.demo.entity.*;
import com.ecoverse.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AchievementService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private BadgeRepository badgeRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private SeasonalEventRepository seasonalEventRepository;

    @Transactional
    public boolean unlockAchievement(User user, String key) {
        // If user already has this achievement, do nothing
        if (userAchievementRepository.existsByUserIdAndAchievementAchievementKey(user.getId(), key)) {
            return false;
        }

        Optional<Achievement> achievementOpt = achievementRepository.findByAchievementKey(key);
        if (achievementOpt.isEmpty()) {
            return false;
        }

        Achievement achievement = achievementOpt.get();
        UserAchievement userAchievement = UserAchievement.builder()
                .user(user)
                .achievement(achievement)
                .unlockedAt(LocalDateTime.now())
                .build();

        userAchievementRepository.save(userAchievement);

        // Award XP and calculate Level
        awardXpAndCheckLevel(user, achievement.getXpReward());
        dashboardService.logActivity(user, "Unlocked achievement: " + achievement.getName(), "+" + achievement.getXpReward() + " XP", "ACHIEVEMENT");
        return true;
    }

    @Transactional
    public boolean unlockBadge(User user, String badgeName) {
        Optional<Badge> badgeOpt = badgeRepository.findByName(badgeName);
        if (badgeOpt.isEmpty()) {
            return false;
        }

        Badge badge = badgeOpt.get();
        if (userBadgeRepository.existsByUserIdAndBadgeId(user.getId(), badge.getId())) {
            return false;
        }

        UserBadge userBadge = UserBadge.builder()
                .user(user)
                .badge(badge)
                .unlockedAt(LocalDateTime.now())
                .build();

        userBadgeRepository.save(userBadge);
        
        // Unlocking a badge also gives 50 XP
        awardXpAndCheckLevel(user, 50);
        dashboardService.logActivity(user, "Earned badge \"" + badge.getName() + "\"", "+50 XP", "BADGE");

        // Check if this badge completes a seasonal event
        Optional<SeasonalEvent> eventOpt = seasonalEventRepository.findByBadgeReward(badge.getName());
        if (eventOpt.isPresent()) {
            SeasonalEvent event = eventOpt.get();
            user.setXp(user.getXp() + event.getRewardXp());
            user.setCoins(user.getCoins() + event.getRewardCoins());
            
            // Simple level calculation: 1 level per 500 XP
            int calculatedLevel = (user.getXp() / 500) + 1;
            if (calculatedLevel > user.getLevel()) {
                user.setLevel(calculatedLevel);
            }
            userRepository.save(user);

            dashboardService.logActivity(user, "Completed Seasonal Event: " + event.getTitle(), "+" + event.getRewardXp() + " XP", "EVENT");
        }
        return true;
    }

    public void awardXpAndCheckLevel(User user, int xpAmount) {
        user.setXp(user.getXp() + xpAmount);
        
        // Simple linear level up: 100 XP per level
        int newLevel = (user.getXp() / 100) + 1;
        if (newLevel > user.getLevel()) {
            user.setLevel(newLevel);
            // Unlock milestone badges based on level
            if (newLevel >= 5) {
                unlockBadge(user, "Green Learner");
            }
            if (newLevel >= 10) {
                unlockBadge(user, "Climate Hero");
            }
        }
        userRepository.save(user);
    }
}
