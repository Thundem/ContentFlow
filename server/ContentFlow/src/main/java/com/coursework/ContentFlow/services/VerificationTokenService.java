package com.coursework.ContentFlow.services;

import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.VerificationToken;
import com.coursework.ContentFlow.repositories.VerificationTokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class VerificationTokenService {
    private final VerificationTokenRepository verificationTokenRepository;

    public VerificationTokenService(VerificationTokenRepository verificationTokenRepository) {
        this.verificationTokenRepository = verificationTokenRepository;
    }

    public VerificationToken createVerificationToken(User user) {
        VerificationToken token = new VerificationToken();
        token.setToken(UUID.randomUUID().toString());
        token.setUser(user);
        token.setExpiryDate(LocalDateTime.now().plusHours(24)); // Термін дії токена 24 години
        return verificationTokenRepository.save(token);
    }

    public VerificationToken getVerificationToken(String token) {
        return verificationTokenRepository.findByToken(token);
    }

    public void deleteVerificationToken(Long id) {
        verificationTokenRepository.deleteById(id);
    }
}