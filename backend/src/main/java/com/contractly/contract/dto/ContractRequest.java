package com.contractly.contract.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class ContractRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private Long templateId;
    private String variablesData;       // JSON string of filled variables
    private String recipientName;
    private String recipientEmail;
    private BigDecimal amount;
    private String currency;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean recurring;
    private Integer renewalPeriodDays;
    private boolean autoRenew;
    private List<Long> clauseIds;       // clauses to attach
}
