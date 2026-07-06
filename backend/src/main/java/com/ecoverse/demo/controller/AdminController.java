package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.AdminStatsResponse;
import com.ecoverse.demo.entity.*;
import com.ecoverse.demo.repository.*;
import com.ecoverse.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private SeasonalEventRepository seasonalEventRepository;

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private WeeklyMissionRepository weeklyMissionRepository;

    @Autowired
    private TreeLevelRepository treeLevelRepository;

    @GetMapping("/stats")
    public ResponseEntity<AdminStatsResponse> getAdminStats() {
        AdminStatsResponse stats = adminService.getAdminStats();
        return ResponseEntity.ok(stats);
    }

    // ===========================================
    // SEASONAL EVENTS CRUD
    // ===========================================
    @GetMapping("/events")
    public ResponseEntity<List<SeasonalEvent>> getAllEvents() {
        return ResponseEntity.ok(seasonalEventRepository.findAll());
    }

    @PostMapping("/events")
    public ResponseEntity<SeasonalEvent> createEvent(@RequestBody SeasonalEvent event) {
        return ResponseEntity.ok(seasonalEventRepository.save(event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<SeasonalEvent> updateEvent(@PathVariable Long id, @RequestBody SeasonalEvent eventDetails) {
        SeasonalEvent event = seasonalEventRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setBannerUrl(eventDetails.getBannerUrl());
        event.setStartDate(eventDetails.getStartDate());
        event.setEndDate(eventDetails.getEndDate());
        event.setRewardXp(eventDetails.getRewardXp());
        event.setRewardCoins(eventDetails.getRewardCoins());
        event.setBadgeReward(eventDetails.getBadgeReward());
        event.setActive(eventDetails.isActive());
        return ResponseEntity.ok(seasonalEventRepository.save(event));
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        seasonalEventRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ===========================================
    // SHOP ITEMS CRUD
    // ===========================================
    @GetMapping("/shop-items")
    public ResponseEntity<List<ShopItem>> getAllShopItems() {
        return ResponseEntity.ok(shopItemRepository.findAll());
    }

    @PostMapping("/shop-items")
    public ResponseEntity<ShopItem> createShopItem(@RequestBody ShopItem item) {
        return ResponseEntity.ok(shopItemRepository.save(item));
    }

    @PutMapping("/shop-items/{id}")
    public ResponseEntity<ShopItem> updateShopItem(@PathVariable Long id, @RequestBody ShopItem itemDetails) {
        ShopItem item = shopItemRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Shop item not found"));
        item.setName(itemDetails.getName());
        item.setItemKey(itemDetails.getItemKey());
        item.setDescription(itemDetails.getDescription());
        item.setPrice(itemDetails.getPrice());
        item.setCategory(itemDetails.getCategory());
        item.setImageUrl(itemDetails.getImageUrl());
        return ResponseEntity.ok(shopItemRepository.save(item));
    }

    @DeleteMapping("/shop-items/{id}")
    public ResponseEntity<?> deleteShopItem(@PathVariable Long id) {
        shopItemRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ===========================================
    // WEEKLY MISSIONS CRUD
    // ===========================================
    @GetMapping("/missions")
    public ResponseEntity<List<WeeklyMission>> getAllMissions() {
        return ResponseEntity.ok(weeklyMissionRepository.findAll());
    }

    @PostMapping("/missions")
    public ResponseEntity<WeeklyMission> createMission(@RequestBody WeeklyMission mission) {
        return ResponseEntity.ok(weeklyMissionRepository.save(mission));
    }

    @PutMapping("/missions/{id}")
    public ResponseEntity<WeeklyMission> updateMission(@PathVariable Long id, @RequestBody WeeklyMission missionDetails) {
        WeeklyMission mission = weeklyMissionRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Mission not found"));
        mission.setTitle(missionDetails.getTitle());
        mission.setType(missionDetails.getType());
        mission.setTarget(missionDetails.getTarget());
        mission.setRewardXp(missionDetails.getRewardXp());
        mission.setRewardCoins(missionDetails.getRewardCoins());
        mission.setRewardItemKey(missionDetails.getRewardItemKey());
        return ResponseEntity.ok(weeklyMissionRepository.save(mission));
    }

    @DeleteMapping("/missions/{id}")
    public ResponseEntity<?> deleteMission(@PathVariable Long id) {
        weeklyMissionRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // ===========================================
    // TREE LEVELS CRUD
    // ===========================================
    @GetMapping("/tree-levels")
    public ResponseEntity<List<TreeLevel>> getAllTreeLevels() {
        return ResponseEntity.ok(treeLevelRepository.findAll());
    }

    @PostMapping("/tree-levels")
    public ResponseEntity<TreeLevel> createTreeLevel(@RequestBody TreeLevel level) {
        return ResponseEntity.ok(treeLevelRepository.save(level));
    }

    @PutMapping("/tree-levels/{id}")
    public ResponseEntity<TreeLevel> updateTreeLevel(@PathVariable Long id, @RequestBody TreeLevel levelDetails) {
        TreeLevel level = treeLevelRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Tree level not found"));
        level.setLevel(levelDetails.getLevel());
        level.setStageName(levelDetails.getStageName());
        level.setXpRequired(levelDetails.getXpRequired());
        level.setImageUrl(levelDetails.getImageUrl());
        return ResponseEntity.ok(treeLevelRepository.save(level));
    }

    @DeleteMapping("/tree-levels/{id}")
    public ResponseEntity<?> deleteTreeLevel(@PathVariable Long id) {
        treeLevelRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
