package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private String difficulty; // Beginner, Intermediate, Advanced

    @Column(nullable = false)
    private String imageUrl; // Eco-themed image

    @Column(nullable = false)
    private String badgeReward; // Name of the badge unlocked upon completion
}
