package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestParam String username, @RequestParam String email, @RequestParam String password) {
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(password);

        // Перевірка, чи вказані всі необхідні параметри
        if (username == null || email == null || password == null) {
            return ResponseEntity.badRequest().body(null);
        }

        User createdUser = userService.registerUser(user);
        return ResponseEntity.ok(createdUser);
    }


    @GetMapping("/login")
    public ResponseEntity<String> login(@RequestParam String email, @RequestParam String password) {
        if (userService.login(email, password)) {
            return ResponseEntity.ok("Login successful");
        }
        return ResponseEntity.status(401).body("Invalid email or password");
    }
}
