package com.mediscan.controller;

import com.mediscan.dto.AppointmentRequest;
import com.mediscan.dto.RescheduleRequest;
import com.mediscan.entity.Appointment;
import com.mediscan.entity.User;
import com.mediscan.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.createAppointment(request, user));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAppointments(@AuthenticationPrincipal User user) {
        if (user.getRole().name().equals("DOCTOR")) {
            return ResponseEntity.ok(appointmentService.getDoctorAppointments(user));
        }
        return ResponseEntity.ok(appointmentService.getPatientAppointments(user));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelAppointment(@PathVariable Long id) {
        appointmentService.cancelAppointment(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<Appointment> rescheduleAppointment(
            @PathVariable Long id,
            @Valid @RequestBody RescheduleRequest request) {
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(id, request.getNewAppointmentDate()));
    }
}
