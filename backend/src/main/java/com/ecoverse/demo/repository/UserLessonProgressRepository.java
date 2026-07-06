package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.UserLessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgress, Long> {
    Optional<UserLessonProgress> findByUserIdAndLessonId(Long userId, Long lessonId);
    long countByUserIdAndLessonCourseId(Long userId, Long courseId);
    List<UserLessonProgress> findByUserId(Long userId);
    long countByUserId(Long userId);
}
