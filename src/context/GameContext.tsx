// src/context/GameContext.tsx

import React, { createContext, useContext, useState, ReactNode } from "react";

// GameContext variables and the methods to change thier value
type GameState = {
  inGame: boolean;            //true if inGame, false if not
  loadGame: () => void;       //Sets inGame to true.
  endGame: () => void;        //Sets inGame to false.
};

// Define the type for the GameProvider props (with children)
interface GameProviderProps {
  children: ReactNode; // children can be anything that React can render
} 

// Create the context
export const GameContext = createContext<GameState>({
  inGame: false,
  loadGame: () => {},
  endGame: () => {}
});

// Create a provider component to make the state available
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [inGame, setInGame] = useState(false);

  const setInGameToTrue = () => {
    setInGame(true);
  };

  const setInGameToFalse = () => {
    setInGame(false);
  };

  return (
    <GameContext.Provider value={{ inGame: inGame, loadGame: setInGameToTrue, endGame: setInGameToFalse }}>
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
