package com.ecoverse.demo.service;

import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.entity.ShopItem;
import com.ecoverse.demo.entity.UserGardenItem;
import com.ecoverse.demo.repository.ShopItemRepository;
import com.ecoverse.demo.repository.UserGardenItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class GardenService {

    @Autowired
    private UserGardenItemRepository userGardenItemRepository;

    @Autowired
    private ShopItemRepository shopItemRepository;

    @Transactional
    public List<UserGardenItem> getUserGarden(User user, String theme) {
        List<UserGardenItem> items = userGardenItemRepository.findByUserIdAndGardenTheme(user.getId(), theme);
        List<ShopItem> shopItems = shopItemRepository.findAll();

        // Fetch woodland items to copy unlocked status
        List<UserGardenItem> woodlandItems = userGardenItemRepository.findByUserIdAndGardenTheme(user.getId(), "woodland");

        // Populate missing items in the garden for this theme
        for (ShopItem s : shopItems) {
            boolean exists = items.stream().anyMatch(i -> i.getItemKey().equals(s.getItemKey()));
            if (!exists) {
                // Determine if this item is unlocked based on woodland items (or globally)
                boolean isUnlocked = woodlandItems.stream()
                        .filter(wi -> wi.getItemKey().equals(s.getItemKey()))
                        .map(UserGardenItem::isUnlocked)
                        .findFirst()
                        .orElse(false);

                // Assign pre-defined default layout coordinates for items to look nice
                double[] coords = getDefaultCoords(s.getItemKey(), theme);
                UserGardenItem ugi = UserGardenItem.builder()
                        .userId(user.getId())
                        .itemKey(s.getItemKey())
                        .unlocked(isUnlocked)
                        .x(coords[0])
                        .y(coords[1])
                        .gardenTheme(theme)
                        .build();
                items.add(userGardenItemRepository.save(ugi));
            }
        }
        return items;
    }

    @Transactional
    public void updateItemPosition(User user, String itemKey, Double x, Double y, String theme) {
        Optional<UserGardenItem> ugiOpt = userGardenItemRepository.findByUserIdAndItemKeyAndGardenTheme(user.getId(), itemKey, theme);
        if (ugiOpt.isPresent()) {
            UserGardenItem ugi = ugiOpt.get();
            ugi.setX(x);
            ugi.setY(y);
            userGardenItemRepository.save(ugi);
        }
    }

    private double[] getDefaultCoords(String itemKey, String theme) {
        if ("alpine".equalsIgnoreCase(theme)) {
            switch (itemKey) {
                case "tree_oak": return new double[]{12.0, 45.0};
                case "tree_bamboo": return new double[]{75.0, 25.0};
                case "tree_cherry": return new double[]{20.0, 30.0};
                case "flower_sunflower": return new double[]{35.0, 75.0};
                case "flower_rose": return new double[]{55.0, 70.0};
                case "flower_tulip": return new double[]{25.0, 80.0};
                case "animal_butterfly": return new double[]{65.0, 50.0};
                case "animal_bird": return new double[]{15.0, 20.0};
                case "dec_bench": return new double[]{40.0, 60.0};
                case "dec_rainbow": return new double[]{50.0, 15.0};
                case "garden_windmill": return new double[]{80.0, 40.0};
                case "garden_solar": return new double[]{75.0, 80.0};
                case "garden_pond": return new double[]{20.0, 65.0};
                case "garden_hive": return new double[]{70.0, 55.0};
                case "toy_fountain": return new double[]{50.0, 60.0};
                case "toy_bubble_machine": return new double[]{30.0, 70.0};
                case "toy_kite": return new double[]{45.0, 15.0};
                default: return new double[]{Math.random() * 80 + 10, Math.random() * 70 + 15};
            }
        } else if ("coastal".equalsIgnoreCase(theme)) {
            switch (itemKey) {
                case "tree_oak": return new double[]{10.0, 25.0};
                case "tree_bamboo": return new double[]{85.0, 15.0};
                case "tree_cherry": return new double[]{30.0, 20.0};
                case "flower_sunflower": return new double[]{45.0, 75.0};
                case "flower_rose": return new double[]{60.0, 65.0};
                case "flower_tulip": return new double[]{35.0, 80.0};
                case "animal_butterfly": return new double[]{55.0, 40.0};
                case "animal_bird": return new double[]{25.0, 10.0};
                case "dec_bench": return new double[]{50.0, 55.0};
                case "dec_rainbow": return new double[]{50.0, 5.0};
                case "garden_windmill": return new double[]{80.0, 30.0};
                case "garden_solar": return new double[]{65.0, 70.0};
                case "garden_pond": return new double[]{15.0, 50.0};
                case "garden_hive": return new double[]{70.0, 45.0};
                case "toy_fountain": return new double[]{20.0, 45.0};
                case "toy_bubble_machine": return new double[]{75.0, 60.0};
                case "toy_kite": return new double[]{65.0, 10.0};
                default: return new double[]{Math.random() * 80 + 10, Math.random() * 70 + 15};
            }
        }
        // default "woodland" theme
        switch (itemKey) {
            case "tree_oak": return new double[]{15.0, 30.0};
            case "tree_bamboo": return new double[]{80.0, 20.0};
            case "tree_cherry": return new double[]{25.0, 25.0};
            case "flower_sunflower": return new double[]{40.0, 65.0};
            case "flower_rose": return new double[]{50.0, 60.0};
            case "flower_tulip": return new double[]{30.0, 70.0};
            case "animal_butterfly": return new double[]{60.0, 45.0};
            case "animal_bird": return new double[]{20.0, 15.0};
            case "dec_bench": return new double[]{45.0, 50.0};
            case "dec_rainbow": return new double[]{50.0, 10.0};
            case "garden_windmill": return new double[]{85.0, 35.0};
            case "garden_solar": return new double[]{70.0, 75.0};
            case "garden_pond": return new double[]{15.0, 55.0};
            case "garden_hive": return new double[]{75.0, 45.0};
            case "toy_fountain": return new double[]{35.0, 55.0};
            case "toy_bubble_machine": return new double[]{60.0, 65.0};
            case "toy_kite": return new double[]{55.0, 20.0};
            default: return new double[]{Math.random() * 80 + 10, Math.random() * 70 + 15};
        }
    }
}
