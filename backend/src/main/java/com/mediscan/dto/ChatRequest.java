package com.mediscan.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ChatRequest {
    @NotBlank(message = "Message is required")
    private String message;
}
