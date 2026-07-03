package com.mediscan.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PreVisitSummaryResponse {
    private String urgency;
    private String chiefComplaint;
    private List<String> questions;
}
