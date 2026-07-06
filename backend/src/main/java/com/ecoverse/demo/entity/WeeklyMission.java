package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "weekly_missions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeeklyMission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String type; // QUIZ, MODULE, XP, TREE, SHOP, CHALLENGE, STREAK

    @Column(nullable = false)
    private Integer target;

    @Column(nullable = false)
    private Integer rewardXp;

    @Column(nullable = false)
    private Integer rewardCoins;

    private String rewardItemKey; // Optional rare item key reward
}
