import { React } from 'react';
import {
  Routes,
  Route,
} from "react-router-dom";
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import Box from '@mui/material/Box';
import './lib/myFirebase';
import './App.css';
import {UserActions, UserCredsForm} from './components/UserCreds';
import Home from './components/Home';
import GameDetail from './admin/GameDetail';
import Users from './admin/Users';
import ManageNavy from './admin/ManageNavy';
import ManageFleets from './admin/ManageFleets';
import Turn from './admin/Turn';

function Footer() {
  // This part will not react to firebase auth changes
  return '';
}

function App() {
  return (
    <Box className="App">
      <UserActions />
      <Box className="Head">
        <h1>Code name: Banana ship</h1>
        <ToastContainer />
      </Box>
      <Routes>
        <Route path='/' element={<Box>This is a private application. Please log in to continue.</Box>} />
        <Route path='/login' element={<UserCredsForm action="login" />} />
        <Route path='/register' element={<UserCredsForm action="register" />} />
        <Route path='/admin/game' element={<GameDetail/>} />
        <Route path='/admin/users' element={<Users/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/users/:userId/navy' element={<ManageNavy/>} />
        <Route path='/users/:userId/fleets' element={<ManageFleets/>} />
        <Route path='/users/:userId/turn/:turnNum' element={<Turn/>} />
      </Routes>
      <Footer />
    </Box>
  );
}

export default App;
