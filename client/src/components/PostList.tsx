import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';

interface Comment {
    id: number;
    text: string;
}

interface PostData {
    id: number;
    title: string;
    content: string;
    likes: number;
    user: { id: number; username: string } | null;
    comments: Comment[];
    userId: number | null;
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await axios.get('http://localhost:8080/api/posts');
            setPosts(response.data);
        };
        fetchPosts();
    }, []);

    return (
        <div className="post-list">
            {posts.map(post => (
                <Post
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    likes={post.likes}
                    username={post.user ? post.user.username : 'Автор невідомий'}
                    comments={post.comments}
                    userId={post.userId}
                />
            ))}
        </div>
    );
};

export default PostList;