package com.contractly.signature.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SignRequest {

    @NotBlank(message = "Signer name is required")
    private String signerName;

    @NotBlank(message = "Signer email is required")
    private String signerEmail;

    @NotBlank(message = "Signature data is required")
    private String signatureData;   // base64 encoded signature image from canvas
}
