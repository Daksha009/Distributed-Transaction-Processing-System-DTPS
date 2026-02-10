package com.example.dtps.service;

import com.example.dtps.model.Transaction;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.nio.charset.StandardCharsets;

@Service
public class S3StorageService implements StorageService {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    public S3StorageService() {
        // In a real scenario, S3Client should be a Bean configured with credentials
        // Assuming DefaultCredentialsProvider is sufficient for IAM Role auth
        this.s3Client = S3Client.create();
    }
    
    // Allow injection for testing
    public S3StorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    @Override
    public String uploadReceipt(Transaction transaction) {
        String key = "receipts/" + transaction.getId() + "_" + System.currentTimeMillis() + ".txt";
        String content = "Transaction Receipt\n" +
                "ID: " + transaction.getId() + "\n" +
                "Sender: " + transaction.getSender() + "\n" +
                "Receiver: " + transaction.getReceiver() + "\n" +
                "Amount: " + transaction.getAmount() + "\n" +
                "Timestamp: " + transaction.getTimestamp();

        try {
            PutObjectRequest putOb = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.putObject(putOb, RequestBody.fromString(content, StandardCharsets.UTF_8));
            
            // Return S3 URL
            return "s3://" + bucketName + "/" + key;
        } catch (Exception e) {
            // Log error but don't fail transaction if storage is optional, 
            // or rethrow to trigger circuit breaker if critical.
            // For this assignment, we'll log and return a fallback string.
            System.err.println("S3 Upload Failed: " + e.getMessage());
            return "UPLOAD_FAILED";
        }
    }
}
