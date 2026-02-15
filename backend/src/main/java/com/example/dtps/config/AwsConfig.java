package com.example.dtps.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

@Configuration
public class AwsConfig {

    @Bean
    public S3Client s3Client() {
        // Use dummy credentials for local run to avoid startup failure
        // In a real production app, we would use conditional beans based on profiles
        try {
            return S3Client.builder()
                    .region(Region.US_EAST_1)
                    .credentialsProvider(StaticCredentialsProvider.create(
                            AwsBasicCredentials.create("test", "test")))
                    .build();
        } catch (Exception e) {
            // If even this fails, return null or handle appropriately, but this shouldn't
            // fail
            // unless key/secret validation is strict (it isn't for basic credentials object
            // creation)
            return S3Client.create();
        }

    }
}
