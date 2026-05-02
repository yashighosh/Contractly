package com.contractly.client.controller;

import com.contractly.client.dto.ClientMetricsResponse;
import com.contractly.client.dto.ClientRequest;
import com.contractly.client.dto.ClientResponse;
import com.contractly.client.service.ClientService;
import com.contractly.common.dto.ApiResponse;
import com.contractly.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/clients")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClientResponse>> create(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.create(principal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Client created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ClientResponse>>> list(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<ClientResponse> clients = clientService.listByUser(principal.getId());
        return ResponseEntity.ok(ApiResponse.success(clients));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> getById(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ClientResponse response = clientService.getById(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClientResponse>> update(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id,
            @Valid @RequestBody ClientRequest request) {
        ClientResponse response = clientService.update(id, principal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Client updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        clientService.delete(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Client deleted successfully", null));
    }

    @GetMapping("/{id}/metrics")
    public ResponseEntity<ApiResponse<ClientMetricsResponse>> getMetrics(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        ClientMetricsResponse response = clientService.getMetrics(id, principal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
