import { createContext, useReducer, useContext } from 'react';
import { getFleets } from '../lib/myFireDB';

// Initial state
const initialState = {
  fleets: {},
  currentTurnNum: null,
};

export const GameContext = createContext();

export const ACTIONS = {
  SETFLEETS:1,
  SETCURRENTTURN:2,
};

// Action creators
export function setFleets(fleets) {
  return { type: ACTIONS.SETFLEETS, fleets };
}

export function setCurrentTurn(turnNum) {
  return { type: ACTIONS.SETCURRENTTURN, turnNum };
}

// Reducer
export const gameReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SETFLEETS:
      if (Object.keys(action.fleets).length === 1) {
        // only one entry, update single branch only
        const id = Object.keys(action.fleets)[0];
        const newState = {
          ...state,
          fleets: {
            ...state.fleets,
            [id]: action.fleets[id]
          }
        };
        return newState;
      } else {
        // multiple entries, replace all
        return { ...state, fleets: action.fleets };
      }
    case ACTIONS.SETCURRENTTURN:
      return { ...state, currentTurnNum: action.turnNum };
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

export const refreshFleets = ({
  email,
  gameDispatch,
}) => {
  getFleets({
    email,
  }).then((fleets) => {
    if (fleets && Object.keys(fleets).length) {
      gameDispatch(setFleets(fleets));
    }
  }).catch((error) => {
    console.log("Error getting fleets", error);
  })
};
