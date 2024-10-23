package com.coursework.ContentFlow.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CommentDTO {
    private Long commentID;
    private String text;
    private String username; // Ім'я користувача, який залишив коментар
}