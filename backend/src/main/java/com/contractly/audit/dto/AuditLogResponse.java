package com.contractly.audit.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private Long contractId;
    private Long userId;
    private String action;
    private String ipAddress;
    private String userAgent;
    private String metadata;
    private LocalDateTime createdAt;
}
