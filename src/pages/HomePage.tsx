import React, { useEffect } from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/stars.css';

const HomePage: React.FC = () => {
  const { loadGame: startGame } = useGame();
  const navigate = useNavigate();

  useEffect(() => {
    // JavaScript Code von CodePen hier einfügen, falls erforderlich
  }, []);

  return (
    <>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
      <div className="leaderboard left">
        <h3>Local Highscores</h3>
      </div>
      <div className="container">
        <h1 className="title">Online-Snake</h1>
        <div className="input-container">
          <input type="text" placeholder="Insert your name" id="playerName"></input>
        </div>
        <button onClick={() => {
          startGame();      // Sets the ingame variable to true
          navigate("/game") // Loads the game page
        }}>Singleplayer</button>
        <button onClick={() => { }}>Multiplayer</button>
      </div>
      <div className="leaderboard right">
        <h3>Global Highscores</h3>
      </div>
    </>
  );
};

export default HomePage;