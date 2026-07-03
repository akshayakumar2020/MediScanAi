package com.mediscan.service;

import com.mediscan.entity.*;
import com.mediscan.exception.BadRequestException;
import com.mediscan.exception.ResourceNotFoundException;
//import com.mediscan.firebase.FirebaseStorageService;
import com.mediscan.cloudinary.CloudinaryStorageService;
import com.mediscan.ocr.OcrService;
import com.mediscan.ai.AiAnalysisService;
import com.mediscan.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final MedicalReportRepository reportRepository;
    private final PatientRepository patientRepository;
//    private final FirebaseStorageService firebaseStorage;
    private final CloudinaryStorageService cloudinaryStorage;
    private final OcrService ocrService;
    private final AiAnalysisService aiService;

    @Transactional
    public MedicalReport uploadAndAnalyze(MultipartFile file, User user) {
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("application/pdf")
                && !contentType.startsWith("image/"))) {
            throw new BadRequestException("Only PDF and image files are supported");
        }

        // Upload to Firebase Storage
//        String fileUrl = firebaseStorage.uploadFile(file);
        String fileUrl = cloudinaryStorage.uploadFile(file);

        // OCR Text Extraction
        String extractedText = ocrService.extractText(file);

        // AI Analysis
        String aiSummary = aiService.analyzeReport(extractedText);

        // Save report
        MedicalReport report = MedicalReport.builder()
                .fileName(file.getOriginalFilename())
                .fileUrl(fileUrl)
                .extractedText(extractedText)
                .aiSummary(aiSummary)
                .patient(patient)
                .build();

        return reportRepository.save(report);
    }

    public List<MedicalReport> getReportsByUser(User user) {
        Patient patient = patientRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Patient profile not found"));
        return reportRepository.findByPatientOrderByUploadedAtDesc(patient);
    }

    public MedicalReport getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found"));
    }

    public List<MedicalReport> getAllReports() {
        return reportRepository.findAllByOrderByUploadedAtDesc();
    }

    public void deleteReport(Long id) {
        MedicalReport report = getReportById(id);
        reportRepository.delete(report);
    }
}
