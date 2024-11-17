package com.coursework.ContentFlow.services;

import com.coursework.ContentFlow.models.Comment;
import com.coursework.ContentFlow.repositories.CommentRepository;
import com.coursework.ContentFlow.repositories.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {
    private final CommentRepository commentRepository;

    public CommentService(CommentRepository commentRepository, PostRepository postRepository) {
        this.commentRepository = commentRepository;
    }

    // Додати коментар
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    // Отримати коментарі за ID поста
    public List<Comment> getCommentsByPostId(Long postId) {
        return commentRepository.findByPostId(postId);
    }

    public Long getUserIdByCommentId(Long commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment with ID: " + commentId + " not found"));
        return comment.getUser().getId();
    }

    public void deleteComment(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment with ID: " + commentId + " not found"));

        // Перевірка, чи користувач є автором коментаря
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalArgumentException("User is not the author of this comment");
        }

        commentRepository.delete(comment);
    }
}