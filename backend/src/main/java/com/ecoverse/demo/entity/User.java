package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String institutionName;

    @Column(nullable = false)
    private Integer grade;

    private String department;

    @Column(nullable = false)
    private String profilePicture; // Default assigned

    private String otp;
    
    private LocalDateTime otpExpiry;

    @Column(nullable = false)
    private boolean enabled; // OTP verified status

    @Builder.Default
    @Column(nullable = false)
    private Integer xp = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer level = 1;

    @Builder.Default
    @Column(nullable = false)
    private Integer currentStreak = 0;

    private LocalDate lastActiveDate;

    @Column(nullable = false)
    private String role; // ROLE_USER, ROLE_ADMIN

    @Builder.Default
    @Column(nullable = false)
    private Integer coins = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer treeXp = 0;

    @Builder.Default
    @Column(nullable = false)
    private Integer treeLevel = 1;
}
