package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.configurations.JwtUtil;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody Map<String, String> userDetails) {
        String username = userDetails.get("username");
        String email = userDetails.get("email");
        String password = userDetails.get("password");

        logger.info("Registering user with email: {}", email);
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);

        if (username == null || email == null || password == null) {
            logger.warn("Missing required parameters for registration");
            return ResponseEntity.badRequest().body(null);
        }

        User createdUser = userService.registerUser(user);
        logger.info("User registered with email: {}", email);

        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.getUserByEmail(email);


        if (user == null) {
            logger.warn("No user found with email: {}", email);
            return ResponseEntity.status(401).body("Invalid email or password");
        }

        boolean passwordMatch = passwordEncoder.matches(password, user.getPassword());
        logger.info("Password match result for email {}: {}", email, passwordMatch);

        if (passwordMatch) {
            String token = jwtUtil.generateToken(email);
            logger.info("Login successful for email: {}", email);
            logger.info("JWT token generated and sent: {}", token != null);
            return ResponseEntity.ok(new JwtResponse(token));
        }

        logger.warn("Invalid email or password for email: {}", email);
        return ResponseEntity.status(401).body("Invalid email or password");
    }

    public static class JwtResponse {
        private String token;

        public JwtResponse(String token) {
            this.token = token;
        }

        public String getToken() {
            return token;
        }
    }
}