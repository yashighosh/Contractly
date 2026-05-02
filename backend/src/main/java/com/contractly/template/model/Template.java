package com.contractly.template.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Template {
    private Long id;
    private Long userId;
    private String title;
    private String description;
    private String content;       // TipTap JSON / HTML
    private String variables;     // JSON array: ["client_name", "amount", "start_date"]
    private boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
