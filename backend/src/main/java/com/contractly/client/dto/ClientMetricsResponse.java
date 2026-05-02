package com.contractly.client.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ClientMetricsResponse {
    private Long totalContractsSent;
    private BigDecimal totalRevenue;
}
