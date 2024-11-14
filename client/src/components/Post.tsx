import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import './style/Post.css';
import { AuthContext } from '../context/AuthContext';
import { PostProps, Comment } from './types';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

const Post: React.FC<PostProps> = ({ id, mediaUrl, content, likes, comments, userId }) => {
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(likes);
    const [commentsState, setComments] = useState<Comment[]>(comments);

    const { user } = useContext(AuthContext)!;
    const currentUserId = user?.id;

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

    useEffect(() => {
        const checkIfLiked = async () => {
            if (!currentUserId) {
                setIsLiked(false);
                return;
            }
            try {
                const response = await axiosInstance.get(`/api/posts/${id}/isLiked`);
                setIsLiked(response.data);
            } catch (error) {
                console.error("Error checking if post is liked:", error);
            }
        };
        checkIfLiked();
    }, [currentUserId, id]);    

    const handleLike = async () => {
        console.log('handleLike called');
        console.log('Axios request config:', {
            url: `/api/posts/${id}/like`,
            method: 'post',
            headers: axiosInstance.defaults.headers,
        });
        
        console.log('user:', user);
        if (!currentUserId) {
            toast.error("You must be logged in to like a post.");
            return;
        }

    
        try {
            console.log('Before axios request');
            if (isLiked) {
                console.log('Sending unlike request');
                await axiosInstance.post(`/api/posts/${id}/unlike`);
                console.log('Unlike request completed');
                setIsLiked(false);
                setLikesCount(likesCount - 1);
                toast.info('Post unliked!');
            } else {
                console.log('Sending like request');
                await axiosInstance.post(`/api/posts/${id}/like`);
                console.log('Like request completed');
                setIsLiked(true);
                setLikesCount(likesCount + 1);
                toast.success('Post liked!');
            }
            console.log('After axios request');
        } catch (error) {
            console.error("Error toggling like:", error);
            const axiosError = error as AxiosError;
            const errorMessage =
                typeof axiosError.response?.data === "string"
                    ? axiosError.response.data
                    : "Something went wrong!";
            toast.error(errorMessage);
        }
    };    

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('handleCommentSubmit called');
        if (!currentUserId) {
            toast.error("You must be logged in to comment.");
            return;
        }
        try {
            console.log('Before axios request');
            const response = await axiosInstance.post<Comment>(`/api/posts/${id}/comments`, { text: newComment });
            console.log('Axios request completed', response);
            setComments([...commentsState, response.data]);
            setNewComment('');
            toast.success('Comment added!');
            console.log('After axios request');
        } catch (error) {
            console.error("Error adding comment:", error);
            const axiosError = error as AxiosError;
            const errorMessage =
                typeof axiosError.response?.data === "string"
                    ? axiosError.response.data
                    : "Something went wrong!";
            toast.error(errorMessage);
        }
    };    

    const handleDeleteComment = async (commentId: number) => {
        try {
            await axiosInstance.delete(`/api/posts/${id}/comments/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            toast.success('Comment deleted!');
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error deleting comment:", axiosError);

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
                        <img src={mediaUrl} alt="Post media" />
                    )}
                </div>
            )}
            <p className="post-content">{content}</p>
            <div className="post-footer">
                <button className="comments-button" onClick={() => setIsModalOpen(true)}>
                    Comments ({commentsState.length})
                </button>
                <div className="like-container">
                <button onClick={handleLike} style={{ background: 'none', border: 'none' }}>
                    {isLiked ? (
                        <FaHeart style={{ color: 'red', width: '24px', height: '24px' }} />
                    ) : (
                        <FaRegHeart style={{ color: 'var(--main-color)', width: '24px', height: '24px' }} />
                    )}
                </button>
                    <span className="likes-count">{likesCount}</span>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span>
                        <h3>Comments:</h3>
                        <ul>
                            {commentsState.map(comment => (
                                <li key={comment.id}>
                                    {comment.text}
                                    {comment.userId === currentUserId && (
                                        <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                                    )}
                                </li>
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