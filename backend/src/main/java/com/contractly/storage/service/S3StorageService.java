package com.contractly.storage.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.*;

import java.io.InputStream;
import java.util.UUID;

/**
 * S3/MinIO storage service for contract PDFs and signed documents.
 */
@Service
public class S3StorageService {

    private static final Logger log = LoggerFactory.getLogger(S3StorageService.class);

    private final S3Client s3Client;

    @Value("${app.storage.bucket-name}")
    private String bucketName;

    public S3StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Upload a file to S3/MinIO. Returns the object key.
     */
    public String upload(byte[] data, String folder, String filename, String contentType) {
        String key = folder + "/" + UUID.randomUUID() + "-" + filename;

        try {
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(contentType)
                    .build();

            s3Client.putObject(request, RequestBody.fromBytes(data));
            log.info("Uploaded file to S3: {}", key);
            return key;
        } catch (Exception e) {
            log.error("Failed to upload to S3: {}", e.getMessage());
            throw new RuntimeException("File upload failed", e);
        }
    }

    /**
     * Download a file from S3/MinIO.
     */
    public InputStream download(String key) {
        try {
            GetObjectRequest request = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            return s3Client.getObject(request);
        } catch (Exception e) {
            log.error("Failed to download from S3: {}", e.getMessage());
            throw new RuntimeException("File download failed", e);
        }
    }

    /**
     * Delete a file from S3/MinIO.
     */
    public void delete(String key) {
        try {
            DeleteObjectRequest request = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(request);
            log.info("Deleted file from S3: {}", key);
        } catch (Exception e) {
            log.error("Failed to delete from S3: {}", e.getMessage());
        }
    }
}
