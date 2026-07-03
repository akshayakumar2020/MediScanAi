package com.mediscan.service;

import com.mediscan.entity.NotificationLog;
import com.mediscan.repository.NotificationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final NotificationLogRepository notificationLogRepository;

    public void queueEmail(String to, String subject, String body) {
        NotificationLog logEntry = NotificationLog.builder()
                .recipientEmail(to)
                .subject(subject)
                .body(body)
                .status("PENDING")
                .attempts(0)
                .build();
        notificationLogRepository.save(logEntry);
        log.info("Queued email for {}", to);
    }

    public void sendEmailNow(NotificationLog logEntry) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(logEntry.getRecipientEmail());
            message.setSubject(logEntry.getSubject());
            message.setText(logEntry.getBody());
            // Need a valid from address in properties, or set explicitly
            // message.setFrom("noreply@mediscan.com");

            mailSender.send(message);

            logEntry.setStatus("SENT");
            logEntry.setLastError(null);
            log.info("Successfully sent email to {}", logEntry.getRecipientEmail());
        } catch (Exception e) {
            logEntry.setStatus("FAILED");
            logEntry.setLastError(e.getMessage());
            log.error("Failed to send email to {}: {}", logEntry.getRecipientEmail(), e.getMessage());
        } finally {
            logEntry.setAttempts(logEntry.getAttempts() + 1);
            notificationLogRepository.save(logEntry);
        }
    }
}
