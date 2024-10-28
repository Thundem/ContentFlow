import React, { useEffect, useState } from "react";
import axios from "axios";
import Post from "./Post";
import { PostData } from "./types";
import "./style/PostList.css";

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/posts");
                if (Array.isArray(response.data)) {
                    setPosts(response.data);
                } else {
                    console.error("Expected an array but received:", response.data);
                    setPosts([]);
                }
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]);
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="post-list-container">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <Post
                        key={post.id}
                        id={post.id}
                        mediaUrl={post.mediaUrl}
                        content={post.content}
                        likes={post.likes}
                        comments={post.comments}
                        userId={post.userId}
                    />
                ))
            ) : (
                <p>No posts available</p>
            )}
        </div>
    );
};

export default PostList;