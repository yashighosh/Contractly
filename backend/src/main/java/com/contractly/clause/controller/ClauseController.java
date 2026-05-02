package com.contractly.clause.controller;

import com.contractly.clause.dto.ClauseRequest;
import com.contractly.clause.dto.ClauseResponse;
import com.contractly.clause.service.ClauseService;
import com.contractly.common.dto.ApiResponse;
import com.contractly.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/clauses")
public class ClauseController {

    private final ClauseService clauseService;

    public ClauseController(ClauseService clauseService) {
        this.clauseService = clauseService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClauseResponse>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ClauseRequest request) {
        ClauseResponse response = clauseService.create(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Clause created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClauseResponse>>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) String category) {
        return ResponseEntity.ok(ApiResponse.success(clauseService.listByUser(principal.getId(), category)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClauseResponse>> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(clauseService.getById(id, principal.getId())));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClauseResponse>> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ClauseRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Clause updated",
                clauseService.update(id, principal.getId(), request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        clauseService.delete(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Clause deleted", null));
    }
}
