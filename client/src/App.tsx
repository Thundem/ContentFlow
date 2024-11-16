import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreatePost from './components/CreatePost';
import PageNotFound from './components/PageNotFound';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import ResendVerification from "./components/ResendVerification";

const App: React.FC = () => {
    return (
        <div className="App">
            <Header />
            <Routes>
                <Route path="/" element={<PostList />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/create" element={<PrivateRoute element={<CreatePost />} />} />
                <Route path="/users/:username" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/resend-verification" element={<ResendVerification />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </div>
    );
};

export default App;