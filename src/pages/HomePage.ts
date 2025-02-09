//Dieser Code ist zur realisierung der gesamten Hauptseite. 
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to Snake Game</h1>
      <p>Click the button below to start the game!</p>
      <button onClick={() => navigate("/game")}>Start Game</button>
    </div>
  );
};

export default Home;