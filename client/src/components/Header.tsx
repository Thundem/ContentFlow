import React, { useState, useEffect, useRef } from 'react';
import './/style/Header.css';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Header: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    const toggleBurgerMenu = () => {
        setIsBurgerMenuOpen((prev) => !prev);
    };

    useEffect(() => {
        setIsBurgerMenuOpen(false);
    }, [location.pathname]);

    if (isLoading) {
        return null;
    }

    return (
        <header className="header">
            <h1 className="header-title">ContentFlow</h1>
            <nav className="header-nav">
                <button
                    className="burger-menu-button"
                    onClick={toggleBurgerMenu}
                    aria-label="Toggle menu"
                    aria-expanded={isBurgerMenuOpen}
                >
                    <i className={`fas ${isBurgerMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
                </button>
                <div className={`nav-links ${isBurgerMenuOpen ? 'active' : ''}`}>
                    <Link to="/">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/posts">Posts</Link>
                            <Link to="/create">Create Post</Link>
                        </>
                    )}
                    {isAuthenticated && user ? (
                        <div className="header-user-menu" onClick={toggleDropdown} ref={menuRef}>
                            <img src={user.avatarUrl} alt="User Avatar" className="header-avatar" />
                            <span className="header-username">{user.username}</span>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to={`/users/${user.username}`}>
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                    <Link to="/settings">
                                        <i className="fas fa-cog"></i> Settings
                                    </Link>
                                    <div className="dropdown-divider"></div>
                                    <button onClick={logout} className="dropdown-logout-button">
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        location.pathname !== '/login' && (
                            <Link to="/login" className="login-button">
                                <i className="fas fa-sign-in-alt"></i> Login
                            </Link>
                        )
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;