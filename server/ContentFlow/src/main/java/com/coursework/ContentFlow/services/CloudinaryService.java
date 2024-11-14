package com.coursework.ContentFlow.services;

import com.cloudinary.*;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public CloudinaryService(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret
    ) {
        if (cloudName == null || apiKey == null || apiSecret == null) {
            throw new IllegalArgumentException("Cloudinary configuration properties are missing!");
        }
        cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public Map<String, Object> getSignature() {
        long timestamp = System.currentTimeMillis() / 1000L;
        Map<String, Object> params = ObjectUtils.asMap(
                "timestamp", timestamp,
                "source", "browser"
        );
        String signature = cloudinary.apiSignRequest(params, cloudinary.config.apiSecret);

        Map<String, Object> response = ObjectUtils.asMap(
                "timestamp", timestamp,
                "signature", signature,
                "cloudName", cloudinary.config.cloudName,
                "apiKey", cloudinary.config.apiKey
        );

        return response;
    }
}