//Dieser Code rendert das Spiel
import React from "react";
import { useNavigate } from "react-router-dom";
import App from "../App"; // Snake game logic

const Game: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/")}>Back to Main</button>
      <App /> {/* Embeds the Snake game */}
    </div>
  );
};

export default Game;