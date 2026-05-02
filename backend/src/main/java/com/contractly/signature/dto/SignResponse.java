package com.contractly.signature.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SignResponse {
    private Long contractId;
    private String contractTitle;
    private String content;
    private String recipientName;
    private String status;
    private boolean alreadySigned;
    private LocalDateTime signedAt;
}
