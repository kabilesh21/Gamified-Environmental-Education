package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {
    private Long id;
    private String title;
    private String content;
    private Integer sequence;
    private boolean completed;
}
