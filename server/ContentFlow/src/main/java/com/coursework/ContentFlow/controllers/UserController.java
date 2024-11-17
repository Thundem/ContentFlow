package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.models.enums.Gender;
import com.coursework.ContentFlow.models.enums.Role;
import com.coursework.ContentFlow.services.CloudinaryService;
import com.coursework.ContentFlow.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final CloudinaryService cloudinaryService;

    public UserController(UserService userService, CloudinaryService cloudinaryService) {
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
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

    @Secured("ROLE_ADMIN")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/username/{id}")
    public ResponseEntity<String> getUsernameById(@PathVariable Long id) {
        User user = userService.getUsernameById(id);
        return ResponseEntity.ok(user.getUsername());
    }

    @PatchMapping(value = "/update", consumes = { "multipart/form-data" })
    public ResponseEntity<User> updateUser(
            @RequestParam(required = false) String username,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String surname,
            @RequestParam(required = false) String dateOfBirth,
            @RequestParam(required = false) Gender gender,
            @RequestParam(required = false) MultipartFile avatar,
            Authentication authentication) {

        String emailAuth = authentication.getName();
        User user = userService.getUserByEmail(emailAuth);

        if (username != null && !username.isEmpty()) user.setUsername(username);
        if (email != null && !email.isEmpty()) user.setEmail(email);
        if (name != null && !name.isEmpty()) user.setName(name);
        if (surname != null && !surname.isEmpty()) user.setSurname(surname);
        if (dateOfBirth != null && !dateOfBirth.isEmpty()) user.setDateOfBirth(LocalDate.parse(dateOfBirth));
        if (gender != null) user.setGender(gender);

        if (avatar != null && !avatar.isEmpty()) {
            if (user.getAvatarPublicId() != null && !user.getAvatarPublicId().isEmpty()) {
                cloudinaryService.deleteAvatar(user.getAvatarPublicId());
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadAvatar(avatar);
            String avatarUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            user.setAvatarUrl(avatarUrl);
            user.setAvatarPublicId(publicId);
        }

        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }

    @Secured("ROLE_ADMIN")
    @PatchMapping(value = "/update/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<User> updateUser(@PathVariable Long id,
                                           @RequestParam(required = false) String username,
                                           @RequestParam(required = false) String email,
                                           @RequestParam(required = false) String name,
                                           @RequestParam(required = false) String surname,
                                           @RequestParam(required = false) Gender gender,
                                           @RequestParam(required = false) Role role,
                                           @RequestParam(required = false) String dateOfBirth,
                                           @RequestParam(required = false) MultipartFile avatar) {
        User user = userService.getUserById(id);
        if (user == null) {
            return ResponseEntity.status(404).body(null);
        }

        // Оновлення тільки тих полів, які були передані
        if (username != null) user.setUsername(username);
        if (email != null) user.setEmail(email);
        if (name != null) user.setName(name);
        if (surname != null) user.setSurname(surname);
        if (gender != null) user.setGender(gender);
        if (role != null) user.setRole(role);
        if (dateOfBirth != null) user.setDateOfBirth(LocalDate.parse(dateOfBirth));

        // Якщо є нове фото, обробляємо його
        if (avatar != null && !avatar.isEmpty()) {
            if (user.getAvatarPublicId() != null && !user.getAvatarPublicId().isEmpty()) {
                cloudinaryService.deleteAvatar(user.getAvatarPublicId());
            }

            Map<String, Object> uploadResult = cloudinaryService.uploadAvatar(avatar);
            String avatarUrl = (String) uploadResult.get("secure_url");
            String publicId = (String) uploadResult.get("public_id");

            user.setAvatarUrl(avatarUrl);
            user.setAvatarPublicId(publicId);
        }

        User updatedUser = userService.updateUser(user);
        return ResponseEntity.ok(updatedUser);
    }
}