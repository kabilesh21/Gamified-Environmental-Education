package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.UserProfileResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<UserProfileResponse> getUserProfile(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        UserProfileResponse profile = profileService.getUserProfile(user);
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateUserProfile(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        
        String fullName = (String) body.get("fullName");
        String institutionName = (String) body.get("institutionName");
        Integer grade = body.get("grade") != null ? ((Number) body.get("grade")).intValue() : null;
        String department = (String) body.get("department");
        String profilePicture = (String) body.get("profilePicture");

        User updatedUser = profileService.updateUserProfile(user, fullName, institutionName, grade, department, profilePicture);
        UserProfileResponse profile = profileService.getUserProfile(updatedUser);
        return ResponseEntity.ok(profile);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteUserProfile(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        profileService.deleteUserAccount(user);
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully!"));
    }
}
