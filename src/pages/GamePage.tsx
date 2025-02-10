//Dieser Code rendert das Spiel
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import '../css/game.css';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {inGame, endGame} = useGame();

  // Before rendering on the screen, check if the client is allowed to be on '/game'
  useEffect(() => {
    console.log("HELP: " + inGame)
    if (!inGame) {
      navigate("/");
      console.log("INSIDE: " + inGame)
    }
  }, [inGame, navigate]);

  const rows = 8;     // Number of rows
  const columns = 8;  // Number of columns

  // Generate an Array of blocks which are then used to render the map
  const renderBoard = () => {
    const gameMap = [];
    for (let row: number = 0; row < rows; row++) {
      for (let column: number = 0; column < columns; column++) {
        // Add the blocks to the array
        //const color: string = "123456";
        gameMap.push(<div key={`${row}-${column}`} className={`block`} />);
      }
    }
    return gameMap;
  };

  return (
    <>
      <div>
        <h1>Here Be Game</h1>
        <button onClick={() => {
          endGame();
          navigate("/");
        }}>Back to Main</button>
      </div>
      <div className="gameMap">
      {renderBoard()}
      </div>
    </>
    
  );
  //<App /> {/* Embeds the Snake game */}
};

export default GamePage;