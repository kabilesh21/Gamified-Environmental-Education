package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.UserMissionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserMissionProgressRepository extends JpaRepository<UserMissionProgress, Long> {
    List<UserMissionProgress> findByUserId(Long userId);
    Optional<UserMissionProgress> findByUserIdAndMissionId(Long userId, Long missionId);
}
