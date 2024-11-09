package com.coursework.ContentFlow.repositories;

import com.coursework.ContentFlow.models.Like;
import com.coursework.ContentFlow.models.Post;
import com.coursework.ContentFlow.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    boolean existsByPostAndUser(Post post, User user);
    Optional<Like> findByPostAndUser(Post post, User user);
    int countByPostId(Long postId);
}