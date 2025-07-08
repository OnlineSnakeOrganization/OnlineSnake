// src/context/GameContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

type GameMode = "SinglePlayer" | "MultiPlayer"

// GameContext variables and the methods to change thier value
// They are basically global variables
type GameState = {
  playerName: string; //playerName is stored in the local storage (localStorage.getItem('playerName') || 'Unknown';)
  setPlayerName: (playerName: string) => void;
  inGame: boolean;            //true if inGame, false if not
  gameMode: GameMode;         //true if singleplayer, false if multiplayer
  ws: WebSocket | undefined;              //The WebSocket Object if multiplayer is played (gameMode === false)
  setWsObject: (ws: WebSocket | undefined) => void;
  loadGame: () => void;       //Sets inGame to true.
  endGame: () => void;        //Sets inGame to false.
  setMode: (mode: GameMode) => void;
};


// Define the type for the GameProvider props (with children)
interface GameProviderProps {
  children: ReactNode; // children can be anything that React can render
} 

// Create the context
export const GameContext = createContext<GameState>({
  playerName: "",
  setPlayerName: () => {},

  inGame: false,
  loadGame: () => {},
  endGame: () => {},
  
  gameMode: "SinglePlayer",
  setMode: () => {},
  
  ws: undefined,
  setWsObject: () => {}
});

// Create a provider component to make the state available
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [inGame_, setInGame] = useState(false);
  const [gameMode_, setMode_] = useState<GameMode>("SinglePlayer")
  const [ws_, setWsObject_] = useState<WebSocket | undefined>(undefined);
  const [playerName_, setPlayerName_] = useState<string>(""); //Put validation here?

  const setInGameToTrue = () => {
    setInGame(true);
  };

  const setInGameToFalse = () => {
    setInGame(false);
  };

  const setMode = (mode: GameMode) =>{
    setMode_(mode);
  }

  const setWsObject = (ws: WebSocket | undefined) => {
    setWsObject_(ws);
  }

  const setPlayerName = (playerName: string) => {
    setPlayerName_(playerName);
  }

  return (
    <GameContext.Provider value={{
      playerName: playerName_,
      setPlayerName: setPlayerName,

      inGame: inGame_,
      loadGame: setInGameToTrue,
      endGame: setInGameToFalse,

      gameMode: gameMode_,
      setMode: setMode,

      ws: ws_,
      setWsObject: setWsObject,
      }}>
      {children} {/* Render the children passed to this provider */}
    </GameContext.Provider>
  );
};

// Custom hook to access the GameContext variables and methods
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("To call 'useGame', you must be within a GameProvider");
  }
  return context;
};