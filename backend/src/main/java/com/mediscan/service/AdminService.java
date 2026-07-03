package com.mediscan.service;

import com.mediscan.entity.*;
import com.mediscan.exception.ResourceNotFoundException;
import com.mediscan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final MedicalReportRepository reportRepository;
    private final AppointmentRepository appointmentRepository;

    // User Management
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Transactional
    public void suspendUser(Long id) {
        User user = getUserById(id);
        user.setStatus(Status.SUSPENDED);
        userRepository.save(user);
    }

    @Transactional
    public void blockUser(Long id) {
        User user = getUserById(id);
        user.setStatus(Status.BLOCKED);
        userRepository.save(user);
    }

    @Transactional
    public void activateUser(Long id) {
        User user = getUserById(id);
        user.setStatus(Status.ACTIVE);
        userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // Doctor Management
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
    }

    @Transactional
    public void approveDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setApprovalStatus(Status.APPROVED);
        doctor.getUser().setStatus(Status.APPROVED);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    @Transactional
    public void rejectDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setApprovalStatus(Status.BLOCKED);
        doctor.getUser().setStatus(Status.BLOCKED);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    @Transactional
    public void suspendDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setApprovalStatus(Status.SUSPENDED);
        doctor.getUser().setStatus(Status.SUSPENDED);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    @Transactional
    public void blockDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        doctor.setApprovalStatus(Status.BLOCKED);
        doctor.getUser().setStatus(Status.BLOCKED);
        doctorRepository.save(doctor);
        userRepository.save(doctor.getUser());
    }

    @Transactional
    public void deleteDoctor(Long id) {
        Doctor doctor = getDoctorById(id);
        userRepository.delete(doctor.getUser());
    }

    // Analytics
    public Map<String, Object> getAnalytics() {
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalUsers", userRepository.count());
        analytics.put("totalDoctors", userRepository.countByRole(Role.DOCTOR));
        analytics.put("totalPatients", userRepository.countByRole(Role.PATIENT));
        analytics.put("totalReports", reportRepository.count());
        analytics.put("totalAppointments", appointmentRepository.count());
        analytics.put("pendingDoctors", doctorRepository.findByApprovalStatus(Status.PENDING).size());
        return analytics;
    }

    // System Health
    public Map<String, Object> getSystemHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("apiStatus", "UP");
        health.put("databaseStatus", "UP");
        health.put("ocrStatus", "UP");
        health.put("firebaseStatus", "UP");
        health.put("aiStatus", "UP");
        health.put("jwtStatus", "UP");
        return health;
    }
}
