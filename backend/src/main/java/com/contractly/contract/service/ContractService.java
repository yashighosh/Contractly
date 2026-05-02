package com.contractly.contract.service;

import com.contractly.audit.service.AuditService;
import com.contractly.contract.dto.ContractRequest;
import com.contractly.contract.dto.ContractResponse;
import com.contractly.contract.model.Contract;
import com.contractly.contract.model.ContractStatus;
import com.contractly.contract.repository.ContractRepository;
import com.contractly.common.exception.BadRequestException;
import com.contractly.common.exception.ResourceNotFoundException;
import com.contractly.common.exception.UnauthorizedException;
import com.contractly.notification.service.NotificationService;
import com.contractly.pdf.service.PdfGeneratorService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Core contract business logic — CRUD, sending, status transitions.
 */
@Service
public class ContractService {

    private final ContractRepository contractRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;
    private final PdfGeneratorService pdfGeneratorService;
    private final ObjectMapper objectMapper;
    private final com.contractly.clause.repository.ClauseRepository clauseRepository;
    private final com.contractly.client.repository.ClientRepository clientRepository;

    @Value("${app.sign-link-base-url}")
    private String signLinkBaseUrl;

    public ContractService(ContractRepository contractRepository,
                           AuditService auditService,
                           NotificationService notificationService,
                           PdfGeneratorService pdfGeneratorService,
                           ObjectMapper objectMapper,
                           com.contractly.clause.repository.ClauseRepository clauseRepository,
                           com.contractly.client.repository.ClientRepository clientRepository) {
        this.contractRepository = contractRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
        this.pdfGeneratorService = pdfGeneratorService;
        this.objectMapper = objectMapper;
        this.clauseRepository = clauseRepository;
        this.clientRepository = clientRepository;
    }

    /**
     * Create a new contract in DRAFT status.
     */
    public ContractResponse create(Long userId, ContractRequest request) {
        if (request.getClientId() != null) {
            clientRepository.findByIdAndUserId(request.getClientId(), userId)
                    .orElseThrow(() -> new BadRequestException("Invalid client ID or client does not belong to you"));
        }

        Contract contract = Contract.builder()
                .userId(userId)
                .clientId(request.getClientId())
                .templateId(request.getTemplateId())
                .title(request.getTitle())
                .content(request.getContent())
                .variablesData(request.getVariablesData())
                .status(ContractStatus.DRAFT)
                .recipientName(request.getRecipientName())
                .recipientEmail(request.getRecipientEmail())
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "INR")
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .recurring(request.isRecurring())
                .renewalPeriodDays(request.getRenewalPeriodDays())
                .autoRenew(request.isAutoRenew())
                .build();

        contract = contractRepository.save(contract);
        auditService.log(contract.getId(), userId, "CREATED", null);

        return toResponse(contract);
    }

    /**
     * Get a single contract (must belong to user).
     */
    public ContractResponse getById(Long id, Long userId) {
        Contract contract = findAndAuthorize(id, userId);
        return toResponse(contract);
    }

    /**
     * List contracts for the authenticated user.
     */
    public List<ContractResponse> listByUser(Long userId, ContractStatus status) {
        return contractRepository.findByUserId(userId, status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    /**
     * Update contract fields (only DRAFT contracts can be edited).
     */
    public ContractResponse update(Long id, Long userId, ContractRequest request) {
        Contract contract = findAndAuthorize(id, userId);

        if (contract.getStatus() != ContractStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT contracts can be edited");
        }

        if (request.getClientId() != null) {
            clientRepository.findByIdAndUserId(request.getClientId(), userId)
                    .orElseThrow(() -> new BadRequestException("Invalid client ID or client does not belong to you"));
        }

        contract.setClientId(request.getClientId());
        contract.setTitle(request.getTitle());
        contract.setContent(request.getContent());
        contract.setVariablesData(request.getVariablesData());
        contract.setRecipientName(request.getRecipientName());
        contract.setRecipientEmail(request.getRecipientEmail());
        contract.setAmount(request.getAmount());
        contract.setCurrency(request.getCurrency());
        contract.setStartDate(request.getStartDate());
        contract.setEndDate(request.getEndDate());
        contract.setRecurring(request.isRecurring());
        contract.setRenewalPeriodDays(request.getRenewalPeriodDays());
        contract.setAutoRenew(request.isAutoRenew());

        contractRepository.update(contract);
        auditService.log(id, userId, "UPDATED", null);

        return toResponse(contract);
    }

    /**
     * Send contract to recipient — generates sign link and transitions to SENT.
     */
    public ContractResponse send(Long id, Long userId) {
        Contract contract = findAndAuthorize(id, userId);

        if (contract.getRecipientEmail() == null || contract.getRecipientEmail().isBlank()) {
            throw new BadRequestException("Recipient email is required before sending");
        }

        if (contract.getStatus() != ContractStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT contracts can be sent");
        }

        // Generate unique sign token
        String signToken = UUID.randomUUID().toString();
        LocalDateTime expiry = LocalDateTime.now().plusDays(30);

        contractRepository.setSignToken(id, signToken, expiry);
        contractRepository.updateStatus(id, ContractStatus.SENT, "sent_at");

        auditService.log(id, userId, "SENT", null);

        // Send email notification to recipient
        String signLink = signLinkBaseUrl + "/" + signToken;
        notificationService.sendContractSentEmail(
                contract.getRecipientEmail(),
                contract.getRecipientName(),
                contract.getTitle(),
                signLink
        );

        contract.setStatus(ContractStatus.SENT);
        contract.setSignToken(signToken);
        return toResponse(contract);
    }

    /**
     * Delete a contract (only DRAFT contracts).
     */
    public void delete(Long id, Long userId) {
        Contract contract = findAndAuthorize(id, userId);

        if (contract.getStatus() != ContractStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT contracts can be deleted");
        }

        contractRepository.deleteByIdAndUserId(id, userId);
        auditService.log(id, userId, "DELETED", null);
    }

    /**
     * Duplicate a contract as a new DRAFT.
     */
    public ContractResponse duplicate(Long id, Long userId) {
        Contract original = findAndAuthorize(id, userId);

        Contract copy = Contract.builder()
                .userId(userId)
                .templateId(original.getTemplateId())
                .title(original.getTitle() + " (Copy)")
                .content(original.getContent())
                .variablesData(original.getVariablesData())
                .status(ContractStatus.DRAFT)
                .recipientName(original.getRecipientName())
                .recipientEmail(original.getRecipientEmail())
                .amount(original.getAmount())
                .currency(original.getCurrency())
                .startDate(original.getStartDate())
                .endDate(original.getEndDate())
                .recurring(original.isRecurring())
                .renewalPeriodDays(original.getRenewalPeriodDays())
                .autoRenew(original.isAutoRenew())
                .build();

        copy = contractRepository.save(copy);
        auditService.log(copy.getId(), userId, "DUPLICATED", null);

        return toResponse(copy);
    }

    /**
     * Export contract as PDF. Generates it dynamically with variable replacement.
     */
    public byte[] exportToPdf(Long id, Long userId) {
        Contract contract = findAndAuthorize(id, userId);
        
        String parsedContent = contract.getContent();
        
        // Process variables replacements (e.g. {{CompanyName}})
        if (contract.getVariablesData() != null && !contract.getVariablesData().isBlank()) {
            try {
                Map<String, String> variables = objectMapper.readValue(
                        contract.getVariablesData(),
                        new TypeReference<Map<String, String>>() {}
                );
                
                for (Map.Entry<String, String> entry : variables.entrySet()) {
                    parsedContent = parsedContent.replace("{{" + entry.getKey() + "}}", entry.getValue());
                }
            } catch (Exception e) {
                // Ignore parse errors, just use raw content
            }
        }

        // We don't have a signer signature yet since it's just exported
        String signerName = contract.getStatus() == ContractStatus.SIGNED ? contract.getRecipientName() : null;

        auditService.log(id, userId, "EXPORTED_PDF", null);

        return pdfGeneratorService.generateContractPdf(
                contract.getTitle(),
                parsedContent,
                contract.getRecipientName(),
                signerName,
                null,
                null,
                null
        );
    }

    /**
     * Attach a clause to a contract draft and append its content.
     */
    public ContractResponse attachClause(Long id, Long userId, Long clauseId) {
        Contract contract = findAndAuthorize(id, userId);

        if (contract.getStatus() != ContractStatus.DRAFT) {
            throw new BadRequestException("Only DRAFT contracts can be edited");
        }

        if (clauseRepository.isClauseAttached(id, clauseId)) {
            throw new BadRequestException("This clause is already attached to the contract");
        }

        com.contractly.clause.model.Clause clause = clauseRepository.findById(clauseId)
                .orElseThrow(() -> new ResourceNotFoundException("Clause", clauseId));

        // Safe Insertion
        String clauseHtml = String.format("<hr><div class=\"clause-block\"><h4>%s</h4>%s</div>",
                clause.getTitle(), clause.getContent());
        
        String newContent = contract.getContent() == null ? clauseHtml : contract.getContent() + clauseHtml;
        contract.setContent(newContent);
        
        contractRepository.update(contract);
        
        // Use current number of clauses as sort order (simplified)
        int sortOrder = clauseRepository.findByContractId(id).size();
        clauseRepository.attachClauseToContract(id, clauseId, sortOrder);

        auditService.log(id, userId, "CLAUSE_ATTACHED", "{\"clauseId\": " + clauseId + "}");

        return toResponse(contract);
    }

    /**
     * Get all clauses attached to a contract.
     */
    public List<com.contractly.clause.dto.ClauseResponse> getClauses(Long id, Long userId) {
        findAndAuthorize(id, userId);
        return clauseRepository.findByContractId(id).stream()
                .map(c -> com.contractly.clause.dto.ClauseResponse.builder()
                        .id(c.getId())
                        .title(c.getTitle())
                        .category(c.getCategory())
                        .content(c.getContent())
                        .createdAt(c.getCreatedAt())
                        .updatedAt(c.getUpdatedAt())
                        .build())
                .toList();
    }

    // ── Helpers ──

    private Contract findAndAuthorize(Long id, Long userId) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contract", id));

        if (!contract.getUserId().equals(userId)) {
            throw new UnauthorizedException("You don't have access to this contract");
        }

        return contract;
    }

    private ContractResponse toResponse(Contract c) {
        String signLink = c.getSignToken() != null ? signLinkBaseUrl + "/" + c.getSignToken() : null;

        return ContractResponse.builder()
                .id(c.getId())
                .clientId(c.getClientId())
                .title(c.getTitle())
                .content(c.getContent())
                .variablesData(c.getVariablesData())
                .status(c.getStatus())
                .recipientName(c.getRecipientName())
                .recipientEmail(c.getRecipientEmail())
                .amount(c.getAmount())
                .currency(c.getCurrency())
                .startDate(c.getStartDate())
                .endDate(c.getEndDate())
                .recurring(c.isRecurring())
                .renewalPeriodDays(c.getRenewalPeriodDays())
                .autoRenew(c.isAutoRenew())
                .signLink(signLink)
                .signedPdfKey(c.getSignedPdfKey())
                .sentAt(c.getSentAt())
                .viewedAt(c.getViewedAt())
                .signedAt(c.getSignedAt())
                .expiredAt(c.getExpiredAt())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
