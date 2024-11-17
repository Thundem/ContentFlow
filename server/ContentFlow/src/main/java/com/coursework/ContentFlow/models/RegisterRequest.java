package com.coursework.ContentFlow.models;

import com.coursework.ContentFlow.models.enums.Gender;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class RegisterRequest {
    private String username;
    private String email;
    private String name;
    private String surname;
    private String password;
    private Gender gender;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate dateOfBirth;

    private MultipartFile avatar;
}