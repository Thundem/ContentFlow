import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Post from './Post';
import { PostData } from './types';

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
                    comments={post.comments}
                    userId={post.userId}
                />
            ))}
        </div>
    );
};

export default PostList;