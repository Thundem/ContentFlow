import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { PostProps } from './types';
import Post from './Post';
import { toast } from 'react-toastify';
import './style/UserPosts.css';

const UserPosts: React.FC = () => {
    const [posts, setPosts] = useState<PostProps[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                const response = await axiosInstance.get<PostProps[]>('/api/posts/me');
                setPosts(response.data);
            } catch (error) {
                console.error("Error fetching user posts:", error);
                toast.error("Failed to load your posts.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    if (isLoading) {
        return <div>Loading your posts...</div>;
    }

    return (
        <div className="user-posts-container">
            <h2>Your Posts</h2>
            {posts.length === 0 ? (
                <p>You haven't created any posts yet.</p>
            ) : (
                posts.map(post => (
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
            )}
        </div>
    );
};

export default UserPosts;