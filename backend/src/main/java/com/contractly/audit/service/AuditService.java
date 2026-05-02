package com.contractly.audit.service;

import com.contractly.audit.dto.AuditLogResponse;
import com.contractly.audit.model.AuditLog;
import com.contractly.audit.repository.AuditRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Audit service — records all contract lifecycle events for legal defensibility.
 */
@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditRepository auditRepository;

    public AuditService(AuditRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    /**
     * Log an authenticated user action.
     */
    public void log(Long contractId, Long userId, String action, String metadata) {
        AuditLog entry = AuditLog.builder()
                .contractId(contractId)
                .userId(userId)
                .action(action)
                .metadata(metadata)
                .build();
        auditRepository.save(entry);
        log.info("Audit: contract={} user={} action={}", contractId, userId, action);
    }

    /**
     * Log an anonymous action (e.g., recipient viewing/signing via token).
     */
    public void logAnonymous(Long contractId, String action, String ipAddress, String userAgent) {
        AuditLog entry = AuditLog.builder()
                .contractId(contractId)
                .action(action)
                .ipAddress(ipAddress)
                .userAgent(userAgent)
                .build();
        auditRepository.save(entry);
        log.info("Audit: contract={} action={} ip={}", contractId, action, ipAddress);
    }

    /**
     * Get the full audit trail for a contract.
     */
    public List<AuditLogResponse> getAuditTrail(Long contractId) {
        return auditRepository.findByContractId(contractId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Get recent activity for a user.
     */
    public List<AuditLogResponse> getRecentActivity(Long userId, int limit) {
        return auditRepository.findRecentByUserId(userId, limit)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AuditLogResponse toResponse(AuditLog a) {
        return AuditLogResponse.builder()
                .id(a.getId())
                .contractId(a.getContractId())
                .userId(a.getUserId())
                .action(a.getAction())
                .ipAddress(a.getIpAddress())
                .userAgent(a.getUserAgent())
                .metadata(a.getMetadata())
                .createdAt(a.getCreatedAt())
                .build();
    }
}
