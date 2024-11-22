import React, { useState, useEffect, useRef } from 'react';
import './style/Header.css';
import { useAuth } from '../hooks/useAuth';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import manAvatar from './img/manAvatar.png';
import womanAvatar from './img/womanAvatar.png';
import { toast } from "react-toastify";
import { getBrowser } from '../utils/browser';

const Header: React.FC = () => {
    const { isAuthenticated, isLoading, user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isBurgerMenuOpen, setIsBurgerMenuOpen] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [manualInstallInstructions, setManualInstallInstructions] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const browser = getBrowser();

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
        if (browser === 'Chrome') {
            const handler = (e: BeforeInstallPromptEvent) => {
                console.log('beforeinstallprompt event fired');
                e.preventDefault();
                setDeferredPrompt(e);
                const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as NavigatorExtended).standalone === true;
                console.log('Is app installed:', isInstalled);

                if (!isInstalled) {
                    setShowInstallButton(true);
                    console.log('Showing install button');
                } else {
                    console.log('App is already installed, not showing install button');
                }
            };

            window.addEventListener('beforeinstallprompt', handler);

            return () => {
                window.removeEventListener('beforeinstallprompt', handler);
            };
        } else {
            const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as NavigatorExtended).standalone === true;
            if (!isInstalled) {
                setManualInstallInstructions(true);
            }
        }
    }, [browser]);

    useEffect(() => {
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as NavigatorExtended).standalone === true;
        console.log('Initial install check, isInstalled:', isInstalled);
        if (isInstalled) {
            setShowInstallButton(false);
            setManualInstallInstructions(false);
            console.log('App is installed on mount, hiding install button');
        }
    }, []);

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
        if (!deferredPrompt) {
            console.log('No deferred prompt available');
            return;
        }
        console.log('Prompting user to install PWA');
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
                toast.success("Додаток успішно встановлено!");
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            setDeferredPrompt(null);
            setShowInstallButton(false);
        });
    };

    const handleDismissClick = () => {
        setShowInstallButton(false);
        setManualInstallInstructions(false);
        console.log('User dismissed the install banner');
    };

    const renderManualInstallInstructions = () => {
        if (browser === 'Firefox') {
            return (
                <div className="install-banner show">
                    <span>Щоб встановити додаток, натисніть кнопку меню та виберіть "Додати до домашнього екрану".</span>
                    <button onClick={handleDismissClick}>Закрити</button>
                </div>
            );
        } else if (browser === 'Safari') {
            return (
                <div className="install-banner show">
                    <span>Щоб встановити додаток, натисніть кнопку "Поділитися" та виберіть "Додати на головний екран".</span>
                    <button onClick={handleDismissClick}>Закрити</button>
                </div>
            );
        } else {
            return (
                <div className="install-banner show">
                    <span>Щоб встановити додаток, скористайтеся меню вашого браузера та виберіть "Додати на головний екран" або подібну опцію.</span>
                    <button onClick={handleDismissClick}>Закрити</button>
                </div>
            );
        }
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
                                            <i className="fas fa-user-shield"></i> Admin Panel
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
            {/* Install Prompt for Chrome */}
            {showInstallButton && browser === 'Chrome' && (
                <>
                    <div className="overlay show" onClick={handleDismissClick}></div>
                    <div className={`install-banner show`}>
                        <span>Встановіть наш додаток для кращого досвіду!</span>
                        <div className='install-buttons-container'>
                            <button onClick={handleInstallClick}>Встановити</button>
                            <button onClick={handleDismissClick}>Закрити</button>
                        </div>
                    </div>
                </>
            )}
            {manualInstallInstructions && (browser === 'Firefox' || browser === 'Safari' || browser === 'Other') && (
                <>
                    <div className="overlay show" onClick={handleDismissClick}></div>
                    {renderManualInstallInstructions()}
                </>
            )}
        </header>
    );
};

export default Header;