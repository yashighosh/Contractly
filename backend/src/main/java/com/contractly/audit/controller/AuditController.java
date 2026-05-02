package com.contractly.audit.controller;

import com.contractly.audit.dto.AuditLogResponse;
import com.contractly.audit.service.AuditService;
import com.contractly.common.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/audit")
public class AuditController {

    private final AuditService auditService;

    public AuditController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping("/contracts/{contractId}")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getAuditTrail(
            @PathVariable Long contractId) {
        List<AuditLogResponse> trail = auditService.getAuditTrail(contractId);
        return ResponseEntity.ok(ApiResponse.success(trail));
    }
}
