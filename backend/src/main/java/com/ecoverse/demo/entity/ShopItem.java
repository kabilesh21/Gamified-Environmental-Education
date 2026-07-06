package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String itemKey;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private Integer price;

    @Column(nullable = false)
    private String category; // TREES, FLOWERS, ANIMALS, DECORATIONS, GARDEN_ITEMS, AVATAR_FRAMES, THEMES, SEASONAL

    @Column(nullable = false)
    private String imageUrl;
}
