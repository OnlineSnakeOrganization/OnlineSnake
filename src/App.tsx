import React from "react";
import { Routes, Route } from "react-router-dom";
import GamePage from "./pages/GamePage";
import HomePage from "./pages/HomePage";
import { GameProvider } from "./context/GameContext";

const App: React.FC = () => {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<GamePage />} />
      </Routes>
    </GameProvider>
  );
};

export default App;
