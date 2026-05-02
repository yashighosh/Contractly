package com.contractly.dashboard.controller;

import com.contractly.audit.dto.AuditLogResponse;
import com.contractly.audit.service.AuditService;
import com.contractly.common.dto.ApiResponse;
import com.contractly.dashboard.dto.DashboardStats;
import com.contractly.dashboard.service.DashboardService;
import com.contractly.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuditService auditService;

    public DashboardController(DashboardService dashboardService, AuditService auditService) {
        this.dashboardService = dashboardService;
        this.auditService = auditService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStats>> getStats(
            @AuthenticationPrincipal UserPrincipal principal) {
        DashboardStats stats = dashboardService.getStats(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<AuditLogResponse>>> getRecentActivity(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(defaultValue = "20") int limit) {
        List<AuditLogResponse> activity = auditService.getRecentActivity(principal.getId(), limit);
        return ResponseEntity.ok(ApiResponse.success(activity));
    }
}
