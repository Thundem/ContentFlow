package com.coursework.ContentFlow.repositories;

import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    VerificationToken findByToken(String token);
    VerificationToken findByUser(User user);
}