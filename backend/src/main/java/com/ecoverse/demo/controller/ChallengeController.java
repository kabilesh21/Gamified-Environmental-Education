package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.WeeklyMissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeeklyMissionService weeklyMissionService;

    @PostMapping("/complete")
    public ResponseEntity<?> completeChallenge(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> request) {
        try {
            User user = userRepository.findById(principal.getId()).orElseThrow();
            
            int rewardXp = ((Number) request.get("rewardXp")).intValue();
            int rewardCoins = ((Number) request.get("rewardCoins")).intValue();
            
            // Add rewards
            user.setXp(user.getXp() + rewardXp);
            user.setCoins(user.getCoins() + rewardCoins);
            
            // Simple level calculation: 1 level per 500 XP
            int calculatedLevel = (user.getXp() / 500) + 1;
            if (calculatedLevel > user.getLevel()) {
                user.setLevel(calculatedLevel);
            }
            
            userRepository.save(user);
            
            // Increment weekly mission progress
            weeklyMissionService.incrementProgress(user, "CHALLENGE", 1);
            weeklyMissionService.incrementProgress(user, "XP", rewardXp);
            
            return ResponseEntity.ok(Map.of(
                "message", "Challenge completed successfully!",
                "xp", user.getXp(),
                "coins", user.getCoins(),
                "level", user.getLevel()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
