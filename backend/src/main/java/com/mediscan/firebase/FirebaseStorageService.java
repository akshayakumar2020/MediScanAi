//package com.mediscan.firebase;
//
//import com.google.cloud.storage.Blob;
//import com.google.cloud.storage.BlobId;
//import com.google.cloud.storage.BlobInfo;
//import com.google.cloud.storage.Storage;
//import com.google.firebase.FirebaseApp;
//import com.google.firebase.cloud.StorageClient;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.net.URLEncoder;
//import java.nio.charset.StandardCharsets;
//import java.util.UUID;
//
//@Service
//@Slf4j
//public class FirebaseStorageService {
//
//    @Value("${firebase.bucket-name}")
//    private String bucketName;
//
//    public String uploadFile(MultipartFile file) {
//        try {
//            if (FirebaseApp.getApps().isEmpty()) {
//                log.warn("Firebase not initialized. Returning placeholder URL.");
//                return "https://storage.googleapis.com/placeholder/" + file.getOriginalFilename();
//            }
//
//            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
//            String path = "reports/" + fileName;
//
//            StorageClient.getInstance().bucket().create(path, file.getInputStream(), file.getContentType());
//
//            String encodedPath = URLEncoder.encode(path, StandardCharsets.UTF_8);
//            return String.format("https://firebasestorage.googleapis.com/v0/b/%s/o/%s?alt=media",
//                    bucketName, encodedPath);
//        } catch (IOException e) {
//            log.error("Error uploading file to Firebase: {}", e.getMessage());
//            return "https://storage.googleapis.com/error/" + file.getOriginalFilename();
//        }
//    }
//}
