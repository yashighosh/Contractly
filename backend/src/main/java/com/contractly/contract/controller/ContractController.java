package com.contractly.contract.controller;

import com.contractly.common.dto.ApiResponse;
import com.contractly.contract.dto.ContractRequest;
import com.contractly.contract.dto.ContractResponse;
import com.contractly.contract.model.ContractStatus;
import com.contractly.contract.service.ContractService;
import com.contractly.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for contract management.
 */
@RestController
@RequestMapping("/v1/contracts")
public class ContractController {

    private final ContractService contractService;

    public ContractController(ContractService contractService) {
        this.contractService = contractService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ContractResponse>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ContractRequest request) {
        ContractResponse response = contractService.create(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contract created", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ContractResponse>>> list(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam(required = false) ContractStatus status) {
        List<ContractResponse> contracts = contractService.listByUser(principal.getId(), status);
        return ResponseEntity.ok(ApiResponse.success(contracts));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractResponse>> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ContractResponse response = contractService.getById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ContractResponse>> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ContractRequest request) {
        ContractResponse response = contractService.update(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Contract updated", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        contractService.delete(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Contract deleted", null));
    }

    @PostMapping("/{id}/send")
    public ResponseEntity<ApiResponse<ContractResponse>> send(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ContractResponse response = contractService.send(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Contract sent to recipient", response));
    }

    @PostMapping("/{id}/duplicate")
    public ResponseEntity<ApiResponse<ContractResponse>> duplicate(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ContractResponse response = contractService.duplicate(id, principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Contract duplicated", response));
    }

    @GetMapping(value = "/{id}/pdf", produces = "application/pdf")
    public ResponseEntity<byte[]> exportToPdf(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        byte[] pdfBytes = contractService.exportToPdf(id, principal.getId());
        
        return ResponseEntity.ok()
                .header("Content-Disposition", "attachment; filename=\"contract_" + id + ".pdf\"")
                .body(pdfBytes);
    }
}
