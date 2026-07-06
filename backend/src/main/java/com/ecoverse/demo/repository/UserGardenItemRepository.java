package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.UserGardenItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserGardenItemRepository extends JpaRepository<UserGardenItem, Long> {
    List<UserGardenItem> findByUserId(Long userId);
    List<UserGardenItem> findByUserIdAndItemKey(Long userId, String itemKey);
    List<UserGardenItem> findByUserIdAndGardenTheme(Long userId, String gardenTheme);
    Optional<UserGardenItem> findByUserIdAndItemKeyAndGardenTheme(Long userId, String itemKey, String gardenTheme);
}
