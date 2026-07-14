package com.ecoverse.demo.service;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.ShopItem;
import com.ecoverse.demo.entity.UserGardenItem;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.repository.ShopItemRepository;
import com.ecoverse.demo.repository.UserGardenItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class ShopService {

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Autowired
    private UserGardenItemRepository userGardenItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeeklyMissionService weeklyMissionService;

    @Autowired
    private DashboardService dashboardService;

    @Transactional
    public void purchaseItem(User user, String itemKey) {
        ShopItem shopItem = shopItemRepository.findByItemKey(itemKey)
                .orElseThrow(() -> new IllegalArgumentException("Shop item not found!"));

        java.util.List<UserGardenItem> userItems = userGardenItemRepository.findByUserIdAndItemKey(user.getId(), itemKey);
        
        boolean alreadyPurchased = userItems.stream().anyMatch(UserGardenItem::isUnlocked);
        if (alreadyPurchased) {
            throw new IllegalStateException("Item already purchased!");
        }

        if (user.getCoins() < shopItem.getPrice()) {
            throw new IllegalStateException("Insufficient Eco Coins!");
        }

        // Deduct coins and unlock item
        user.setCoins(user.getCoins() - shopItem.getPrice());
        
        if (userItems.isEmpty()) {
            UserGardenItem defaultItem = UserGardenItem.builder()
                    .userId(user.getId())
                    .itemKey(itemKey)
                    .unlocked(true)
                    .x(50.0)
                    .y(50.0)
                    .gardenTheme("woodland")
                    .build();
            userGardenItemRepository.save(defaultItem);
        } else {
            for (UserGardenItem ugi : userItems) {
                ugi.setUnlocked(true);
                userGardenItemRepository.save(ugi);
            }
        }

        userRepository.save(user);

        // Increment weekly mission progress
        weeklyMissionService.incrementProgress(user, "SHOP", 1);

        // Log activity
        dashboardService.logActivity(user, "Purchased " + shopItem.getName() + " from Reward Shop", "-" + shopItem.getPrice() + " Coins", "SHOP");
    }
}
