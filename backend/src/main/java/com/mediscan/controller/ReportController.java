package com.mediscan.controller;

import com.mediscan.entity.MedicalReport;
import com.mediscan.entity.User;
import com.mediscan.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @PostMapping("/upload")
    public ResponseEntity<MedicalReport> uploadReport(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.uploadAndAnalyze(file, user));
    }

    @GetMapping
    public ResponseEntity<List<MedicalReport>> getReports(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(reportService.getReportsByUser(user));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicalReport> getReport(@PathVariable Long id) {
        return ResponseEntity.ok(reportService.getReportById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
