package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.ShopItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ShopItemRepository extends JpaRepository<ShopItem, Long> {
    Optional<ShopItem> findByItemKey(String itemKey);
}
