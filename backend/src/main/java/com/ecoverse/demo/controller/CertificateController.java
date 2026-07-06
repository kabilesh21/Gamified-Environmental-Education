package com.ecoverse.demo.controller;

import com.ecoverse.demo.dto.CertificateResponse;
import com.ecoverse.demo.entity.User;
import com.ecoverse.demo.repository.UserRepository;
import com.ecoverse.demo.security.UserPrincipal;
import com.ecoverse.demo.service.CertificateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/certificates")
public class CertificateController {

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<CertificateResponse>> getUserCertificates(@AuthenticationPrincipal UserPrincipal principal) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        List<CertificateResponse> certificates = certificateService.getUserCertificates(user);
        return ResponseEntity.ok(certificates);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<CertificateResponse> getCertificate(@PathVariable String certificateId) {
        try {
            CertificateResponse certificate = certificateService.getCertificate(certificateId);
            return ResponseEntity.ok(certificate);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
