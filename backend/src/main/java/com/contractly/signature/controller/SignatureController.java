package com.contractly.signature.controller;

import com.contractly.common.dto.ApiResponse;
import com.contractly.signature.dto.SignRequest;
import com.contractly.signature.dto.SignResponse;
import com.contractly.signature.service.SignatureService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Public endpoints for viewing and signing contracts via token links.
 * No authentication required — uses one-time sign tokens.
 */
@RestController
@RequestMapping("/v1/sign")
public class SignatureController {

    private final SignatureService signatureService;

    public SignatureController(SignatureService signatureService) {
        this.signatureService = signatureService;
    }

    @GetMapping("/{token}")
    public ResponseEntity<ApiResponse<SignResponse>> viewContract(
            @PathVariable String token,
            HttpServletRequest request) {
        SignResponse response = signatureService.viewByToken(token, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/{token}")
    public ResponseEntity<ApiResponse<SignResponse>> signContract(
            @PathVariable String token,
            @Valid @RequestBody SignRequest signRequest,
            HttpServletRequest request) {
        SignResponse response = signatureService.sign(token, signRequest, request);
        return ResponseEntity.ok(ApiResponse.success("Contract signed successfully", response));
    }
}
