package com.contractly.template.controller;

import com.contractly.common.dto.ApiResponse;
import com.contractly.security.UserPrincipal;
import com.contractly.template.dto.TemplateRequest;
import com.contractly.template.dto.TemplateResponse;
import com.contractly.template.service.TemplateService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/templates")
public class TemplateController {

    private final TemplateService templateService;

    public TemplateController(TemplateService templateService) {
        this.templateService = templateService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<TemplateResponse>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Template created",
                        templateService.create(principal.getId(), request)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TemplateResponse>>> list(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success(templateService.listByUser(principal.getId())));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(templateService.getById(id, principal.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<TemplateResponse>> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody TemplateRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Template updated",
                templateService.update(id, principal.getId(), request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        templateService.delete(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Template deleted", null));
    }
}
