package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "badges")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Badge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private String iconName; // e.g. "leaf", "shield", "award"

    @Column(nullable = false)
    private String type; // START, WATER, QUIZ, STREAK, CLIMATE
}
