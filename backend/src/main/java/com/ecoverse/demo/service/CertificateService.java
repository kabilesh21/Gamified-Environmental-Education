package com.ecoverse.demo.service;

import com.ecoverse.demo.dto.CertificateResponse;
import com.ecoverse.demo.entity.Certificate;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.CertificateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    @Autowired
    private CertificateRepository certificateRepository;

    public CertificateResponse getCertificate(String certificateId) {
        Certificate cert = certificateRepository.findByCertificateId(certificateId)
                .orElseThrow(() -> new IllegalArgumentException("Certificate not found!"));

        return mapToCertificateResponse(cert);
    }

    public List<CertificateResponse> getUserCertificates(User user) {
        List<Certificate> certs = certificateRepository.findByUserId(user.getId());
        return certs.stream()
                .map(this::mapToCertificateResponse)
                .collect(Collectors.toList());
    }

    private CertificateResponse mapToCertificateResponse(Certificate cert) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        return CertificateResponse.builder()
                .certificateId(cert.getCertificateId())
                .fullName(cert.getUser().getFullName())
                .courseName(cert.getCourse().getTitle())
                .issueDate(cert.getIssueDate().format(formatter))
                .badgeName(cert.getCourse().getBadgeReward())
                .build();
    }
}
