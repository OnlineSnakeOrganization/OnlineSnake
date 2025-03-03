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
const GameContext = createContext<GameState | undefined>(undefined);

// Create a provider component to make the state available
export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const [isInGame, setIsInGame] = useState(false);

  const loadGame = () => {
    setIsInGame(true);
  };

  const endGame = () => {
    setIsInGame(false);
  };

  return (
    <GameContext.Provider value={{ inGame: isInGame, loadGame: loadGame, endGame }}>
      {children} {/* Render the children passed to this provider */}
    </GameContext.Provider>
  );
};

// Custom hook to access the GameContext variables and methods
// eslint-disable-next-line react-refresh/only-export-components
export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("To call 'useGame', you must be within a GameProvider");
  }
  return context;
};
