import React, { useEffect, useState } from 'react';
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
    comments: Comment[];
    userId: number | null; 
    username: string;
}

const Post: React.FC<PostProps> = ({ id, title, content, likes, comments, userId }) => {
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState<string>(''); // Додано стан для зберігання імені користувача

    const handleUsername = async (userId: number) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/users/username/${userId}`);
            const username = response.data; // Отримуємо ім'я користувача з відповіді
            console.log('Username:', username); // Виводимо ім'я користувача в консоль
            return username; // Повертаємо ім'я користувача
        } catch (error) {
            console.error('Error fetching username:', error);
        }
    };

    useEffect(() => {
        const fetchUsername = async () => {
            if (userId) { // Перевірка, чи userId існує
                const fetchedUsername = await handleUsername(userId);
                setUsername(fetchedUsername || 'Автор невідомий'); // Оновлюємо стан з ім'ям користувача
            }
        };
        fetchUsername();
    }, [userId]); // Викликати при зміні userId

    const handleLike = async () => {
        await axios.post(`http://localhost:8080/api/posts/${id}/like?userId=${userId}`);
        alert('Post liked!');
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await axios.post(`http://localhost:8080/api/posts/${id}/comments?userId=${userId}`, { text: newComment });
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