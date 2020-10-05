import React from 'react';

import Login from './pages/Login';
import Register from './pages/Register';
import PostList from './pages/PostList';
import Post from './pages/Post';
import Write from './pages/Write';

import logo from './logo.svg';
import './App.css';
import { Route } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Route component={Login} path="/login" />
      <Route component={Register} path="/register" />
      <Route component={PostList} path={['/@:username', '/']} exact />
      <Route component={Post} path="/@:username/:postId" />
      <Route component={Write} path="/write" />
    </>
  );
};

export default App;
