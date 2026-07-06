package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.*;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/courses")
    public ResponseEntity<List<CourseResponse>> getCourses(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<CourseResponse> courses = courseService.getAllCourses(user);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/courses/{id}")
    public ResponseEntity<CourseResponse> getCourseDetails(
            @PathVariable Long id, 
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        CourseResponse course = courseService.getCourseDetails(id, user);
        return ResponseEntity.ok(course);
    }

    @PostMapping("/courses/{id}/enroll")
    public ResponseEntity<?> enrollInCourse(
            @PathVariable Long id, 
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        courseService.enrollInCourse(id, user);
        return ResponseEntity.ok(Map.of("message", "Enrolled in course successfully!"));
    }

    @PostMapping("/lessons/{id}/complete")
    public ResponseEntity<?> completeLesson(
            @PathVariable Long id, 
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        courseService.completeLesson(id, user);
        return ResponseEntity.ok(Map.of("message", "Lesson marked as completed!"));
    }

    @GetMapping("/courses/{id}/quiz")
    public ResponseEntity<QuizResponse> getQuiz(@PathVariable Long id) {
        QuizResponse quiz = courseService.getQuiz(id);
        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/quizzes/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @RequestBody QuizSubmissionRequest request, 
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        QuizResultResponse result = courseService.submitQuiz(request, user);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/courses/recommendations")
    public ResponseEntity<List<CourseResponse>> getRecommendations(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<CourseResponse> recommendations = courseService.getRecommendations(user);
        return ResponseEntity.ok(recommendations);
    }

    @PostMapping("/courses")
    public ResponseEntity<?> createCourse(
            @RequestBody CourseCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        if (!"ROLE_ADMIN".equals(user.getRole()) && !"ROLE_STAFF".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only admin and staff can add courses!"));
        }
        courseService.createCourse(request);
        return ResponseEntity.ok(Map.of("message", "Course created successfully!"));
    }

    @GetMapping("/courses/{id}/quiz/edit")
    public ResponseEntity<?> getQuizForEdit(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        if (!"ROLE_ADMIN".equals(user.getRole()) && !"ROLE_STAFF".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only admin and staff can access this!"));
        }
        return ResponseEntity.ok(courseService.getQuizForEdit(id));
    }

    @PutMapping("/courses/{id}")
    public ResponseEntity<?> updateCourse(
            @PathVariable Long id,
            @RequestBody CourseCreateRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        if (!"ROLE_ADMIN".equals(user.getRole()) && !"ROLE_STAFF".equals(user.getRole())) {
            return ResponseEntity.status(403).body(Map.of("message", "Only admin and staff can edit courses!"));
        }
        courseService.updateCourse(id, request);
        return ResponseEntity.ok(Map.of("message", "Course updated successfully!"));
    }
}
