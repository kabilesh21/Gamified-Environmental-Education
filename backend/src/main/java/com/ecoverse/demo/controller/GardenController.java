package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.UserGardenItem;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.GardenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/garden")
public class GardenController {

    @Autowired
    private GardenService gardenService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<UserGardenItem>> getUserGarden(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(value = "theme", defaultValue = "woodland") String theme) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<UserGardenItem> garden = gardenService.getUserGarden(user, theme);
        return ResponseEntity.ok(garden);
    }

    @PostMapping("/update-position")
    public ResponseEntity<?> updatePosition(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> body) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        String itemKey = (String) body.get("itemKey");
        Double x = ((Number) body.get("x")).doubleValue();
        Double y = ((Number) body.get("y")).doubleValue();
        String theme = body.containsKey("theme") ? (String) body.get("theme") : "woodland";
        
        gardenService.updateItemPosition(user, itemKey, x, y, theme);
        return ResponseEntity.ok().build();
    }
}
