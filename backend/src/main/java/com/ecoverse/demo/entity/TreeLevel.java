package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tree_levels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TreeLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private Integer level;

    @Column(nullable = false)
    private String stageName; // e.g. "Seed", "Sprout", "Sapling", "Mature Tree"

    @Column(nullable = false)
    private Integer xpRequired; // XP needed to unlock this level

    @Column(nullable = false)
    private String imageUrl; // E.g. Emoji or illustration identifier
}
