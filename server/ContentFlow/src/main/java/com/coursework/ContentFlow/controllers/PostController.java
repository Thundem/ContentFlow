package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.DTOs.ApiResponse;
import com.coursework.ContentFlow.DTOs.CommentDTO;
import com.coursework.ContentFlow.DTOs.PostDTO;
import com.coursework.ContentFlow.models.Comment;
import com.coursework.ContentFlow.models.Post;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.services.CloudinaryService;
import com.coursework.ContentFlow.services.CommentService;
import com.coursework.ContentFlow.services.PostService;
import com.coursework.ContentFlow.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;
    private final CommentService commentService;
    private final UserService userService;
    private final CloudinaryService cloudinaryService;
    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    public PostController(PostService postService, CommentService commentService, UserService userService, CloudinaryService cloudinaryService) {
        this.postService = postService;
        this.commentService = commentService;
        this.userService = userService;
        this.cloudinaryService = cloudinaryService;
    }

    @GetMapping("/me")
    public ResponseEntity<List<PostDTO>> getUserPosts(Authentication auth) {
        String email = auth.getName();
        Long userId = userService.getUserByEmail(email).getId();
        logger.info("Fetching posts for user ID: {}", userId);

        List<Post> userPosts = postService.getPostsByUserId(userId);
        List<PostDTO> postDTOs = userPosts.stream().map(post -> {
            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setMediaUrl(post.getMediaUrl());
            postDTO.setContent(post.getContent());
            postDTO.setLikes(post.getLikes().size());
            postDTO.setUserId(post.getUser().getId());

            // Конвертація коментарів
            List<CommentDTO> commentDTOs = post.getComments().stream().map(comment -> {
                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setId(comment.getId());
                commentDTO.setText(comment.getText());
                commentDTO.setUserId(comment.getUser().getId());
                return commentDTO;
            }).toList();

            postDTO.setComments(commentDTOs);
            return postDTO;
        }).toList();

        return ResponseEntity.ok(postDTOs);
    }

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, Authentication auth) {
        String email = auth.getName();
        Long userId = userService.getUserByEmail(email).getId();
        logger.info("Creating post by : {}", userId);

        User user = userService.getUserById(userId);
        Post post = new Post();
        post.setContent(postDTO.getContent());
        post.setMediaUrl(postDTO.getMediaUrl());
        post.setUser(user);
        post.setLikes(new ArrayList<>());

        Post createdPost = postService.createPost(post);
        logger.info("Post created with ID: {}", createdPost.getId());

        PostDTO responseDTO = new PostDTO();
        responseDTO.setId(createdPost.getId());
        responseDTO.setMediaUrl(createdPost.getMediaUrl());
        responseDTO.setContent(createdPost.getContent());
        responseDTO.setLikes(createdPost.getLikes().size());
        responseDTO.setUserId(user.getId());

        return ResponseEntity.ok(responseDTO);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<ApiResponse> likePost(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();

        try {
            postService.likePost(id, userId);
            logger.info("Post with ID: {} liked successfully by user with ID: {}", id, userId);
            ApiResponse response = new ApiResponse("Post with ID: " + id + " liked successfully", null);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException ex) {
            logger.error("Error liking post: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, "Post not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IllegalArgumentException ex) {
            logger.error("Error liking post: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
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
    public ResponseEntity<Comment> addComment(@PathVariable Long postId, @RequestBody Comment comment, Authentication auth) {
        logger.info("Adding comment to post with ID: {}", postId);

        String email = auth.getName();
        Long userId = userService.getUserByEmail(email).getId();

        User user = userService.getUserById(userId);
        comment.setPost(postService.getPostById(postId));
        comment.setUser(user);

        Comment createdComment = commentService.addComment(comment);
        logger.info("Comment added with ID: {}", createdComment.getId());
        return ResponseEntity.ok(createdComment);
    }


    @GetMapping("/{postId}/comments")
    public List<Comment> getComments(@PathVariable Long postId) {
        logger.info("Getting comments for post with ID: {}", postId);
        List<Comment> comments = commentService.getCommentsByPostId(postId);
        logger.info("Retrieved {} comments for post ID: {}", comments.size(), postId);
        return comments;
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<ApiResponse> unlikePost(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userService.getUserByEmail(email).getId();
            postService.unlikePost(id, userId);
            logger.info("Post with ID: {} unliked successfully by user with ID: {}", id, userId);
            ApiResponse response = new ApiResponse("Post with ID: " + id + " unliked successfully", null);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException ex) {
            logger.error("Error unliking post: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, "Post not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IllegalArgumentException ex) {
            logger.error("Error unliking post: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, ex.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
        }
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<ApiResponse> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, Authentication authentication) {
        try {
            String email = authentication.getName();
            Long userId = userService.getUserByEmail(email).getId();
            commentService.deleteComment(commentId, userId);
            logger.info("Comment with ID: {} deleted successfully by user with ID: {}", commentId, userId);
            ApiResponse response = new ApiResponse("Comment with ID: " + commentId + " deleted successfully", null);
            return ResponseEntity.ok(response);
        } catch (EntityNotFoundException ex) {
            logger.error("Error deleting comment: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, "Comment not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        } catch (IllegalArgumentException ex) {
            logger.error("Error deleting comment: {}", ex.getMessage());
            ApiResponse response = new ApiResponse(null, ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
        }
    }

    @GetMapping("/{id}/isLiked")
    public ResponseEntity<Boolean> isPostLiked(@PathVariable Long id, Authentication authentication) {
        String email = authentication.getName();
        Long userId = userService.getUserByEmail(email).getId();

        boolean isLiked = postService.isPostLikedByUser(id, userId);
        return ResponseEntity.ok(isLiked);
    }

    @GetMapping("/sign-upload")
    public ResponseEntity<Map<String, Object>> getCloudinarySignature() {
        Map<String, Object> signatureData = cloudinaryService.getSignature();
        return ResponseEntity.ok(signatureData);
    }
}