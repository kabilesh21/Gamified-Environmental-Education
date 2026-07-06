package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderboardResponse {
    private Integer rank;
    private Long id;
    private String fullName;
    private String email;
    private Integer xp;
    private Integer level;
    private String profilePicture;
}
