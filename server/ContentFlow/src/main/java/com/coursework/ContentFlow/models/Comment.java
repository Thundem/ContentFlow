// src/main/java/com/coursework/ContentFlow/models/Comment.java
package com.coursework.ContentFlow.models;

import jakarta.persistence.*;
import lombok.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Comment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "comment_id")
    private Long id;
    private String text;

    @ManyToOne
    @JoinColumn(name = "post_id")
    @JsonBackReference // Зв'язок з Post, не серіалізувати назад
    private Post post;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Зв'язок з користувачем
}