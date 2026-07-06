package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.WeeklyMission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeeklyMissionRepository extends JpaRepository<WeeklyMission, Long> {
}
