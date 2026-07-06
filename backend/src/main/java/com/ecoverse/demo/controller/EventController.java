package com.ecoverse.demo.controller;

import com.ecoverse.demo.entity.SeasonalEvent;
import com.ecoverse.demo.repository.SeasonalEventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private SeasonalEventRepository seasonalEventRepository;

    @GetMapping("/active")
    public ResponseEntity<List<SeasonalEvent>> getActiveEvents() {
        List<SeasonalEvent> activeEvents = seasonalEventRepository.findActiveEvents(LocalDate.now());
        return ResponseEntity.ok(activeEvents);
    }
}
