package com.contractly.contract.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Domain model for a contract.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    private Long id;
    private Long userId;
    private Long clientId;
    private Long templateId;
    private String title;
    private String content;
    private String variablesData;      // JSON string
    private ContractStatus status;
    private String recipientName;
    private String recipientEmail;
    private BigDecimal amount;
    private String currency;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean recurring;
    private Integer renewalPeriodDays;
    private boolean autoRenew;
    private String signToken;
    private LocalDateTime signTokenExpiry;
    private String signedPdfKey;
    private LocalDateTime sentAt;
    private LocalDateTime viewedAt;
    private LocalDateTime signedAt;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
