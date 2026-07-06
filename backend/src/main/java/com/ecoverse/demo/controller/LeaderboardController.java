package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.LeaderboardResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard() {
        List<User> users = userRepository.findAllByOrderByXpDesc();
        List<LeaderboardResponse> response = new ArrayList<>();
        
        int rank = 1;
        for (User user : users) {
            // Only list verified accounts in the leaderboard
            if (user.isEnabled()) {
                response.add(LeaderboardResponse.builder()
                        .rank(rank++)
                        .id(user.getId())
                        .fullName(user.getFullName())
                        .email(user.getEmail())
                        .xp(user.getXp())
                        .level(user.getLevel())
                        .profilePicture(user.getProfilePicture())
                        .build());
            }
        }
        
        return ResponseEntity.ok(response);
    }
}
