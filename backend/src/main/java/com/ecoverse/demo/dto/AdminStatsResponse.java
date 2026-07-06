package com.ecoverse.demo.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsResponse {
    private long totalUsers;
    private long totalEnrollments;
    private long totalCompletions;
    private List<CourseAdminStats> courseStats;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseAdminStats {
        private Long courseId;
        private String title;
        private long enrollmentCount;
        private long completionCount;
    }
}
