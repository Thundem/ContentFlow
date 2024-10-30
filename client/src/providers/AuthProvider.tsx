import React, { useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        console.log('AuthProvider: token =', token);
        if (token) {
            setIsAuthenticated(true);
            console.log('AuthProvider: User is authenticated');
        } else {
            console.log('AuthProvider: No token found');
        }
        setIsLoading(false);
    }, []);

    const login = () => setIsAuthenticated(true);

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};