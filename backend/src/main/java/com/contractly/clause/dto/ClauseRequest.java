package com.contractly.clause.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ClauseRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String category;

    @NotBlank(message = "Content is required")
    private String content;
}
