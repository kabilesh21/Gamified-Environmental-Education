package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String token;
    private String email;
    private String fullName;
    private String role;
    private Integer xp;
    private Integer level;
    private Integer streak;
    private Integer coins;
    private Integer treeLevel;
}
