package com.mediscan.controller;

import com.mediscan.dto.ApiResponse;
import com.mediscan.entity.*;
import com.mediscan.service.AdminService;
import com.mediscan.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    // User Management
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getUserById(id));
    }

    @PutMapping("/users/suspend/{id}")
    public ResponseEntity<ApiResponse> suspendUser(@PathVariable Long id) {
        adminService.suspendUser(id);
        return ResponseEntity.ok(ApiResponse.success("User suspended"));
    }

    @PutMapping("/users/block/{id}")
    public ResponseEntity<ApiResponse> blockUser(@PathVariable Long id) {
        adminService.blockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User blocked"));
    }

    @PutMapping("/users/activate/{id}")
    public ResponseEntity<ApiResponse> activateUser(@PathVariable Long id) {
        adminService.activateUser(id);
        return ResponseEntity.ok(ApiResponse.success("User activated"));
    }

    @DeleteMapping("/users/delete/{id}")
    public ResponseEntity<ApiResponse> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.success("User deleted"));
    }

    // Doctor Management
    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> getDoctors() {
        return ResponseEntity.ok(adminService.getAllDoctors());
    }

    @GetMapping("/doctors/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.getDoctorById(id));
    }

    @PutMapping("/doctors/approve/{id}")
    public ResponseEntity<ApiResponse> approveDoctor(@PathVariable Long id) {
        adminService.approveDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor approved"));
    }

    @PutMapping("/doctors/reject/{id}")
    public ResponseEntity<ApiResponse> rejectDoctor(@PathVariable Long id) {
        adminService.rejectDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor rejected"));
    }

    @PutMapping("/doctors/suspend/{id}")
    public ResponseEntity<ApiResponse> suspendDoctor(@PathVariable Long id) {
        adminService.suspendDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor suspended"));
    }

    @PutMapping("/doctors/block/{id}")
    public ResponseEntity<ApiResponse> blockDoctor(@PathVariable Long id) {
        adminService.blockDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor blocked"));
    }

    @DeleteMapping("/doctors/delete/{id}")
    public ResponseEntity<ApiResponse> deleteDoctor(@PathVariable Long id) {
        adminService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("Doctor deleted"));
    }

    // Reports
    @GetMapping("/reports")
    public ResponseEntity<List<MedicalReport>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    // Analytics
    @GetMapping("/analytics")
    public ResponseEntity<Map<String, Object>> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    // System Health
    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealth() {
        return ResponseEntity.ok(adminService.getSystemHealth());
    }
}
