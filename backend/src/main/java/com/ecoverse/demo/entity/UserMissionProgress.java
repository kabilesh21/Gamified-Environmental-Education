package com.ecoverse.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_mission_progress", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"userId", "missionId"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMissionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long missionId;

    @Column(nullable = false)
    private Integer progress = 0;

    @Column(nullable = false)
    private boolean completed = false;
}
