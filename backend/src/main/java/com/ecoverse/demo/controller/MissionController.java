package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.WeeklyMission;
import com.ecoverse.demo.entity.UserMissionProgress;
import com.ecoverse.demo.repository.WeeklyMissionRepository;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.WeeklyMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/missions")
public class MissionController {

    @Autowired
    private WeeklyMissionService weeklyMissionService;

    @Autowired
    private WeeklyMissionRepository weeklyMissionRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getUserMissions(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<UserMissionProgress> progressList = weeklyMissionService.getUserMissions(user);
        List<WeeklyMission> missions = weeklyMissionRepository.findAll();

        List<Map<String, Object>> response = new ArrayList<>();
        for (WeeklyMission m : missions) {
            UserMissionProgress progress = progressList.stream()
                    .filter(p -> p.getMissionId().equals(m.getId()))
                    .findFirst()
                    .orElseGet(() -> UserMissionProgress.builder()
                            .userId(user.getId())
                            .missionId(m.getId())
                            .progress(0)
                            .completed(false)
                            .build());

            Map<String, Object> item = new HashMap<>();
            item.put("id", m.getId());
            item.put("title", m.getTitle());
            item.put("type", m.getType());
            item.put("target", m.getTarget());
            item.put("progress", progress.getProgress());
            item.put("completed", progress.isCompleted());
            item.put("rewardXp", m.getRewardXp());
            item.put("rewardCoins", m.getRewardCoins());
            item.put("rewardItemKey", m.getRewardItemKey());
            response.add(item);
        }
        return ResponseEntity.ok(response);
    }
}
