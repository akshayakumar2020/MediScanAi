package com.mediscan.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private String role;
    private String email;
    private String name;
    private String status;
    private Long id;
}
