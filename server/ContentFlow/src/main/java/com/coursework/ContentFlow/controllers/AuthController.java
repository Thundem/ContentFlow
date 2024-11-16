package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.configurations.JwtUtil;
import com.coursework.ContentFlow.models.FieldErrorResponse;
import com.coursework.ContentFlow.models.RegisterRequest;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.VerificationToken;
import com.coursework.ContentFlow.models.enums.Gender;
import com.coursework.ContentFlow.models.enums.Role;
import com.coursework.ContentFlow.services.CloudinaryService;
import com.coursework.ContentFlow.services.EmailService;
import com.coursework.ContentFlow.services.UserService;
import com.coursework.ContentFlow.services.VerificationTokenService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final VerificationTokenService verificationTokenService;
    private final EmailService emailService;
    private final JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    public AuthController(UserService userService, CloudinaryService cloudinaryService, VerificationTokenService verificationTokenService, EmailService emailService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.verificationTokenService = verificationTokenService;
        this.emailService = emailService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@ModelAttribute RegisterRequest registerRequest, HttpServletRequest request) {
        try {
            String username = registerRequest.getUsername();
            String email = registerRequest.getEmail();
            String name = registerRequest.getName();
            String surname = registerRequest.getSurname();
            String password = registerRequest.getPassword();
            Gender gender = registerRequest.getGender();
            LocalDate dateOfBirth = registerRequest.getDateOfBirth();

            Map<String, String> errors = new HashMap<>();

            if (userService.getUserByEmail(email) != null) {
                errors.put("email", "Email is already in use");
            }

            if (userService.getUserByUsername(username) != null) {
                errors.put("username", "Username is already taken");
            }

            if (username == null || email == null || name == null || surname == null || password == null || gender == null || dateOfBirth == null) {
                errors.put("general", "Missing required parameters");
            }

            if (!errors.isEmpty()) {
                return ResponseEntity.badRequest().body(new FieldErrorResponse(errors));
            }

            logger.info("Registering user with email: {}", email);

            User existingUser = userService.getUserByEmail(email);
            if (existingUser != null) {
                if (existingUser.isEnabled()) {
                    logger.warn("Attempt to register with existing email: {}", email);
                    return ResponseEntity.badRequest().body("Email is already in use");
                } else {
                    VerificationToken newToken = verificationTokenService.createVerificationToken(existingUser);
                    String baseUrl = getBaseUrl(request);
                    String verificationUrl = baseUrl + "/verify?token=" + newToken.getToken();
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
            user.setRole(Role.USER);
            user.setEnabled(false);

            User createdUser = userService.registerUser(user);
            logger.info("User registered with email: {}", email);

            VerificationToken verificationToken = verificationTokenService.createVerificationToken(createdUser);
            String baseUrl = getBaseUrl(request);
            String verificationUrl = baseUrl + "/verify?token=" + verificationToken.getToken();

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
        user.setEnabled(true);
        userService.updateUser(user);

        return ResponseEntity.ok("Email verified successfully. You can now log in.");
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@RequestBody Map<String, String> request, HttpServletRequest httpRequest) {
        String email = request.get("email");

        if (email == null || email.isEmpty()) {
            Map<String, String> errors = Map.of("email", "Email is required");
            return ResponseEntity.badRequest().body(new FieldErrorResponse(errors));
        }

        User existingUser = userService.getUserByEmail(email);
        if (existingUser == null) {
            Map<String, String> errors = Map.of("email", "User with this email does not exist");
            return ResponseEntity.badRequest().body(new FieldErrorResponse(errors));
        }

        if (existingUser.isEnabled()) {
            Map<String, String> errors = Map.of("email", "User is already verified");
            return ResponseEntity.badRequest().body(new FieldErrorResponse(errors));
        }

        VerificationToken newToken = verificationTokenService.createVerificationToken(existingUser);
        String baseUrl = getBaseUrl(httpRequest);
        String verificationUrl = baseUrl + "/verify?token=" + newToken.getToken();

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

        VerificationToken existingToken = verificationTokenService.getVerificationTokenByUser(user);
        if (existingToken != null) {
            verificationTokenService.deleteVerificationToken(existingToken.getId());
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

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmail(@RequestParam("email") String email) {
        boolean exists = userService.getUserByEmail(email) != null;
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    @GetMapping("/check-username")
    public ResponseEntity<?> checkUsername(@RequestParam("username") String username) {
        boolean exists = userService.getUserByUsername(username) != null;
        return ResponseEntity.ok(Map.of("exists", exists));
    }

    private String getBaseUrl(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int serverPort = request.getServerPort();
        String contextPath = request.getContextPath();

        if (serverName.equals("localhost")) {
            return scheme + "://" + serverName + ":5173" + contextPath;
        } else {
            return scheme + "://" + serverName + (serverPort != 80 && serverPort != 443 ? ":" + serverPort : "") + contextPath;
        }
    }


    @Data
    public static class JwtResponse {
        private final String token;

        public JwtResponse(String token) {
            this.token = token;
        }
    }
}