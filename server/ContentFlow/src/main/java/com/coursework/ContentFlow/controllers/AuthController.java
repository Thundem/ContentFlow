package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.configurations.JwtUtil;
import com.coursework.ContentFlow.models.RegisterRequest;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.enums.Gender;
import com.coursework.ContentFlow.models.enums.Role;
import com.coursework.ContentFlow.services.CloudinaryService;
import com.coursework.ContentFlow.services.UserService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserService userService, CloudinaryService cloudinaryService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@ModelAttribute RegisterRequest registerRequest) {
        try {
            String username = registerRequest.getUsername();
            String email = registerRequest.getEmail();
            String password = registerRequest.getPassword();
            Gender gender = registerRequest.getGender();
            LocalDate dateOfBirth = registerRequest.getDateOfBirth();

            if (username == null || email == null || password == null || gender == null || dateOfBirth == null) {
                logger.warn("Missing required parameters for registration");
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            logger.info("Registering user with email: {}", email);

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(password);
            user.setGender(gender);
            user.setDateOfBirth(dateOfBirth);
            user.setRole(Role.valueOf("USER"));

            // Зберігаємо користувача без аватара
            User createdUser = userService.registerUser(user);
            logger.info("User registered with email: {}", email);

            MultipartFile avatarFile = registerRequest.getAvatar();
            if (avatarFile != null && !avatarFile.isEmpty()) {
                // Перевірка MIME-типу
                String contentType = avatarFile.getContentType();
                if (!contentType.equals("image/jpeg") && !contentType.equals("image/png")) {
                    return ResponseEntity.badRequest().body("Invalid file type. Only JPEG and PNG are allowed.");
                }

                // Завантаження аватара
                String avatarUrl = cloudinaryService.uploadAvatar(avatarFile);
                createdUser.setAvatarUrl(avatarUrl);
                userService.updateUser(createdUser);
            } else {
                // Якщо аватар не був надісланий, можна встановити аватар за замовчуванням або кинути помилку
                logger.warn("Avatar file is missing");
                return ResponseEntity.badRequest().body("Avatar is required.");
            }

            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error during registration: {}", e.getMessage());
            return ResponseEntity.status(500).body("Registration failed.");
        }
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

    @Data
    public static class JwtResponse {
        private final String token;

        public JwtResponse(String token) {
            this.token = token;
        }
    }
}