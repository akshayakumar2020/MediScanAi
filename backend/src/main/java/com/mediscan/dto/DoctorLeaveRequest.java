package com.mediscan.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DoctorLeaveRequest {
    @NotBlank(message = "Leave date is required (YYYY-MM-DD)")
    private String leaveDate;
    
    private String reason;
}
