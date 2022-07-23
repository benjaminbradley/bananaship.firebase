import { React, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleIcon from '@mui/icons-material/People';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import { toast } from 'react-toastify';
import { auth } from '../lib/myFirebase';
import { useUserContext, setUser, setAdmin } from '../lib/UserContext';
import { updateUser } from '../lib/myFireDB';

function UserActions() {
  const { userState, userDispatch } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        sessionStorage.setItem('Auth Token', user.stsTokenManager.refreshToken);
        userDispatch(setUser(user));
        updateUser({
          user: user,
          userInfo: user.metadata,
        });
      }
    });
  }, []);

  useEffect(() => {
    let authToken = sessionStorage.getItem('Auth Token')
    if (!authToken) {
        navigate('/login')
    }
    if (userState?.currentUser) {
      userState.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        // Check if the user is an Admin.
        if (idTokenResult?.claims?.admin) {
          userDispatch(setAdmin(true));
        }
      });
    }
  }, [userState?.currentUser]);

  const doSignOut = () => {
    signOut(auth)
    .then(() => {
      userDispatch(setUser(null));
      sessionStorage.removeItem('Auth Token');
      navigate('/login');
    })
    .catch((err) => {
      toast.error(err.message);
    });
  };

  const currentUser = userState?.currentUser;
  return (
    <div className="UserActions">
      <div className="navMenu">
        <IconButton onClick={(e) => navigate('/')}>
          <RocketLaunchIcon/>
        </IconButton>
        {currentUser &&
          <>
            <Button
              onClick={() => navigate('/home')}
              startIcon={<HomeIcon/>}
            >Home</Button>
          </>
        }

        {userState?.admin &&
          <>
            [ADMIN]
            <Button
              onClick={() => navigate('/admin/users')}
              startIcon={<PeopleIcon/>}
            >Manage Users</Button>
          </>
        }
      </div>
      <div className="userMenu">
        {currentUser != null ?
          <>
            {currentUser?.email}
            <Button
              onClick={doSignOut}
              endIcon={<LogoutIcon/>}
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
    </div>
  );
}

const UserCredsForm = ({
  action
}) => {
  const { userState, userDispatch } = useUserContext();
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const authentication = getAuth();

  useEffect(() => {
    if (userState?.currentUser) {
      console.log("DEBUG: already logged in");
      navigate('/home');
    }
  }, []);

  const loginSuccess = (response, message) => {
    sessionStorage.setItem('Auth Token', response._tokenResponse.refreshToken);
    userDispatch(setUser(response.user));
    updateUser({
      user: response.user,
      userInfo: response.user.metadata,
    });
    toast.success(message);
    navigate('/home');
};

  const doLogin = () => {
    signInWithEmailAndPassword(authentication, email, password)
    .then((response) => {
      loginSuccess(response, 'Login successful for ' + response.user.email);
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
      loginSuccess(response, 'Registration & login successful for ' + response.user.email);
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
