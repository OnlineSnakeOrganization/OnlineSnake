//Dieser Code rendert das Spiel
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
//import App from "../App"; // Snake game logic

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {inGame, endGame} = useGame();

  // Check if the client is allowed to open /game
  useEffect(() => {
    if (!inGame) {
      navigate("/");
    }
  }, [inGame, navigate]);

  return (
    <div>
      <h1>Here Be Game</h1>
      <button onClick={() => {
        endGame();
        navigate("/");
      }}>Back to Main</button>
    </div>
  );
  //<App /> {/* Embeds the Snake game */}
};

export default GamePage;