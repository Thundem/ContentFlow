package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.configurations.JwtUtil;
import com.coursework.ContentFlow.models.RegisterRequest;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.VerificationToken;
import com.coursework.ContentFlow.models.enums.Gender;
import com.coursework.ContentFlow.models.enums.Role;
import com.coursework.ContentFlow.services.CloudinaryService;
import com.coursework.ContentFlow.services.EmailService;
import com.coursework.ContentFlow.services.UserService;
import com.coursework.ContentFlow.services.VerificationTokenService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private final VerificationTokenService verificationTokenService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserService userService, CloudinaryService cloudinaryService, VerificationTokenService verificationTokenService, EmailService emailService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
        this.verificationTokenService = verificationTokenService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@ModelAttribute RegisterRequest registerRequest) {
        try {
            String username = registerRequest.getUsername();
            String email = registerRequest.getEmail();
            String name = registerRequest.getName();
            String surname = registerRequest.getSurname();
            String password = registerRequest.getPassword();
            Gender gender = registerRequest.getGender();
            LocalDate dateOfBirth = registerRequest.getDateOfBirth();

            if (userService.getUserByEmail(email) != null) {
                return ResponseEntity.badRequest().body("Email is already in use");
            }

            if (userService.getUserByUsername(username) != null) {
                return ResponseEntity.badRequest().body("Username is already taken");
            }

            if (username == null || email == null || name == null || surname == null || password == null || gender == null || dateOfBirth == null) {
                logger.warn("Missing required parameters for registration");
                return ResponseEntity.badRequest().body("Missing required parameters");
            }

            logger.info("Registering user with email: {}", email);

            User existingUser = userService.getUserByEmail(email);
            if (existingUser != null) {
                if (existingUser.isEnabled()) {
                    logger.warn("Attempt to register with existing email: {}", email);
                    return ResponseEntity.badRequest().body("Email is already in use");
                } else {
                    // Користувач існує, але ще не підтвердив email
                    // Повторно відправляємо лист з підтвердженням
                    VerificationToken newToken = verificationTokenService.createVerificationToken(existingUser);
                    String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + newToken.getToken();
                    emailService.sendVerificationEmail(existingUser.getEmail(), verificationUrl);
                    logger.info("Resent verification email to: {}", existingUser.getEmail());
                    return ResponseEntity.ok("A verification email has been resent to your email address. Please check your inbox.");
                }
            }

            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setName(name);
            user.setSurname(surname);
            user.setPassword(password);
            user.setGender(gender);
            user.setDateOfBirth(dateOfBirth);
            user.setRole(Role.valueOf("ADMIN"));
            user.setEnabled(false);

            User createdUser = userService.registerUser(user);
            logger.info("User registered with email: {}", email);

            MultipartFile avatarFile = registerRequest.getAvatar();
            if (avatarFile != null && !avatarFile.isEmpty()) {
                // Перевірка MIME-типу
                String contentType = avatarFile.getContentType();
                if (!contentType.equals("image/jpeg") && !contentType.equals("image/png")) {
                    return ResponseEntity.badRequest().body("Invalid file type. Only JPEG and PNG are allowed.");
                }

                String avatarUrl = cloudinaryService.uploadAvatar(avatarFile);
                createdUser.setAvatarUrl(avatarUrl);
                userService.updateUser(createdUser);
            } else {
                logger.warn("Avatar file is missing");
                return ResponseEntity.badRequest().body("Avatar is required.");
            }

            // Створюємо токен підтвердження
            VerificationToken verificationToken = verificationTokenService.createVerificationToken(createdUser);

            // Генеруємо посилання для підтвердження
            String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + verificationToken.getToken();

            // Відправляємо лист
            emailService.sendVerificationEmail(createdUser.getEmail(), verificationUrl);

            logger.info("Verification email sent to: {}", createdUser.getEmail());

            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("Error during registration: {}", e.getMessage());
            return ResponseEntity.status(500).body("Registration failed.");
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        VerificationToken verificationToken = verificationTokenService.getVerificationToken(token);

        if (verificationToken == null || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired verification token");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true); // Потрібно додати поле 'enabled' до моделі User
        userService.updateUser(user);

        // Видаляємо токен після успішного підтвердження
        verificationTokenService.deleteVerificationToken(verificationToken.getId());

        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        User existingUser = userService.getUserByEmail(email);
        if (existingUser == null) {
            return ResponseEntity.badRequest().body("User with this email does not exist");
        }

        if (existingUser.isEnabled()) {
            return ResponseEntity.badRequest().body("User is already verified");
        }

        // Створюємо новий токен підтвердження
        VerificationToken newToken = verificationTokenService.createVerificationToken(existingUser);

        // Генеруємо посилання для підтвердження
        String verificationUrl = "http://localhost:8080/api/auth/verify?token=" + newToken.getToken();

        // Відправляємо лист
        emailService.sendVerificationEmail(existingUser.getEmail(), verificationUrl);

        logger.info("Resent verification email to: {}", existingUser.getEmail());

        return ResponseEntity.ok("A new verification email has been sent to your email address.");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        User user = userService.getUserByEmail(email);

        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("Please verify your email before logging in.");
        }

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