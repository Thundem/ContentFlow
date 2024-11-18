import React, { useState, useEffect, useRef } from 'react';
import './style/Header.css';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import manAvatar from './img/manAvatar.png';
import womanAvatar from './img/womanAvatar.png';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const Header: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const isPWAInstalled = (): boolean => {
        return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
    };

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

    useEffect(() => {
        const handler = (e: Event) => {
            const event = e as BeforeInstallPromptEvent;
            event.preventDefault();
            setDeferredPrompt(event);
            setShowInstallButton(true);
        };

        window.addEventListener('beforeinstallprompt', handler as EventListener);

        if (!isPWAInstalled()) {
            const timer = setTimeout(() => {
                if (!isPWAInstalled() && !deferredPrompt) {
                    setShowInstallButton(true);
                }
            }, 3000);

            return () => clearTimeout(timer);
        } else {
            setShowInstallButton(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handler as EventListener);
        };
    }, [deferredPrompt]);

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

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            setDeferredPrompt(null);
            setShowInstallButton(false);
        });
    };

    const handleDismissClick = () => {
        setShowInstallButton(false);
    };

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
                            <img
                                src={
                                    user.avatarUrl
                                        ? user.avatarUrl
                                        : user.gender === 'MALE'
                                        ? manAvatar
                                        : womanAvatar
                                }
                                alt="User Avatar"
                                className="header-avatar"
                            />
                            <span className="header-username">{user.username}</span>
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to={`/users/${user.username}`}>
                                        <i className="fas fa-user"></i> Profile
                                    </Link>
                                    <Link to="/settings">
                                        <i className="fas fa-cog"></i> Settings
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link to="/admin-panel">
                                            <i className="fas fa-user-shield"></i>Admin Panel
                                        </Link>
                                    )}
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
            {showInstallButton && (
                <>
                    <div className="overlay show" onClick={handleDismissClick}></div>
                    <div className={`install-banner show`}>
                        <span>Install our app for a better experience!</span>
                        <div className="install-buttons-container">
                            <button onClick={handleInstallClick} aria-label="Install App">Install</button>
                            <button onClick={handleDismissClick} aria-label="Dismiss Install Prompt">Dismiss</button>
                        </div>
                    </div>
                </>
            )}
        </header>
    );
};

export default Header;