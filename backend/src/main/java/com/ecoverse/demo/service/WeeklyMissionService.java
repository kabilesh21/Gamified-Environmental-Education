package com.ecoverse.demo.service;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.WeeklyMission;
import com.ecoverse.demo.entity.UserMissionProgress;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.repository.WeeklyMissionRepository;
import com.ecoverse.demo.repository.UserMissionProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class WeeklyMissionService {

    @Autowired
    private WeeklyMissionRepository weeklyMissionRepository;

    @Autowired
    private UserMissionProgressRepository userMissionProgressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DashboardService dashboardService;

    @Transactional
    public List<UserMissionProgress> getUserMissions(User user) {
        List<WeeklyMission> missions = weeklyMissionRepository.findAll();
        List<UserMissionProgress> progressList = new ArrayList<>();

        for (WeeklyMission m : missions) {
            Optional<UserMissionProgress> progressOpt = userMissionProgressRepository.findByUserIdAndMissionId(user.getId(), m.getId());
            if (progressOpt.isPresent()) {
                progressList.add(progressOpt.get());
            } else {
                UserMissionProgress newProgress = UserMissionProgress.builder()
                        .userId(user.getId())
                        .missionId(m.getId())
                        .progress(0)
                        .completed(false)
                        .build();
                progressList.add(userMissionProgressRepository.save(newProgress));
            }
        }
        return progressList;
    }

    @Transactional
    public void incrementProgress(User user, String missionType, int amount) {
        List<WeeklyMission> missions = weeklyMissionRepository.findAll();
        for (WeeklyMission m : missions) {
            if (m.getType().equalsIgnoreCase(missionType)) {
                UserMissionProgress progress = userMissionProgressRepository.findByUserIdAndMissionId(user.getId(), m.getId())
                        .orElseGet(() -> UserMissionProgress.builder()
                                .userId(user.getId())
                                .missionId(m.getId())
                                .progress(0)
                                .completed(false)
                                .build());

                if (progress.isCompleted()) {
                    continue;
                }

                int newProgressVal = progress.getProgress() + amount;
                progress.setProgress(Math.min(newProgressVal, m.getTarget()));

                if (progress.getProgress() >= m.getTarget()) {
                    progress.setCompleted(true);
                    
                    // Reward user
                    user.setXp(user.getXp() + m.getRewardXp());
                    user.setCoins(user.getCoins() + m.getRewardCoins());
                    
                    // Simple level calculation: 1 level per 500 XP
                    int calculatedLevel = (user.getXp() / 500) + 1;
                    if (calculatedLevel > user.getLevel()) {
                        user.setLevel(calculatedLevel);
                    }
                    
                    userRepository.save(user);

                    // Log activity
                    dashboardService.logActivity(user, "Completed Weekly Mission: " + m.getTitle(), "+" + m.getRewardXp() + " XP", "MISSION");
                }
                userMissionProgressRepository.save(progress);
            }
        }
    }
}
