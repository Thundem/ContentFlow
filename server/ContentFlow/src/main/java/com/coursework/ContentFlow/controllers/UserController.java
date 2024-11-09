package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.getUserByEmail(email);
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return ResponseEntity.ok(user);
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{id}")
    public ResponseEntity<String> getUsernameById(@PathVariable Long id) {
        User user = userService.getUsernameById(id);
        return ResponseEntity.ok(user.getUsername());
    }
}