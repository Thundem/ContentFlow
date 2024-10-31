import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import Login from './components/Login';
import SignUp from './components/SignUp';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
    return (
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<PrivateRoute element={<PostList />} />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<SignUp />} />
                    </Routes>
                </div>
            </Router>
    );
};

export default App;