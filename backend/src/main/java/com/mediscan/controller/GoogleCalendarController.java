package com.mediscan.controller;

import com.mediscan.entity.User;
import com.mediscan.service.GoogleCalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/google")
@RequiredArgsConstructor
public class GoogleCalendarController {

    private final GoogleCalendarService calendarService;

    @GetMapping("/auth")
    public ResponseEntity<Void> authenticateGoogle() {
        try {
            String url = calendarService.getAuthorizationUrl();
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(url)).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/callback")
    public ResponseEntity<String> googleCallback(
            @RequestParam("code") String code,
            @AuthenticationPrincipal User user) {
        try {
            calendarService.processAuthorizationCallback(code, user);
            return ResponseEntity.ok("Successfully linked Google Calendar. You can close this tab.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to link calendar.");
        }
    }
}
