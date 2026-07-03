package com.mediscan.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryStorageService {

    private final Cloudinary cloudinary;

    public String uploadFile(MultipartFile file) {

        try {

            String publicId = "reports/" + UUID.randomUUID();

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", publicId,
                            "resource_type", "auto"
                    )
            );

            String url = uploadResult.get("secure_url").toString();

            log.info("File uploaded successfully: {}", url);

            return url;

        } catch (IOException e) {

            log.error("Cloudinary upload failed", e);

            throw new RuntimeException("Unable to upload file.");
        }
    }
}