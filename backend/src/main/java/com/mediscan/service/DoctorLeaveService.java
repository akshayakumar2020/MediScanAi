package com.mediscan.service;

import com.mediscan.dto.DoctorLeaveRequest;
import com.mediscan.entity.Appointment;
import com.mediscan.entity.Doctor;
import com.mediscan.entity.DoctorLeave;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.AppointmentRepository;
import com.mediscan.repository.DoctorLeaveRepository;
import com.mediscan.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorLeaveService {

    private final DoctorRepository doctorRepository;
    private final DoctorLeaveRepository doctorLeaveRepository;
    private final AppointmentRepository appointmentRepository;
    private final EmailService emailService;

    @Transactional
    public DoctorLeave markLeave(Long doctorId, DoctorLeaveRequest request) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDate leaveDate = LocalDate.parse(request.getLeaveDate());

        DoctorLeave leave = DoctorLeave.builder()
                .doctor(doctor)
                .leaveDate(leaveDate)
                .reason(request.getReason())
                .build();
        doctorLeaveRepository.save(leave);

        // Find all SCHEDULED appointments on that day
        LocalDateTime startOfDay = leaveDate.atStartOfDay();
        LocalDateTime endOfDay = leaveDate.atTime(LocalTime.MAX);
        List<Appointment> affectedAppointments = appointmentRepository.findByDoctorAndAppointmentDateBetweenAndStatusIgnoreCase(
                doctor, startOfDay, endOfDay, "SCHEDULED"
        );

        // Cancel them and notify patients
        for (Appointment appt : affectedAppointments) {
            appt.setStatus("CANCELLED");
            appointmentRepository.save(appt);

            String patientEmail = appt.getPatient().getUser().getEmail();
            String subject = "Appointment Cancelled - Doctor on Leave";
            String body = String.format(
                    "Dear %s,\n\nUnfortunately, your appointment on %s has been cancelled because Dr. %s is on leave that day.\n\nPlease log in to your dashboard to reschedule your appointment.\n\nBest regards,\nMediScan Team",
                    appt.getPatient().getUser().getName(),
                    appt.getAppointmentDate().toString(),
                    doctor.getUser().getName()
            );

            emailService.queueEmail(patientEmail, subject, body);
            log.info("Cancelled appointment {} and queued email to {}", appt.getId(), patientEmail);
        }

        return leave;
    }
}
