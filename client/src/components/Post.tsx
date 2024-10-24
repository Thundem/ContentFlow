import React, { useState } from 'react';
import axios from 'axios';

interface Comment {
    id: number;
    text: string;
}

interface PostProps {
    id: number;
    title: string;
    content: string;
    likes: number;
    username: string;
    comments: Comment[];
}

const Post: React.FC<PostProps> = ({ id, title, content, likes, username, comments }) => {
    const [newComment, setNewComment] = useState('');

    const handleLike = async () => {
        await axios.post(`http://localhost:8080/api/posts/${id}/like?userId=1`); // Встановіть userId
        alert('Post liked!');
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post(`http://localhost:8080/api/posts/${id}/comments?userId=1`, { text: newComment });
        setNewComment('');
        alert('Comment added!');
    };

    return (
        <div className="post">
            <h2>{title} (by {username})</h2>
            <p>{content}</p>
            <button onClick={handleLike}>Like ({likes})</button>
            <h3>Comments:</h3>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.text}</li>
                ))}
            </ul>
            <form onSubmit={handleCommentSubmit}>
                <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default Post;
