//Dieser Code ist zur realisierung der gesamten Hauptseite. 
import React from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import '../css/home.css';

const HomePage: React.FC = () => {
  const {startGame: startGame} = useGame();
  const navigate = useNavigate()

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Welcome to Snake Game🐍</h1>
      <p>Schnek</p>
      <button onClick={() => {
        startGame();      //Sets the ingame variable to true
        navigate("/game") //Loads the game page
      }}>Start Game</button>
    </div>
  );
};

export default HomePage;

/*
Die css Datei, die im Moment quasi überall geladen ist, wird in main.tsx importiert. Das ist die 'index.css' file.
Wenn ihr jetzt custom machen wollt (Mit Sterne Parallaxe und so xd) Dann macht einfach eine neue css "home.css" und schreibt da rein und
importiert diese in diesem Skript.
*/