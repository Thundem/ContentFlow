import React from 'react';
import Header from './components/Header';
import PostList from './components/PostList';

const App: React.FC = () => {
    return (
        <div className="App">
            <Header />
            <PostList />
        </div>
    );
};

export default App;
