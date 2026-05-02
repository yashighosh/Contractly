package com.contractly.signature.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignatureRecord {
    private Long id;
    private Long contractId;
    private String signerName;
    private String signerEmail;
    private String signatureData;   // base64 encoded signature image
    private String ipAddress;
    private String userAgent;
    private String documentHash;
    private LocalDateTime signedAt;
}
