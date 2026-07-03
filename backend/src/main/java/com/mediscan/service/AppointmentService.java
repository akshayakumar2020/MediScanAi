package com.mediscan.service;

import com.mediscan.dto.AppointmentRequest;
import com.mediscan.entity.*;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.exception.BadRequestException;
import com.mediscan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final DoctorLeaveRepository doctorLeaveRepository;
    private final GoogleCalendarService calendarService;

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Appointment createAppointment(AppointmentRequest request, User user) {
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        LocalDateTime apptDate = java.time.OffsetDateTime.parse(request.getAppointmentDate()).toLocalDateTime();

        // Concurrency Check for double booking
        if (appointmentRepository.existsByDoctorAndAppointmentDateAndStatusNotIgnoreCase(doctor, apptDate, "CANCELLED")) {
            throw new BadRequestException("This slot has already been taken. Please choose another time.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(apptDate)
                .status("SCHEDULED")
                .reason(request.getReason())
                .build();

        Appointment savedAppointment = appointmentRepository.save(appointment);

        // Try to add to Google Calendar
        String eventId = calendarService.addEvent(savedAppointment);
        if (eventId != null) {
            savedAppointment.setGoogleEventId(eventId);
            appointmentRepository.save(savedAppointment);
        }

        return savedAppointment;
    }

    public List<Appointment> getPatientAppointments(User user) {
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
        return appointmentRepository.findByPatientOrderByAppointmentDateDesc(patient);
    }

    public List<Appointment> getDoctorAppointments(User user) {
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return appointmentRepository.findByDoctorOrderByAppointmentDateDesc(doctor);
    }

    public void cancelAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        appointment.setStatus("CANCELLED");
        
        // Remove from Google Calendar
        if (appointment.getGoogleEventId() != null) {
            calendarService.deleteEvent(appointment.getDoctor().getUser(), appointment.getGoogleEventId());
        }

        appointmentRepository.save(appointment);
    }

    @Transactional(isolation = Isolation.SERIALIZABLE)
    public Appointment rescheduleAppointment(Long id, String newDate) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
        
        if ("CANCELLED".equalsIgnoreCase(appointment.getStatus()) || "COMPLETED".equalsIgnoreCase(appointment.getStatus())) {
            throw new IllegalArgumentException("Cannot reschedule a cancelled or completed appointment");
        }

        LocalDateTime apptDate = java.time.OffsetDateTime.parse(newDate).toLocalDateTime();

        // Concurrency Check
        if (appointmentRepository.existsByDoctorAndAppointmentDateAndStatusNotIgnoreCase(appointment.getDoctor(), apptDate, "CANCELLED")) {
            throw new BadRequestException("This slot has already been taken. Please choose another time.");
        }

        appointment.setAppointmentDate(apptDate);
        appointment.setStatus("SCHEDULED"); // ensure status is active
        
        // Reschedule in Google Calendar (delete old, create new)
        if (appointment.getGoogleEventId() != null) {
            calendarService.deleteEvent(appointment.getDoctor().getUser(), appointment.getGoogleEventId());
        }
        
        Appointment savedAppointment = appointmentRepository.save(appointment);
        
        String eventId = calendarService.addEvent(savedAppointment);
        if (eventId != null) {
            savedAppointment.setGoogleEventId(eventId);
            appointmentRepository.save(savedAppointment);
        }

        return savedAppointment;
    }

    public List<LocalTime> getAvailableSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        // Check if doctor is on leave
        List<DoctorLeave> leaves = doctorLeaveRepository.findByDoctorAndLeaveDate(doctor, date);
        if (!leaves.isEmpty()) {
            return Collections.emptyList(); // No slots if on leave
        }

        LocalTime start = doctor.getWorkingHoursStart();
        LocalTime end = doctor.getWorkingHoursEnd();
        int duration = doctor.getSlotDurationMinutes();

        List<LocalTime> allSlots = new ArrayList<>();
        while (start.plusMinutes(duration).isBefore(end) || start.plusMinutes(duration).equals(end)) {
            allSlots.add(start);
            start = start.plusMinutes(duration);
        }

        // Get booked appointments
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorAndAppointmentDateBetweenAndStatusNotIgnoreCase(
            doctor, startOfDay, endOfDay, "CANCELLED"
        );

        // Remove booked slots
        for (Appointment appt : bookedAppointments) {
            LocalTime bookedTime = appt.getAppointmentDate().toLocalTime();
            allSlots.remove(bookedTime);
        }

        return allSlots;
    }
}
