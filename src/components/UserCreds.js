import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { toast } from 'react-toastify';
import { useUserContext, setUser } from '../lib/UserContext';

function UserActions({
}) {
  const { userState, userDispatch } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    if (authToken) {
        navigate('/home')
    }
    if (!authToken) {
        navigate('/login')
    }
  }, [userState?.currentUser]);

  const doSignOut = () => {
    userDispatch(setUser(null));
    sessionStorage.removeItem('Auth Token');
    navigate('/login');
  };

  const currentUser = userState?.currentUser;
  return (
    <div className="UserActions">
      {currentUser != null ?
        <>
          {currentUser?.email}
          <Button
            onClick={doSignOut}
          >
            Sign out
          </Button>
        </>
      :
        <>
          <Button onClick={() => navigate('/login')}>Sign in</Button>
          <Button onClick={() => navigate('/register')}>Register</Button>
        </>
      }
    </div>
  );
}

const UserCredsForm = ({
  action
}) => {
  const { userDispatch } = useUserContext();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const authentication = getAuth();

  const doLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
    .then((response) => {
      userDispatch(setUser(response.user));
      toast.success('Login successful for ' + response.user.email);
      sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
      navigate('/home');
    })
    .catch((error) => {
      console.log('login error', error)
      userDispatch(setUser(null));
      if(error.code === 'auth/wrong-password'){
        toast.error('Please check the Password');
      } else if(error.code === 'auth/user-not-found'){
        toast.error('Please check the Email');
      } else {
        toast.error('An error occurred during login: ' + error.code);
      }
    })
  };

  const doRegister = () => {
    createUserWithEmailAndPassword(authentication, email, password)
    .then((response) => {
      sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken)
    })
    .catch((error) => {
      console.log('registration error', error)
      if(error.code === 'auth/wrong-password'){
        toast.error('Please check the Password');
      } else if(error.code === 'auth/user-not-found'){
        toast.error('Please check the Email');
      } else if(error.code === 'auth/email-already-in-use'){
        toast.error('That email is already registered');
      } else {
        toast.error('An error occurred during registration: ' + error.code);
      }
    })
  };

  return (
    <div className="userCredsForm">
      <Box
        component="form"
        sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="email" label="Enter the Email" variant="outlined"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <br/>
        <TextField id="password" label="Enter the Password" variant="outlined"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </Box>
      {action === 'login' ?
        <Button variant="contained"
          onClick={doLogin}
        >
          Sign in
        </Button>
      : (
        action === 'register' &&
          <Button variant="contained"
            onClick={doRegister}
          >
            Register
          </Button>
      )}
    </div>
  );
};

export { UserActions, UserCredsForm };
