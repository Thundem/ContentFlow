import React, { useEffect, useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import './style/Post.css';
import { AuthContext } from '../context/AuthContext';
import { PostProps, Comment } from './types';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { AxiosError } from 'axios';
import { toast, ToastContainer } from 'react-toastify';

const Post: React.FC<PostProps> = ({ id, mediaUrl, content, likes, comments, userId }) => {
    const [newComment, setNewComment] = useState('');
    const [username, setUsername] = useState<string>('Автор невідомий');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState<number>(likes);
    const [commentsState, setComments] = useState<Comment[]>(comments);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const { user } = useContext(AuthContext)!;
    const currentUserId = user?.id;

    useEffect(() => {
        const fetchUsername = async () => {
            if (userId) {
                try {
                    const response = await axiosInstance.get(`/api/users/username/${userId}`);
                    setUsername(response.data || 'Автор невідомий');
                } catch (error) {
                    console.error('Error fetching username:', error);
                }
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
        if (!currentUserId) {
            toast.error("Ви повинні увійти, щоб ставити лайки.");
            return;
        }

        try {
            if (isLiked) {
                await axiosInstance.post(`/api/posts/${id}/unlike`);
                setIsLiked(false);
                setLikesCount(likesCount - 1);
                toast.info('Лайк видалено!');
            } else {
                await axiosInstance.post(`/api/posts/${id}/like`);
                setIsLiked(true);
                setLikesCount(likesCount + 1);
                toast.success('Пост вподобано!');
            }
        } catch (error) {
            console.error("Error toggling like:", error);
            const axiosError = error as AxiosError;
            const errorMessage = typeof axiosError.response?.data === "string" ? axiosError.response.data : "Щось пішло не так!";
            toast.error(errorMessage);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUserId) {
            toast.error("Ви повинні увійти, щоб залишати коментарі.");
            return;
        }

        try {
            const response = await axiosInstance.post<Comment>(`/api/posts/${id}/comments`, { text: newComment });
            const newCommentData: Comment = {
                ...response.data,
                userId: currentUserId,
            };

            setComments([...commentsState, newCommentData]);
            setNewComment('');
            toast.success('Коментар додано!');
        } catch (error) {
            console.error("Error adding comment:", error);
            const axiosError = error as AxiosError;
            const errorMessage = typeof axiosError.response?.data === "string" ? axiosError.response.data : "Щось пішло не так!";
            toast.error(errorMessage);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await axiosInstance.delete(`/api/posts/${id}/comments/${commentId}`);
            setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
            toast.success('Коментар видалено!');
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error deleting comment:", axiosError);

            const errorMessage = typeof axiosError.response?.data === "string" ? axiosError.response.data : "Щось пішло не так!";
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        console.log('Current User ID:', currentUserId);
    }, [currentUserId]);

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <span className="username">{username}</span>
            </div>
            {mediaUrl && (
                <div className="post-media" onClick={openImageModal}>
                    {mediaUrl.endsWith('.mp4') ? (
                        <video controls>
                            <source src={mediaUrl} type="video/mp4" />
                            Ваш браузер не підтримує відео.
                        </video>
                    ) : (
                        <img src={mediaUrl} alt="Медіа Поста" />
                    )}
                </div>
            )}

            {isImageModalOpen && (
                <div className="image-modal" onClick={closeImageModal}>
                    <div className="image-modal-content">
                        <img src={mediaUrl} alt="Повнорозмірне зображення" className="modal-image" />
                    </div>
                </div>
            )}

            <p className="post-content">{content}</p>
            <div className="post-footer">
                <button className="comments-button" onClick={() => setIsModalOpen(true)}>
                    Коментарі ({commentsState.length})
                </button>
                <div className="like-container">
                    <button
                        onClick={handleLike}
                        style={{ background: 'none', border: 'none' }}
                    >
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
                        <h3>Коментарі:</h3>
                        <ul>
                            {commentsState.map(comment => (
                                <li key={comment.id}>
                                    <span className="comment-text">{comment.text}</span>
                                    {comment.userId === currentUserId && (
                                        <button className="delete-button" onClick={() => handleDeleteComment(comment.id)}>Видалити</button>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {currentUserId ? (
                            <form onSubmit={handleCommentSubmit} className="comment-form">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Додати коментар"
                                    required
                                />
                                <button type="submit">Надіслати</button>
                            </form>
                        ) : (
                            <p>Увійдіть, щоб залишати коментарі.</p>
                        )}
                    </div>
                </div>
            )}
            <ToastContainer />
        </div>
    );
};

export default Post;