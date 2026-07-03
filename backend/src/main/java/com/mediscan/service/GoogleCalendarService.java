package com.mediscan.service;

import com.google.api.client.auth.oauth2.AuthorizationCodeRequestUrl;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.auth.oauth2.TokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.mediscan.entity.Appointment;
import com.mediscan.entity.GoogleCredential;
import com.mediscan.entity.User;
import com.mediscan.repository.GoogleCredentialRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.StringReader;
import java.util.Collections;

@Service
@RequiredArgsConstructor
@Slf4j
public class GoogleCalendarService {

    private final GoogleCredentialRepository credentialRepository;
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String REDIRECT_URI = "http://localhost:8080/api/google/callback";

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    private GoogleAuthorizationCodeFlow getFlow() throws Exception {
        NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
        
        String clientSecretsJson = String.format(
            "{\"web\":{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"auth_uri\":\"https://accounts.google.com/o/oauth2/auth\",\"token_uri\":\"https://oauth2.googleapis.com/token\"}}",
            clientId, clientSecret
        );

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new StringReader(clientSecretsJson));

        return new GoogleAuthorizationCodeFlow.Builder(
                httpTransport, JSON_FACTORY, clientSecrets, Collections.singleton(CalendarScopes.CALENDAR))
                .setAccessType("offline")
                .setApprovalPrompt("force")
                .build();
    }

    public String getAuthorizationUrl() throws Exception {
        return getFlow().newAuthorizationUrl().setRedirectUri(REDIRECT_URI).build();
    }

    public void processAuthorizationCallback(String code, User user) throws Exception {
        TokenResponse response = getFlow().newTokenRequest(code).setRedirectUri(REDIRECT_URI).execute();
        
        GoogleCredential cred = credentialRepository.findByUser(user).orElse(new GoogleCredential());
        cred.setUser(user);
        cred.setAccessToken(response.getAccessToken());
        if (response.getRefreshToken() != null) {
            cred.setRefreshToken(response.getRefreshToken());
        }
        cred.setExpirationTimeMillis(System.currentTimeMillis() + (response.getExpiresInSeconds() * 1000));
        
        credentialRepository.save(cred);
        log.info("Saved Google Calendar credentials for user: {}", user.getEmail());
    }

    private Calendar getCalendarService(User user) {
        try {
            GoogleCredential cred = credentialRepository.findByUser(user).orElse(null);
            if (cred == null) return null;

            NetHttpTransport httpTransport = GoogleNetHttpTransport.newTrustedTransport();
            Credential credential = new Credential.Builder(com.google.api.client.auth.oauth2.BearerToken.authorizationHeaderAccessMethod())
                .setTransport(httpTransport)
                .setJsonFactory(JSON_FACTORY)
                .setTokenServerUrl(new com.google.api.client.http.GenericUrl("https://oauth2.googleapis.com/token"))
                .setClientAuthentication(new com.google.api.client.auth.oauth2.ClientParametersAuthentication(clientId, clientSecret))
                .build();
            
            credential.setAccessToken(cred.getAccessToken());
            credential.setRefreshToken(cred.getRefreshToken());
            credential.setExpirationTimeMilliseconds(cred.getExpirationTimeMillis());

            return new Calendar.Builder(httpTransport, JSON_FACTORY, credential)
                    .setApplicationName("MediScan AI")
                    .build();
        } catch (Exception e) {
            log.error("Failed to initialize Google Calendar client", e);
            return null;
        }
    }

    public String addEvent(Appointment appt) {
        try {
            Calendar service = getCalendarService(appt.getDoctor().getUser());
            if (service == null) return null;

            Event event = new Event()
                .setSummary("Appointment with " + appt.getPatient().getUser().getName())
                .setDescription("Reason: " + appt.getReason());

            java.util.Date startDate = java.sql.Timestamp.valueOf(appt.getAppointmentDate());
            java.util.Date endDate = java.sql.Timestamp.valueOf(appt.getAppointmentDate().plusMinutes(appt.getDoctor().getSlotDurationMinutes()));

            event.setStart(new EventDateTime().setDateTime(new DateTime(startDate)));
            event.setEnd(new EventDateTime().setDateTime(new DateTime(endDate)));

            Event createdEvent = service.events().insert("primary", event).execute();
            log.info("Event created: {}", createdEvent.getHtmlLink());
            return createdEvent.getId();
        } catch (Exception e) {
            log.error("Failed to add calendar event", e);
            return null;
        }
    }

    public void deleteEvent(User doctorUser, String eventId) {
        if (eventId == null) return;
        try {
            Calendar service = getCalendarService(doctorUser);
            if (service == null) return;
            service.events().delete("primary", eventId).execute();
            log.info("Deleted calendar event {}", eventId);
        } catch (Exception e) {
            log.error("Failed to delete calendar event", e);
        }
    }
}
