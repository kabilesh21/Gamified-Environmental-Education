package com.ecoverse.demo.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserActivityResponse {
    private Long id;
    private String title;
    private String xpChange;
    private String type;
    private LocalDateTime timestamp;
}
