package com.contractly.notification.service;

import com.contractly.contract.model.Contract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

/**
 * Notification service — sends email notifications for contract lifecycle events.
 * Emails are sent asynchronously to avoid blocking the request thread.
 */
@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Email sent to recipient when a contract is shared for signing.
     */
    @Async
    public void sendContractSentEmail(String recipientEmail, String recipientName,
                                       String contractTitle, String signLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(recipientEmail);
            message.setSubject("You've received a contract to sign: " + contractTitle);
            message.setText(String.format("""
                    Hi %s,
                    
                    You've received a contract "%s" to review and sign.
                    
                    Click the link below to view and sign:
                    %s
                    
                    This link will expire in 30 days.
                    
                    — Contractly
                    """, recipientName != null ? recipientName : "there", contractTitle, signLink));

            mailSender.send(message);
            log.info("Contract sent email delivered to {}", recipientEmail);
        } catch (Exception e) {
            log.error("Failed to send contract email to {}: {}", recipientEmail, e.getMessage());
        }
    }

    /**
     * Email sent to contract owner when recipient views the contract.
     */
    @Async
    public void sendContractViewedEmail(Contract contract) {
        try {
            // We would need to look up the owner's email from user_id.
            // For now, log the event. Full implementation requires UserRepository dependency.
            log.info("Contract '{}' (id={}) was viewed by recipient", contract.getTitle(), contract.getId());
        } catch (Exception e) {
            log.error("Failed to send viewed notification: {}", e.getMessage());
        }
    }

    /**
     * Email sent to both parties when contract is signed.
     */
    @Async
    public void sendContractSignedEmail(Contract contract) {
        try {
            log.info("Contract '{}' (id={}) was signed", contract.getTitle(), contract.getId());
            // Send to recipient
            if (contract.getRecipientEmail() != null) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(contract.getRecipientEmail());
                message.setSubject("Contract signed: " + contract.getTitle());
                message.setText(String.format("""
                        Hi %s,
                        
                        The contract "%s" has been successfully signed.
                        
                        A copy of the signed document will be available in your Contractly account.
                        
                        — Contractly
                        """, contract.getRecipientName() != null ? contract.getRecipientName() : "there",
                        contract.getTitle()));

                mailSender.send(message);
            }
        } catch (Exception e) {
            log.error("Failed to send signed notification: {}", e.getMessage());
        }
    }

    /**
     * Email sent when a contract is about to expire.
     */
    @Async
    public void sendExpiringAlert(Contract contract, String ownerEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ownerEmail);
            message.setSubject("Contract expiring soon: " + contract.getTitle());
            message.setText(String.format("""
                    Your contract "%s" with %s is expiring on %s.
                    
                    Log in to Contractly to renew or manage this contract:
                    %s/dashboard
                    
                    — Contractly
                    """, contract.getTitle(),
                    contract.getRecipientName() != null ? contract.getRecipientName() : "recipient",
                    contract.getEndDate(),
                    frontendUrl));

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send expiring alert: {}", e.getMessage());
        }
    }

    /**
     * Email sent when a contract is auto-renewed.
     */
    @Async
    public void sendAutoRenewalNotification(Contract originalContract, Contract newContract, String ownerEmail) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(ownerEmail);
            message.setSubject("Contract auto-renewed: " + originalContract.getTitle());
            message.setText(String.format("""
                    Your contract "%s" has been automatically renewed.
                    
                    A new contract has been created and sent to %s for signing.
                    
                    Log in to Contractly to manage:
                    %s/dashboard
                    
                    — Contractly
                    """, originalContract.getTitle(),
                    originalContract.getRecipientEmail(),
                    frontendUrl));

            mailSender.send(message);
        } catch (Exception e) {
            log.error("Failed to send auto-renewal notification: {}", e.getMessage());
        }
    }
}
