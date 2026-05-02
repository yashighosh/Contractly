package com.contractly.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private int totalContracts;
    private int draftCount;
    private int sentCount;
    private int viewedCount;
    private int signedCount;
    private int expiredCount;
    private BigDecimal totalRevenue;        // sum of amount in SIGNED contracts
    private int expiringSoonCount;          // contracts expiring within 7 days
}
