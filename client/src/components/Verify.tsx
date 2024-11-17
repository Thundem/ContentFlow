import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './style/Verify.module.css';
import { AxiosError } from 'axios';

const Verify: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');
  console.log(token);

  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/api/auth/verify?token=${token}`);
          setMessage(response.data);
          setError(null);
          toast.success("Your email has been successfully verified!");
        } catch (err) {
          if (err instanceof AxiosError) {
            setMessage('');
            setError('The verification token is invalid or expired.');
            toast.error(err.response?.data || 'An error occurred during verification.');
          } else {
            setMessage('');
            setError('An unexpected error occurred.');
            toast.error('An unexpected error occurred.');
          }
        } finally {
          setLoading(false);
        }
      };

      verifyEmail();
    } else {
      setError('No verification token found.');
      setLoading(false);
      toast.error('No verification token found.');
    }
  }, [token]);

  if (loading) {
    return <div className={styles.loading}>Verifying...</div>;
  }

  return (
    <div className={styles.container}>
      <h2>Email Verification</h2>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <div className={styles.success}>{message}</div>
      )}
      <button className={styles.button} onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  );
};

export default Verify;