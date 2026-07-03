package com.mediscan.service;

import com.mediscan.entity.NotificationLog;
import com.mediscan.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class EmailScheduler {

    private final EmailService emailService;
    private final NotificationLogRepository notificationLogRepository;

    // Run every 2 minutes
    @Scheduled(fixedRate = 120000)
    public void processEmailQueue() {
        log.info("Processing email queue...");
        
        List<NotificationLog> pendingEmails = notificationLogRepository.findByStatus("PENDING");
        for (NotificationLog email : pendingEmails) {
            emailService.sendEmailNow(email);
        }

        // Retry failed emails up to 3 times
        List<NotificationLog> failedEmails = notificationLogRepository.findByStatus("FAILED");
        for (NotificationLog email : failedEmails) {
            if (email.getAttempts() < 3) {
                log.info("Retrying failed email for {}", email.getRecipientEmail());
                emailService.sendEmailNow(email);
            }
        }
    }
}
