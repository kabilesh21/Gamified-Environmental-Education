package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.SeasonalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface SeasonalEventRepository extends JpaRepository<SeasonalEvent, Long> {
    @Query("SELECT e FROM SeasonalEvent e WHERE e.active = true AND :currentDate BETWEEN e.startDate AND e.endDate")
    List<SeasonalEvent> findActiveEvents(LocalDate currentDate);
}
