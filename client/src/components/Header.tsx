import React from 'react';
import './style/header.css';

const Header: React.FC = () => {
    return (
        <header className="header">
            <h1 className="header-title">ContentFlow</h1>
            <nav className="header-nav">
                <a href="/">Home</a>
                <a href="/about">About</a>
                <a href="/posts">Posts</a>
            </nav>
        </header>
    );
};

export default Header;
