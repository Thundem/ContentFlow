package com.coursework.ContentFlow.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PostDTO {
    private Long id;
    private String mediaUrl;
    private String content;
    private int likes;
    private Long userId;
    private List<CommentDTO> comments;
}