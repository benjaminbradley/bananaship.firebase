import { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  fleets: {},
};

export const GameContext = createContext();

export const ACTIONS = {
  SETFLEETS:1,
};


// Action creators
export function setFleets(fleets) {
  return { type: ACTIONS.SETFLEETS, fleets };
}

// Reducer
export const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SETFLEETS:
      return { ...state, fleets: action.fleets };
    default:
      return state;
  }
}

function GameProvider(props) {
  const [gameState, gameDispatch] = useReducer(gameReducer, initialState);
  const gameData = { gameState, gameDispatch };
  return <GameContext.Provider value={gameData} {...props} />;
}

function useGameContext() {
  return useContext(GameContext);
}

export { GameProvider, useGameContext };
