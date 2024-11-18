package com.coursework.ContentFlow.controllers;

import com.coursework.ContentFlow.DTOs.CommentDTO;
import com.coursework.ContentFlow.DTOs.PostDTO;
import com.coursework.ContentFlow.models.Post;
import com.coursework.ContentFlow.services.CommentService;
import com.coursework.ContentFlow.services.PostService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/public/posts")
public class PublicPostController {
    private final PostService postService;
    private final CommentService commentService;
    private static final Logger logger = LoggerFactory.getLogger(PublicPostController.class);

    public PublicPostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @GetMapping
    public List<PostDTO> getAllPublicPosts() {
        logger.info("Getting all posts");
        List<Post> posts = postService.getAllPosts();
        logger.info("Retrieved {} posts", posts.size());

        List<PostDTO> postDTOs = posts.stream().map(post -> {
            PostDTO postDTO = new PostDTO();
            postDTO.setId(post.getId());
            postDTO.setMediaUrl(post.getMediaUrl());
            postDTO.setContent(post.getContent());
            postDTO.setLikes(post.getLikes().size());
            postDTO.setUserId(postService.getUserIdByPostId(post.getId()));

            List<CommentDTO> commentDTOs = post.getComments().stream().map(comment -> {
                CommentDTO commentDTO = new CommentDTO();
                commentDTO.setId(comment.getId());
                commentDTO.setText(comment.getText());
                commentDTO.setUserId(commentService.getUserIdByCommentId(comment.getId()));
                return commentDTO;
            }).toList();

            postDTO.setComments(commentDTOs);
            return postDTO;
        }).toList();

        return postDTOs;
    }
}
