package com.mediscan.ai;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.mediscan.dto.PreVisitSummaryResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@Slf4j
@RequiredArgsConstructor
public class AppointmentAiService {

    @Value("${spring.ai.google.genai.api-key}")
    private String apiKey;

    @Value("${spring.ai.google.genai.chat.options.model:gemini-2.5-flash}")
    private String model;

    private final ObjectMapper objectMapper;

    public PreVisitSummaryResponse generatePreVisitSummary(String symptoms) {
        try {
            if (symptoms == null || symptoms.trim().isEmpty()) {
                return fallbackSummary("No symptoms provided.");
            }

            Client client = Client.builder().apiKey(apiKey).build();
            String prompt = """
                You are a medical triage AI. Analyze the patient's symptoms and provide a JSON response.
                You must return strictly valid JSON matching this schema, without any markdown formatting like ```json.
                {
                  "urgency": "Low" | "Medium" | "High",
                  "chiefComplaint": "A concise 1-sentence summary of the main issue",
                  "questions": ["Question 1 to ask the patient", "Question 2"]
                }
                
                Patient symptoms:
                """ + symptoms;

            GenerateContentResponse response = client.models.generateContent(model, prompt, null);
            String responseText = response.text().trim();
            
            // Clean up if the model includes markdown formatting
            if (responseText.startsWith("```json")) {
                responseText = responseText.substring(7);
            }
            if (responseText.startsWith("```")) {
                responseText = responseText.substring(3);
            }
            if (responseText.endsWith("```")) {
                responseText = responseText.substring(0, responseText.length() - 3);
            }

            return objectMapper.readValue(responseText, PreVisitSummaryResponse.class);

        } catch (Exception e) {
            log.error("Failed to generate pre-visit summary from LLM: {}", e.getMessage());
            return fallbackSummary("AI analysis temporarily unavailable.");
        }
    }

    public String generatePostVisitSummary(String clinicalNotes, String prescription) {
        try {
            Client client = Client.builder().apiKey(apiKey).build();
            String prompt = """
                You are a helpful medical assistant. The doctor has written the following clinical notes and prescription.
                Please translate this into a warm, patient-friendly summary that is easy to understand without medical jargon.
                Explain what they should do next and how to take their medication.

                Clinical Notes:
                """ + clinicalNotes + """
                
                Prescription:
                """ + prescription;

            GenerateContentResponse response = client.models.generateContent(model, prompt, null);
            return response.text();

        } catch (Exception e) {
            log.error("Failed to generate post-visit summary from LLM: {}", e.getMessage());
            return "Summary currently unavailable due to system load. Please consult your prescription details directly.";
        }
    }

    private PreVisitSummaryResponse fallbackSummary(String complaint) {
        return PreVisitSummaryResponse.builder()
                .urgency("Medium")
                .chiefComplaint(complaint)
                .questions(new ArrayList<>())
                .build();
    }
}
