import { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  currentUser: null,
};

export const UserContext = createContext();

export const ACTIONS = {
  SETUSER:1
};


// Action creators
export function setUser(currentUser) {
  return { type: ACTIONS.SETUSER, currentUser };
}

// Reducer
export const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SETUSER:
      return { ...state, currentUser: action.currentUser };
    default:
      return state;
  }
}

function UserProvider(props) {
  const [userState, userDispatch] = useReducer(userReducer, initialState);
  const userData = { userState, userDispatch };
  return <UserContext.Provider value={userData} {...props} />;
}

function useUserContext() {
  return useContext(UserContext);
}

export { UserProvider, useUserContext };
