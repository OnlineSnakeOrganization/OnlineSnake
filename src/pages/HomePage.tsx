//Dieser Code ist zur realisierung der gesamten Hauptseite. 
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {startGame} = useGame();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to Snake Game🐍</h1>
      <p>Schnek</p>
      <button onClick={() => {
        startGame();
        navigate("/game");
      }}>Start Game</button>
    </div>
  );
};

export default HomePage;