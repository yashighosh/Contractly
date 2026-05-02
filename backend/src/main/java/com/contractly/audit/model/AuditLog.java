package com.contractly.audit.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {
    private Long id;
    private Long contractId;
    private Long userId;
    private String action;       // "CREATED", "SENT", "VIEWED", "SIGNED", etc.
    private String ipAddress;
    private String userAgent;
    private String metadata;     // JSON string
    private LocalDateTime createdAt;
}
