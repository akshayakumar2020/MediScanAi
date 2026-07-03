package com.mediscan.service;

import com.mediscan.entity.MedicationReminder;
import com.mediscan.entity.Prescription;
import com.mediscan.repository.MedicationReminderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final MedicationReminderRepository reminderRepository;

    @Transactional
    public void generateRemindersForPrescription(Prescription prescription) {
        if (prescription.getFrequency() == null || prescription.getDurationDays() == null) {
            return;
        }

        int timesPerDay = parseFrequency(prescription.getFrequency());
        if (timesPerDay == 0) return;

        LocalDateTime current = LocalDateTime.now().plusHours(1); // Start 1 hour from now or tomorrow morning
        // Simplified scheduling for demo: just space them evenly throughout waking hours (e.g., 9am to 9pm)
        // We'll generate the exact timestamps here.

        for (int day = 0; day < prescription.getDurationDays(); day++) {
            for (int time = 0; time < timesPerDay; time++) {
                LocalDateTime reminderTime = LocalDateTime.now().plusDays(day).withHour(9 + (time * 4)).withMinute(0);
                if (reminderTime.isBefore(LocalDateTime.now())) {
                    reminderTime = reminderTime.plusDays(1);
                }

                MedicationReminder reminder = MedicationReminder.builder()
                        .prescription(prescription)
                        .reminderTime(reminderTime)
                        .status("PENDING")
                        .build();
                reminderRepository.save(reminder);
            }
        }
        log.info("Generated reminders for prescription: {}", prescription.getDrugName());
    }

    private int parseFrequency(String frequency) {
        String f = frequency.toLowerCase();
        if (f.contains("twice") || f.contains("2") || f.contains("bid")) return 2;
        if (f.contains("thrice") || f.contains("3") || f.contains("tid")) return 3;
        if (f.contains("four") || f.contains("4") || f.contains("qid")) return 4;
        if (f.contains("once") || f.contains("1") || f.contains("daily")) return 1;
        return 0; // cannot parse
    }
}
