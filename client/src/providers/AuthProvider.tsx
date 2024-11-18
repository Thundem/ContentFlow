import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { User, AuthContextType } from '../components/types/types';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsAuthenticated(true);
                console.log('AuthProvider: User is authenticated');

                try {
                    const response = await axiosInstance.get<User>('/api/users/me');
                    setUser(response.data);
                } catch (error) {
                    console.error('AuthProvider: Error fetching user data', error);
                    // Якщо помилка, видаляємо токен і встановлюємо isAuthenticated у false
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUser(null);
                    toast.error("Session expired. Please log in again.");
                    navigate("/login");
                }
            } else {
                console.log('AuthProvider: No token found');
            }
            setIsLoading(false);
        };
        fetchUserData();
    }, [navigate]);

    const login = async (token: string) => {
        try {
            localStorage.setItem('token', token);
            setIsAuthenticated(true);
            const response = await axiosInstance.get<User>('/api/users/me');
            setUser(response.data);
            toast.success("You logged into your account successfully");
            navigate("/");
        } catch (error) {
            console.error('AuthProvider: Error fetching user data during login', error);
            localStorage.removeItem('token');
            setIsAuthenticated(false);
            setUser(null);
            toast.error("Login failed. Please try again.");
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUser(null);
        toast.info("You have been logged out.");
        navigate("/login");
    };

    const updateUser = (updatedUser: Partial<User>) => {
        setUser((prevUser) => prevUser ? { ...prevUser, ...updatedUser } : prevUser);
    };

    const contextValue: AuthContextType = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout,
        updateUser,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;