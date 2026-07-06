package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "achievements")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private Integer xpReward;

    @Column(nullable = false, unique = true)
    private String achievementKey; // e.g. FIRST_LOGIN, LESSONS_5, COURSES_3, STREAK_7, QUIZ_MASTER
}
