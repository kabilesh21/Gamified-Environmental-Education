package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.ShopItem;
import com.ecoverse.demo.repository.ShopItemRepository;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private ShopService shopService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/items")
    public ResponseEntity<List<ShopItem>> getShopItems() {
        List<ShopItem> items = shopItemRepository.findAll();
        return ResponseEntity.ok(items);
    }

    @PostMapping("/buy/{itemKey}")
    public ResponseEntity<?> purchaseItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String itemKey) {
        try {
            User user = userRepository.findById(principal.getId()).orElseThrow();
            shopService.purchaseItem(user, itemKey);
            return ResponseEntity.ok(Map.of("message", "Purchase successful!", "coins", user.getCoins()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
