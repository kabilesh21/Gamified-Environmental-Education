package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.TreeLevel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface TreeLevelRepository extends JpaRepository<TreeLevel, Long> {
    Optional<TreeLevel> findByLevel(Integer level);
}
