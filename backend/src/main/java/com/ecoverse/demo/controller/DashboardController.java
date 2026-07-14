package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.DashboardStatsResponse;
import com.ecoverse.demo.dto.UserActivityResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsResponse> getDashboardStats(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        DashboardStatsResponse stats = dashboardService.getDashboardStats(user);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<UserActivityResponse>> getRecentActivities(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<UserActivityResponse> activities = dashboardService.getRecentActivities(user);
        return ResponseEntity.ok(activities);
    }
}
