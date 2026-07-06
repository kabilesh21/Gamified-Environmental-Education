package com.ecoverse.demo.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {
    private String certificateId;
    private String fullName;
    private String courseName;
    private String issueDate;
    private String badgeName;
}
