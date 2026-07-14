package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String xpChange; // e.g., "+10 XP", "-5 Coins"

    @Column(nullable = false)
    private String type; // e.g., "QUIZ", "BADGE", "LESSON", "TREE", "SHOP", "STREAK"

    @Column(nullable = false)
    private LocalDateTime timestamp;
}
