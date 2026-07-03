package com.mediscan.controller;

import com.mediscan.dto.DoctorNoteRequest;
import com.mediscan.dto.DoctorLeaveRequest;
import com.mediscan.entity.*;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.*;
import com.mediscan.service.AppointmentService;
import com.mediscan.service.DoctorLeaveService;
import com.mediscan.service.ReminderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final DoctorNoteRepository noteRepository;
    private final MedicalReportRepository reportRepository;
    private final AppointmentService appointmentService;
    private final DoctorLeaveService doctorLeaveService;
    private final ReminderService reminderService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> approvedDoctors = doctorRepository.findByApprovalStatus(Status.APPROVED);
        return ResponseEntity.ok(approvedDoctors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        return ResponseEntity.ok(doctor);
    }

    @GetMapping("/{id}/slots")
    public ResponseEntity<List<java.time.LocalTime>> getAvailableSlots(
            @PathVariable Long id,
            @RequestParam String date) {
        java.time.LocalDate localDate = java.time.LocalDate.parse(date);
        return ResponseEntity.ok(appointmentService.getAvailableSlots(id, localDate));
    }

    @PostMapping("/notes")
    public ResponseEntity<DoctorNote> addNote(
            @Valid @RequestBody DoctorNoteRequest request,
            @AuthenticationPrincipal User user) {
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        MedicalReport report = reportRepository.findById(request.getReportId())
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));

        DoctorNote note = DoctorNote.builder()
                .doctor(doctor)
                .report(report)
                .diagnosis(request.getDiagnosis())
                .notes(request.getNotes())
                .build();

        if (request.getPrescriptions() != null) {
            for (DoctorNoteRequest.PrescriptionDto dto : request.getPrescriptions()) {
                Prescription p = Prescription.builder()
                        .doctorNote(note)
                        .drugName(dto.getDrugName())
                        .dosage(dto.getDosage())
                        .frequency(dto.getFrequency())
                        .durationDays(dto.getDurationDays())
                        .build();
                note.getPrescriptions().add(p);
            }
        }

        DoctorNote savedNote = noteRepository.save(note);
        
        // Generate reminders for all prescriptions
        for (Prescription p : savedNote.getPrescriptions()) {
            reminderService.generateRemindersForPrescription(p);
        }

        return ResponseEntity.ok(savedNote);
    }

    @PostMapping("/{id}/leaves")
    public ResponseEntity<DoctorLeave> markLeave(
            @PathVariable Long id,
            @Valid @RequestBody DoctorLeaveRequest request) {
        return ResponseEntity.ok(doctorLeaveService.markLeave(id, request));
    }

    @GetMapping("/notes/{reportId}")
    public ResponseEntity<List<DoctorNote>> getNotes(@PathVariable Long reportId) {
        MedicalReport report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
        return ResponseEntity.ok(noteRepository.findByReport(report));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats(@AuthenticationPrincipal User user) {
        Doctor doctor = doctorRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalNotes", noteRepository.findByDoctor(doctor).size());
        return ResponseEntity.ok(stats);
    }
}
