package com.coursework.ContentFlow.services;

import com.coursework.ContentFlow.models.Like;
import com.coursework.ContentFlow.models.Post;
import com.coursework.ContentFlow.models.User;
import com.coursework.ContentFlow.repositories.LikeRepository;
import com.coursework.ContentFlow.repositories.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final UserService userService;

    public PostService(PostRepository postRepository, LikeRepository likeRepository, UserService userService) {
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.userService = userService;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    public void likePost(Long postId, Long userId) {
        Post post = getPostById(postId);
        User user = userService.getUserById(userId);

        Like like = new Like();
        like.setPost(post);
        like.setUser(user);
        likeRepository.save(like);
    }


    public void deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
        } else {
            throw new EntityNotFoundException("Post with ID: " + id + " not found");
        }
    }

    public Post getPostById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post with ID: " + id + " not found"));
    }

    public int countLikesForPost(Long postId) {
        return likeRepository.countByPostId(postId);
    }

    public Long getUserIdByPostId(Long postId) {
        Post post = getPostById(postId);
        return post.getUser() != null ? post.getUser().getId() : null;
    }

    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    public void unlikePost(Long postId, Long userId) {
        Post post = getPostById(postId);
        User user = userService.getUserById(userId);

        Like like = likeRepository.findByPostAndUser(post, user)
                .orElseThrow(() -> new IllegalArgumentException("User has not liked this post"));

        likeRepository.delete(like);
    }

    public boolean isPostLikedByUser(Long postId, Long userId) {
        Post post = getPostById(postId);
        User user = userService.getUserById(userId);
        return likeRepository.existsByPostAndUser(post, user);
    }
}