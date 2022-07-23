import { React, useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import './lib/myFirebase';
import { useUserContext } from './lib/UserContext';
import './App.css';
import {UserActions, UserCredsForm} from './components/UserCreds';
import Home from './components/Home';
import Users from './admin/Users';
import ManageNavy from './admin/ManageNavy';

function Footer() {
  return <div className='Footer'>This part will not react to firebase auth changes</div>;
}

function App() {
  const { userState } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    console.log("TRACE: App.useEffect([]): location.pathname", location.pathname);
    if (!userState?.currentUser) {
      navigate('/login');
    }
  }, []);

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
        <Route path='/admin/users' element={<Users/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/admin/users/:userId/navy' element={<ManageNavy/>} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
