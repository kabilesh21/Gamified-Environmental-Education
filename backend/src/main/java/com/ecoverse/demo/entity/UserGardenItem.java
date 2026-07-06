package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_garden_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "itemKey", "gardenTheme"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserGardenItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String itemKey;

    @Column(nullable = false)
    private boolean unlocked;

    private Double x; // Coordinate X (%)
    private Double y; // Coordinate Y (%)

    @Builder.Default
    @Column(nullable = false)
    private String gardenTheme = "woodland";
}
