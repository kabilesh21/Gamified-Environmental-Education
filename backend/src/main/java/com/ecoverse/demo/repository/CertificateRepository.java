package com.ecoverse.demo.repository;

import com.ecoverse.demo.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    Optional<Certificate> findByUserIdAndCourseId(Long userId, Long courseId);
    List<Certificate> findByUserId(Long userId);
    Optional<Certificate> findByCertificateId(String certificateId);
}
