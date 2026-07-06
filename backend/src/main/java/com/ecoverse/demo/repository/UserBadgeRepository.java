package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.UserBadge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadge, Long> {
    List<UserBadge> findByUserId(Long userId);
    Optional<UserBadge> findByUserIdAndBadgeId(Long userId, Long badgeId);
    boolean existsByUserIdAndBadgeId(Long userId, Long badgeId);
}
