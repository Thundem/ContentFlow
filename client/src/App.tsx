import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import Login from './components/Login';
import SignUp from './components/SignUp';
// import About from './components/About'; // Приклад іншої сторінки

const App: React.FC = () => {
    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="/" element={<PostList />} /> 
                    <Route path="/login" element={<Login />} /> 
                    <Route path="/signup" element={<SignUp />} /> 
                    {/* <Route path="/about" element={<About />} /> */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;