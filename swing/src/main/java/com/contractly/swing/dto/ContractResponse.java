package com.contractly.swing.dto;

import com.contractly.swing.model.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {
    private Long id;
    private Long clientId;
    private String title;
    private String content;
    private String variablesData;
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
    private String signLink;
    private String signedPdfKey;
    private LocalDateTime sentAt;
    private LocalDateTime viewedAt;
    private LocalDateTime signedAt;
    private LocalDateTime expiredAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
