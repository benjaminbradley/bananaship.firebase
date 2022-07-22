import React from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import './lib/myFirebase';
import './App.css';
import {UserActions, UserCredsForm} from './components/UserCreds';
import Home from './components/Home';

function Footer() {
  return <div className='Footer'>This part will not react to firebase auth changes</div>;
}

function App() {
  return (
    <div className="App">
      <UserActions />
      <div className="Head">
        <h1>Code name: Banana ship</h1>
        <ToastContainer />
      </div>
      <Routes>
        <Route path='/' element={<div>This is a private application. Please log in to continue.</div>} />
        <Route path='/login' element={<UserCredsForm action="login" />} />
        <Route path='/register' element={<UserCredsForm action="register" />} />
        <Route path='/home' element={<Home/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
