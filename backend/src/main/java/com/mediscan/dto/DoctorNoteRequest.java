package com.mediscan.dto;

import jakarta.validation.constraints.*;
import lombok.*;
import java.util.List;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class DoctorNoteRequest {
    @NotNull(message = "Report ID is required")
    private Long reportId;

    @NotBlank(message = "Diagnosis is required")
    private String diagnosis;

    private String notes;

    private List<PrescriptionDto> prescriptions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PrescriptionDto {
        private String drugName;
        private String dosage;
        private String frequency;
        private Integer durationDays;
    }
}
