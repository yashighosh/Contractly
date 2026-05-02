package com.contractly.scheduler;

import com.contractly.audit.service.AuditService;
import com.contractly.auth.model.User;
import com.contractly.auth.repository.UserRepository;
import com.contractly.contract.model.Contract;
import com.contractly.contract.model.ContractStatus;
import com.contractly.contract.repository.ContractRepository;
import com.contractly.notification.service.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Scheduled tasks for contract lifecycle automation:
 * - Auto-renewal of expiring contracts
 * - Expiration of overdue contracts
 */
@Component
public class ContractRenewalScheduler {

    private static final Logger log = LoggerFactory.getLogger(ContractRenewalScheduler.class);

    private final ContractRepository contractRepository;
    private final UserRepository userRepository;
    private final AuditService auditService;
    private final NotificationService notificationService;

    @Value("${app.sign-link-base-url}")
    private String signLinkBaseUrl;

    public ContractRenewalScheduler(ContractRepository contractRepository,
                                     UserRepository userRepository,
                                     AuditService auditService,
                                     NotificationService notificationService) {
        this.contractRepository = contractRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.notificationService = notificationService;
    }

    /**
     * Process auto-renewals daily at 9:00 AM.
     * Finds signed contracts with auto_renew=true expiring within 30 days.
     */
    @Scheduled(cron = "0 0 9 * * *")
    public void processAutoRenewals() {
        log.info("Starting auto-renewal check...");

        LocalDate threshold = LocalDate.now().plusDays(30);
        List<Contract> renewableContracts = contractRepository.findAutoRenewable(threshold);

        log.info("Found {} contracts eligible for auto-renewal", renewableContracts.size());

        for (Contract contract : renewableContracts) {
            try {
                renewContract(contract);
            } catch (Exception e) {
                log.error("Failed to auto-renew contract id={}: {}", contract.getId(), e.getMessage());
            }
        }
    }

    private void renewContract(Contract original) {
        int renewalDays = original.getRenewalPeriodDays() != null ? original.getRenewalPeriodDays() : 365;

        // Create a new contract as a copy
        Contract renewed = Contract.builder()
                .userId(original.getUserId())
                .templateId(original.getTemplateId())
                .title(original.getTitle() + " (Renewed)")
                .content(original.getContent())
                .variablesData(original.getVariablesData())
                .status(ContractStatus.DRAFT)
                .recipientName(original.getRecipientName())
                .recipientEmail(original.getRecipientEmail())
                .amount(original.getAmount())
                .currency(original.getCurrency())
                .startDate(original.getEndDate())
                .endDate(original.getEndDate().plusDays(renewalDays))
                .recurring(original.isRecurring())
                .renewalPeriodDays(original.getRenewalPeriodDays())
                .autoRenew(original.isAutoRenew())
                .build();

        final Contract savedRenewed = contractRepository.save(renewed);

        // Generate sign token and send
        final String signToken = UUID.randomUUID().toString();
        contractRepository.setSignToken(savedRenewed.getId(), signToken, LocalDateTime.now().plusDays(30));
        contractRepository.updateStatus(savedRenewed.getId(), ContractStatus.SENT, "sent_at");

        // Audit
        auditService.log(savedRenewed.getId(), original.getUserId(), "AUTO_RENEWED", null);

        // Notify owner
        userRepository.findById(original.getUserId()).ifPresent(user -> {
            notificationService.sendAutoRenewalNotification(original, savedRenewed, user.getEmail());

            // Send sign link to recipient
            if (original.getRecipientEmail() != null) {
                String signLink = signLinkBaseUrl + "/" + signToken;
                notificationService.sendContractSentEmail(
                        original.getRecipientEmail(),
                        original.getRecipientName(),
                        savedRenewed.getTitle(),
                        signLink
                );
            }
        });

        log.info("Auto-renewed contract id={} → new contract id={}", original.getId(), savedRenewed.getId());
    }
}
