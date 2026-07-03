package com.mediscan.service;

import com.mediscan.entity.MedicationReminder;
import com.mediscan.repository.MedicationReminderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ReminderScheduler {

    private final MedicationReminderRepository reminderRepository;
    private final EmailService emailService;

    // Run every 15 minutes
    @Scheduled(fixedRate = 900000)
    public void processDueReminders() {
        log.info("Processing due medication reminders...");
        
        List<MedicationReminder> dueReminders = reminderRepository.findByStatusAndReminderTimeBefore("PENDING", LocalDateTime.now());
        
        for (MedicationReminder reminder : dueReminders) {
            try {
                String patientEmail = reminder.getPrescription().getDoctorNote().getReport().getPatient().getUser().getEmail();
                String patientName = reminder.getPrescription().getDoctorNote().getReport().getPatient().getUser().getName();
                
                String subject = "Medication Reminder: " + reminder.getPrescription().getDrugName();
                String body = String.format(
                        "Hi %s,\n\nThis is a reminder to take your medication:\n\nDrug: %s\nDosage: %s\n\nStay healthy!\nMediScan Team",
                        patientName,
                        reminder.getPrescription().getDrugName(),
                        reminder.getPrescription().getDosage()
                );
                
                emailService.queueEmail(patientEmail, subject, body);
                
                reminder.setStatus("SENT");
                reminderRepository.save(reminder);
                log.info("Queued email for reminder {}", reminder.getId());
            } catch (Exception e) {
                log.error("Failed to process reminder {}: {}", reminder.getId(), e.getMessage());
            }
        }
    }
}
