import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import './style/Post.css';
import { AuthContext } from '../context/AuthContext';
import { PostProps } from './types';
import { CiHeart } from "react-icons/ci";
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const Post: React.FC<PostProps> = ({ id, mediaUrl, content, likes, comments, userId }) => {
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const { user } = useContext(AuthContext)!;
    const currentUserId = user?.id;

    const borderColor = isLiked ? 'red' : 'var(--main-color)';

    const handleUsername = async (userId: number) => {
        try {
          const response = await axiosInstance.get(`/api/users/username/${userId}`);
          return response.data;
        } catch (error) {
          console.error('Error fetching username:', error);
        }
    };

    useEffect(() => {
        const fetchUsername = async () => {
            if (userId) {
                const fetchedUsername = await handleUsername(userId);
                setUsername(fetchedUsername || 'Автор невідомий');
            }
        };
        fetchUsername();
    }, [userId]);

    const handleLike = async () => {
        if (!currentUserId) {
            toast.error("You must be logged in to like a post.");
            return;
        }
        try {
            await axiosInstance.post(`/api/posts/${id}/like`, null, { params: { userId: currentUserId } });
            setIsLiked(true);
            toast.success('Post liked!');
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error liking post:", axiosError);

            const errorMessage =
                typeof axiosError.response?.data === "string"
                    ? axiosError.response.data
                    : "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            toast.error("You must be logged in to comment.");
            return;
        }
        try {
            await axiosInstance.post(`/api/posts/${id}/comments`, { text: newComment }, { params: { userId: currentUserId } });
            setNewComment('');
            toast.success('Comment added!');
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error adding comment:", axiosError);

            const errorMessage =
                typeof axiosError.response?.data === "string"
                    ? axiosError.response.data
                    : "Something went wrong!";
            toast.error(errorMessage);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <span className="username">{username}</span>
            </div>
            {mediaUrl && (
                <div className="post-media">
                    {mediaUrl.endsWith('.mp4') ? (
                        <video controls>
                            <source src={mediaUrl} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <img src={mediaUrl} alt="Post media" className="post-media" />
                    )}
                </div>
            )}
            <p className="post-content">{content}</p>
            <div className="post-footer">
                <button className="comments-button" onClick={() => setIsModalOpen(true)}>
                    Comments ({comments.length})
                </button>
                <div className="like-container">
                    <button onClick={handleLike} style={{ background: 'none', border: 'none' }}>
                        <CiHeart style={{ fill: isLiked ? 'red' : 'none', stroke: borderColor, strokeWidth: '2', width: '24px', height: '24px' }} />
                    </button>
                    <span className="likes-count">{likes}</span>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>Comments:</h3>
                        <ul>
                            {comments.map(comment => (
                                <li key={comment.id}>{comment.text}</li>
                            ))}
                        </ul>
                        <form onSubmit={handleCommentSubmit} className="comment-form">
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
                </div>
            )}
        </div>
    );
};

export default Post;