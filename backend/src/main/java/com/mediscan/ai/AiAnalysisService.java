package com.mediscan.ai;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AiAnalysisService {

    @Value("${spring.ai.google.genai.api-key}")
    private String apiKey;

    @Value("${spring.ai.google.genai.chat.options.model:gemini-2.5-flash}")
    private String model;

    public String analyzeReport(String extractedText) {
        try {
            if (extractedText == null || extractedText.trim().isEmpty()) {
                return "No text available for analysis.";
            }

            Client client = Client.builder().apiKey(apiKey).build();
            String prompt = buildAnalysisPrompt(extractedText);

            GenerateContentResponse response =
                    client.models.generateContent(model, prompt, null);

            return response.text();
        } catch (Exception e) {
            log.error("AI analysis error: {}", e.getMessage());
            return "AI analysis temporarily unavailable. Please try again later.";
        }
    }

    public String chat(String message) {
        try {
            Client client = Client.builder().apiKey(apiKey).build();
            String prompt = buildChatPrompt(message);

            GenerateContentResponse response =
                    client.models.generateContent(model, prompt, null);

            return response.text();
        } catch (Exception e) {
            log.error("AI chat error: {}", e.getMessage());
            return "AI assistant temporarily unavailable.";
        }
    }

    private String buildAnalysisPrompt(String text) {
        return """
            You are a medical report analysis AI assistant. Analyze the following medical report text and provide:

            1. **Summary**: A brief overview of the report
            2. **Key Findings**: Important values and their status (normal/abnormal)
            3. **Risk Indicators**: Any values that indicate health risks
            4. **Recommendations**: Suggested actions or follow-ups

            Format the response in clear sections with headers.

            Medical Report Text:
            """ + text;
    }

    private String buildChatPrompt(String message) {
        return """
            You are a helpful medical assistant chatbot. Answer the user's question clearly and safely,
            and always recommend they consult a healthcare professional for personalized advice.

            User question:
            """ + message;
    }
}