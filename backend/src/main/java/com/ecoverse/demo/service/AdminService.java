package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.AdminStatsResponse;
import com.ecoverse.demo.entity.Course;
import com.ecoverse.demo.repository.CourseRepository;
import com.ecoverse.demo.repository.EnrollmentRepository;
import com.ecoverse.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public AdminStatsResponse getAdminStats() {
        long totalUsers = userRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        
        // Count completions by fetching all enrollments and filtering completed ones
        long totalCompletions = enrollmentRepository.findAll().stream()
                .filter(com.ecoverse.demo.entity.Enrollment::isCompleted)
                .count();

        List<Course> courses = courseRepository.findAll();
        List<AdminStatsResponse.CourseAdminStats> courseStats = new ArrayList<>();

        for (Course course : courses) {
            long enrollments = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getCourse().getId().equals(course.getId()))
                    .count();

            long completions = enrollmentRepository.findAll().stream()
                    .filter(e -> e.getCourse().getId().equals(course.getId()) && e.isCompleted())
                    .count();

            courseStats.add(AdminStatsResponse.CourseAdminStats.builder()
                    .courseId(course.getId())
                    .title(course.getTitle())
                    .enrollmentCount(enrollments)
                    .completionCount(completions)
                    .build());
        }

        return AdminStatsResponse.builder()
                .totalUsers(totalUsers)
                .totalEnrollments(totalEnrollments)
                .totalCompletions(totalCompletions)
                .courseStats(courseStats)
                .build();
    }
}
