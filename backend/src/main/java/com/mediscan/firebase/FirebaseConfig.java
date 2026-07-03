//package com.mediscan.firebase;
//
//import com.google.auth.oauth2.GoogleCredentials;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.FirebaseOptions;
//import jakarta.annotation.PostConstruct;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.core.io.ClassPathResource;
//
//import java.io.IOException;
//import java.io.InputStream;
//
//@Configuration
//@Slf4j
//public class FirebaseConfig {
//
//    @Value("${firebase.bucket-name}")
//    private String bucketName;
//
//    @Value("${firebase.config-path}")
//    private String configPath;
//
//    @PostConstruct
//    public void initialize() {
//        try {
//            if (FirebaseApp.getApps().isEmpty()) {
//                InputStream serviceAccount = new ClassPathResource(configPath).getInputStream();
//                FirebaseOptions options = FirebaseOptions.builder()
//                        .setCredentials(GoogleCredentials.fromStream(serviceAccount))
//                        .setStorageBucket(bucketName)
//                        .build();
//                FirebaseApp.initializeApp(options);
//                log.info("Firebase initialized successfully");
//            }
//        } catch (IOException e) {
//            log.warn("Firebase config not found. Using placeholder storage. Error: {}", e.getMessage());
//        }
//    }
//}
