package com.coursework.ContentFlow.repositories;

import com.coursework.ContentFlow.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}