package com.mediscan.controller;

import com.mediscan.ai.AiAnalysisService;
import com.mediscan.dto.ChatRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final AiAnalysisService aiService;

    @PostMapping("/send")
    public ResponseEntity<Map<String, String>> sendMessage(@Valid @RequestBody ChatRequest request) {
        String response = aiService.chat(request.getMessage());
        return ResponseEntity.ok(Map.of("response", response));
    }
}
