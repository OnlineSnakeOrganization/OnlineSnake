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
        <h1 className="title">Snake</h1>
        <h2 className="subtitle">Online</h2>
        <div className="input-container">
          <input type="text" placeholder="Dein Name" id="playerName"></input>
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

/*
Die css Datei, die im Moment quasi überall geladen ist, wird in main.tsx importiert. Das ist die 'index.css' file.
Wenn ihr jetzt custom machen wollt (Mit Sterne Parallaxe und so xd) Dann macht einfach eine neue css "home.css" und schreibt da rein und
importiert diese in diesem Skript.
*/