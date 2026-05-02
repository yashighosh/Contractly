package com.contractly.signature.service;

import com.contractly.audit.service.AuditService;
import com.contractly.common.exception.BadRequestException;
import com.contractly.common.exception.ResourceNotFoundException;
import com.contractly.contract.model.Contract;
import com.contractly.contract.model.ContractStatus;
import com.contractly.contract.repository.ContractRepository;
import com.contractly.notification.service.NotificationService;
import com.contractly.signature.dto.SignRequest;
import com.contractly.signature.dto.SignResponse;
import com.contractly.signature.model.SignatureRecord;
import com.contractly.signature.repository.SignatureRepository;
import com.contractly.pdf.service.PdfGeneratorService;
import com.contractly.storage.service.S3StorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Base64;

/**
 * E-signature service — handles viewing and signing contracts via token links.
 */
@Service
public class SignatureService {

    private final ContractRepository contractRepository;
    private final SignatureRepository signatureRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;
    private final PdfGeneratorService pdfGeneratorService;
    private final S3StorageService s3StorageService;

    public SignatureService(ContractRepository contractRepository,
                            SignatureRepository signatureRepository,
                            AuditService auditService,
                            NotificationService notificationService,
                            PdfGeneratorService pdfGeneratorService,
                            S3StorageService s3StorageService) {
        this.contractRepository = contractRepository;
        this.signatureRepository = signatureRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
        this.pdfGeneratorService = pdfGeneratorService;
        this.s3StorageService = s3StorageService;
    }

    /**
     * View contract via sign token. Marks contract as VIEWED if currently SENT.
     */
    public SignResponse viewByToken(String token, HttpServletRequest request) {
        Contract contract = contractRepository.findBySignToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "token", token));

        // Check token expiry
        if (contract.getSignTokenExpiry() != null && contract.getSignTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This sign link has expired");
        }

        // Transition SENT → VIEWED
        if (contract.getStatus() == ContractStatus.SENT) {
            contractRepository.updateStatus(contract.getId(), ContractStatus.VIEWED, "viewed_at");
            auditService.logAnonymous(contract.getId(), "VIEWED",
                    request.getRemoteAddr(), request.getHeader("User-Agent"));

            // Notify contract owner
            notificationService.sendContractViewedEmail(contract);
        }

        boolean alreadySigned = contract.getStatus() == ContractStatus.SIGNED;

        return SignResponse.builder()
                .contractId(contract.getId())
                .contractTitle(contract.getTitle())
                .content(contract.getContent())
                .recipientName(contract.getRecipientName())
                .status(contract.getStatus().name())
                .alreadySigned(alreadySigned)
                .signedAt(contract.getSignedAt())
                .build();
    }

    /**
     * Submit signature for a contract.
     */
    @Transactional
    public SignResponse sign(String token, SignRequest signRequest, HttpServletRequest httpRequest) {
        Contract contract = contractRepository.findBySignToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", "token", token));

        if (contract.getStatus() == ContractStatus.SIGNED) {
            throw new BadRequestException("This contract has already been signed");
        }

        if (contract.getStatus() == ContractStatus.EXPIRED) {
            throw new BadRequestException("This contract has expired");
        }

        if (contract.getSignTokenExpiry() != null && contract.getSignTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("This sign link has expired");
        }

        LocalDateTime signedTimestamp = LocalDateTime.now();
        String ipAddress = httpRequest.getRemoteAddr();
        
        // Generate Deterministic SHA-256 Hash
        String payloadToHash = contract.getContent() + signRequest.getSignerEmail() + signedTimestamp.toString() + ipAddress;
        String documentHash = generateHash(payloadToHash);

        // Save signature record
        SignatureRecord record = SignatureRecord.builder()
                .contractId(contract.getId())
                .signerName(signRequest.getSignerName())
                .signerEmail(signRequest.getSignerEmail())
                .signatureData(signRequest.getSignatureData())
                .ipAddress(ipAddress)
                .userAgent(httpRequest.getHeader("User-Agent"))
                .documentHash(documentHash)
                .signedAt(signedTimestamp)
                .build();

        signatureRepository.save(record);

        // Transition to SIGNED
        contractRepository.updateStatus(contract.getId(), ContractStatus.SIGNED, "signed_at");

        // Invalidate token immediately to prevent link reuse
        contractRepository.setSignToken(contract.getId(), null, null);

        // Generate PDF
        byte[] pdfBytes = pdfGeneratorService.generateContractPdf(
                contract.getTitle(),
                contract.getContent(),
                contract.getRecipientName(),
                signRequest.getSignerName(),
                documentHash,
                ipAddress,
                signedTimestamp
        );

        // Upload to S3
        String s3Key = s3StorageService.upload(pdfBytes, "contracts/signed", "contract_" + contract.getId() + ".pdf", "application/pdf");
        
        // Save PDF Key
        contractRepository.setSignedPdfKey(contract.getId(), s3Key);

        // Audit log
        auditService.logAnonymous(contract.getId(), "SIGNED",
                ipAddress, httpRequest.getHeader("User-Agent"));

        // Notify both parties
        notificationService.sendContractSignedEmail(contract);

        return SignResponse.builder()
                .contractId(contract.getId())
                .contractTitle(contract.getTitle())
                .status(ContractStatus.SIGNED.name())
                .alreadySigned(true)
                .signedAt(signedTimestamp)
                .build();
    }

    private String generateHash(String payload) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedhash = digest.digest(payload.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(encodedhash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error generating hash", e);
        }
    }
}
