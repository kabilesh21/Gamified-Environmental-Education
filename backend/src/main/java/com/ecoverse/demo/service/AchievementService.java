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
