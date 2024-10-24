// src/main/java/com/coursework/ContentFlow/controllers/PostController.java
package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.DTOs.CommentDTO;
import com.coursework.ContentFlow.DTOs.PostDTO;
import com.coursework.ContentFlow.models.Comment;
import com.coursework.ContentFlow.models.Post;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.services.CommentService;
import com.coursework.ContentFlow.services.PostService;
import com.coursework.ContentFlow.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    public PostController(PostService postService, CommentService commentService, UserService userService) {
        this.postService = postService;
        this.commentService = commentService;
        this.userService = userService;
    }

    @GetMapping
    public List<PostDTO> getAllPosts() {
        logger.info("Getting all posts");
        List<Post> posts = postService.getAllPosts();
        logger.info("Retrieved {} posts", posts.size());

        // Конвертуємо список Post в список PostDTO
        List<PostDTO> postDTOs = posts.stream().map(post -> {
            PostDTO postDTO = new PostDTO();
            postDTO.setPostID(post.getId());
            postDTO.setTitle(post.getTitle());
            postDTO.setContent(post.getContent());
            postDTO.setLikes(post.getLikes().size());
            postDTO.setUserId(postService.getUserIdByPostId(post.getId()));

            // Перетворюємо коментарі в CommentDTO
            List<CommentDTO> commentDTOs = post.getComments().stream().map(comment -> {
                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setCommentID(comment.getId());
                commentDTO.setText(comment.getText());
                commentDTO.setUserId(commentService.getUserIdByCommentId(comment.getId()));
                return commentDTO;
            }).toList();

            postDTO.setComments(commentDTOs); // Встановлюємо коментарі в PostDTO
            return postDTO;
        }).toList();

        return postDTOs;
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody Post post, @RequestParam Long userId) {
        logger.info("Creating post with title: {}", post.getTitle());

        // Отримуємо користувача за ID
        User user = userService.getUserById(userId);
        post.setUser(user); // Прив'язуємо пост до користувача
        post.setLikes(new ArrayList<>()); // Ініціалізуємо поле likes як пустий список

        Post createdPost = postService.createPost(post);
        logger.info("Post created with ID: {}", createdPost.getId());

        // Створення PostDTO
        PostDTO postDTO = new PostDTO();
        postDTO.setPostID(createdPost.getId());
        postDTO.setTitle(createdPost.getTitle());
        postDTO.setContent(createdPost.getContent());
        postDTO.setLikes(createdPost.getLikes().size()); // Використовуємо size() для отримання кількості лайків
        postDTO.setUserId(user.getId()); // Встановлюємо ID користувача

        return ResponseEntity.ok(postDTO);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<String> likePost(@PathVariable Long id, @RequestParam Long userId) {
        try {
            postService.likePost(id, userId);
            logger.info("Post with ID: {} liked successfully by user with ID: {}", id, userId);
            return ResponseEntity.ok("Post with ID: " + id + " liked successfully");
        } catch (EntityNotFoundException ex) {
            logger.error("Error liking post: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        } catch (IllegalArgumentException ex) {
            logger.error("Error liking post: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id) {
        try {
            postService.deletePost(id);
            logger.info("Post with ID: {} deleted successfully", id);
            return ResponseEntity.ok("Post with ID: " + id + " deleted successfully");
        } catch (EntityNotFoundException ex) {
            logger.error("Error deleting post: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Post not found");
        }
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody Comment comment, @RequestParam Long userId) {
        logger.info("Adding comment to post with ID: {}", postId);

        // Отримуємо користувача за ID
        User user = userService.getUserById(userId);
        comment.setPost(postService.getPostById(postId)); // Прив'язуємо коментар до поста
        comment.setUser(user); // Прив'язуємо коментар до користувача

        Comment createdComment = commentService.addComment(comment);
        logger.info("Comment added with ID: {}", createdComment.getId());
        return ResponseEntity.ok(createdComment);
    }


    // Отримати всі коментарі до поста
    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        logger.info("Getting comments for post with ID: {}", postId);
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        logger.info("Retrieved {} comments for post ID: {}", comments.size(), postId);
        return comments;
    }
}