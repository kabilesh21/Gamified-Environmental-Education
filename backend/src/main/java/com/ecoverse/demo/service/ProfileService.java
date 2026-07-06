package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.UserProfileResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfileService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserBadgeRepository userBadgeRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private UserGardenItemRepository userGardenItemRepository;

    @Autowired
    private UserLessonProgressRepository userLessonProgressRepository;

    @Autowired
    private UserMissionProgressRepository userMissionProgressRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private CertificateRepository certificateRepository;

    public UserProfileResponse getUserProfile(User user) {
        List<UserProfileResponse.BadgeDto> badges = userBadgeRepository.findByUserId(user.getId()).stream()
                .map(ub -> UserProfileResponse.BadgeDto.builder()
                        .id(ub.getBadge().getId())
                        .name(ub.getBadge().getName())
                        .description(ub.getBadge().getDescription())
                        .iconName(ub.getBadge().getIconName())
                        .type(ub.getBadge().getType())
                        .build())
                .collect(Collectors.toList());

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        List<UserProfileResponse.AchievementDto> achievements = userAchievementRepository.findByUserId(user.getId()).stream()
                .map(ua -> UserProfileResponse.AchievementDto.builder()
                        .id(ua.getAchievement().getId())
                        .name(ua.getAchievement().getName())
                        .description(ua.getAchievement().getDescription())
                        .xpReward(ua.getAchievement().getXpReward())
                        .unlockedAt(ua.getUnlockedAt().format(formatter))
                        .build())
                .collect(Collectors.toList());

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .institutionName(user.getInstitutionName())
                .grade(user.getGrade())
                .department(user.getDepartment())
                .profilePicture(user.getProfilePicture())
                .xp(user.getXp())
                .level(user.getLevel())
                .currentStreak(user.getCurrentStreak())
                .coins(user.getCoins())
                .treeXp(user.getTreeXp())
                .treeLevel(user.getTreeLevel())
                .unlockedBadges(badges)
                .unlockedAchievements(achievements)
                .build();
    }

    @Transactional
    public User updateUserProfile(User user, String fullName, String institutionName, Integer grade, String department, String profilePicture) {
        if (fullName != null && !fullName.trim().isEmpty()) {
            user.setFullName(fullName);
        }
        if (institutionName != null && !institutionName.trim().isEmpty()) {
            user.setInstitutionName(institutionName);
        }
        if (grade != null) {
            user.setGrade(grade);
        }
        if (department != null) {
            user.setDepartment(department);
        }
        if (profilePicture != null && !profilePicture.trim().isEmpty()) {
            user.setProfilePicture(profilePicture);
        }
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUserAccount(User user) {
        Long userId = user.getId();
        
        // Delete badges
        List<com.ecoverse.demo.entity.UserBadge> badges = userBadgeRepository.findByUserId(userId);
        userBadgeRepository.deleteAll(badges);

        // Delete achievements
        List<com.ecoverse.demo.entity.UserAchievement> achievements = userAchievementRepository.findByUserId(userId);
        userAchievementRepository.deleteAll(achievements);

        // Delete garden items
        List<com.ecoverse.demo.entity.UserGardenItem> gardenItems = userGardenItemRepository.findByUserId(userId);
        userGardenItemRepository.deleteAll(gardenItems);

        // Delete lesson progress
        List<com.ecoverse.demo.entity.UserLessonProgress> lessonProgress = userLessonProgressRepository.findByUserId(userId);
        userLessonProgressRepository.deleteAll(lessonProgress);

        // Delete mission progress
        List<com.ecoverse.demo.entity.UserMissionProgress> missionProgress = userMissionProgressRepository.findByUserId(userId);
        userMissionProgressRepository.deleteAll(missionProgress);

        // Delete enrollments
        List<com.ecoverse.demo.entity.Enrollment> enrollments = enrollmentRepository.findByUserId(userId);
        enrollmentRepository.deleteAll(enrollments);

        // Delete certificates
        List<com.ecoverse.demo.entity.Certificate> certificates = certificateRepository.findByUserId(userId);
        certificateRepository.deleteAll(certificates);

        // Delete user
        userRepository.delete(user);
    }
}
