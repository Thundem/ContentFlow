import React from 'react';
import './style/header.css';
import { useAuth } from '../hooks/useAuth';

const Header: React.FC = () => {

    const { isAuthenticated, isLoading, logout } = useAuth();
    console.log('Header: isAuthenticated =', isAuthenticated, ', isLoading =', isLoading);

    if (isLoading) {
        return null;
    }
    
    return (
        <header className="header">
            <h1 className="header-title">ContentFlow</h1>
            <nav className="header-nav">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/posts">Posts</a>
                {isAuthenticated && (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}
            </nav>
        </header>
    );
};

export default Header;
