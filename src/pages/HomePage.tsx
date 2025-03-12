//Dieser Code ist zur realisierung der gesamten Hauptseite. 
import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import '../css/home.css';

const HomePage: React.FC = () => {
  const {loadGame: startGame} = useGame();
  const navigate = useNavigate()

  return (
    <>
    <div className="leaderboard left">
        <h3>Local Highscores</h3>
    </div>
    <div className="container">
        <h1 className="title">Online-Snake</h1>
        <div className="input-container">
          <input type="text" placeholder="Insert your name" id="playerName"></input>
        </div>
        <button onClick={() => {
        startGame();      //Sets the ingame variable to true
        navigate("/game") //Loads the game page
      }}>Singleplayer</button>
        <button onClick={()=>{}}>Multiplayer</button>
    </div>
    <div className="leaderboard right">
        <h3>Global Highscores</h3>
    </div>
    </>
  );
};

export default HomePage;
