package com.contractly.clause.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClauseResponse {
    private Long id;
    private String title;
    private String category;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
