package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.TreeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/tree")
public class TreeController {

    @Autowired
    private TreeService treeService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getTreeProgress(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        Map<String, Object> progress = treeService.getTreeProgress(user);
        return ResponseEntity.ok(progress);
    }

    @PostMapping("/water")
    public ResponseEntity<?> waterTree(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            User user = userRepository.findById(principal.getId()).orElseThrow();
            if (user.getCoins() < 5) {
                return ResponseEntity.badRequest().body(Map.of("message", "Not enough Eco Coins!"));
            }
            user.setCoins(user.getCoins() - 5);
            user.setXp(user.getXp() + 15);
            
            int calculatedLevel = (user.getXp() / 500) + 1;
            if (calculatedLevel > user.getLevel()) {
                user.setLevel(calculatedLevel);
            }
            userRepository.save(user);
            
            Map<String, Object> progress = treeService.getTreeProgress(user);
            progress.put("coins", user.getCoins());
            progress.put("xp", user.getXp());
            progress.put("level", user.getLevel());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/fertilize")
    public ResponseEntity<?> fertilizeTree(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            User user = userRepository.findById(principal.getId()).orElseThrow();
            if (user.getCoins() < 10) {
                return ResponseEntity.badRequest().body(Map.of("message", "Not enough Eco Coins!"));
            }
            user.setCoins(user.getCoins() - 10);
            user.setXp(user.getXp() + 35);
            
            int calculatedLevel = (user.getXp() / 500) + 1;
            if (calculatedLevel > user.getLevel()) {
                user.setLevel(calculatedLevel);
            }
            userRepository.save(user);
            
            Map<String, Object> progress = treeService.getTreeProgress(user);
            progress.put("coins", user.getCoins());
            progress.put("xp", user.getXp());
            progress.put("level", user.getLevel());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/quiz")
    public ResponseEntity<?> completeTreeQuiz(@AuthenticationPrincipal UserPrincipal principal) {
        try {
            User user = userRepository.findById(principal.getId()).orElseThrow();
            user.setXp(user.getXp() + 50);
            
            int calculatedLevel = (user.getXp() / 500) + 1;
            if (calculatedLevel > user.getLevel()) {
                user.setLevel(calculatedLevel);
            }
            userRepository.save(user);
            
            Map<String, Object> progress = treeService.getTreeProgress(user);
            progress.put("coins", user.getCoins());
            progress.put("xp", user.getXp());
            progress.put("level", user.getLevel());
            return ResponseEntity.ok(progress);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
