package com.contractly.clause.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Clause {
    private Long id;
    private Long userId;
    private String title;
    private String category;    // "payment_terms", "ip_ownership", "nda", etc.
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
