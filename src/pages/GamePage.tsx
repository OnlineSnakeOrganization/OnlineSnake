//Dieser Code rendert das Spiel
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';
import SinglePlayerLogic from "../game/SinglePlayerLogic";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {inGame, endGame} = useContext(GameContext);
  const rows = 15;     // Number of rows
  const columns = 15;  // Number of columns
  const blockWidth: number = 30;
  const blockHeight: number = 30;
  const [currentSnakeLength, setCurrentSnakeLength] = useState(1);
  const [playTime, setPlayTime] = useState("")
  

  // blocks is a 2d array of (you guessed it) blocks
  const [blocks, setBlocks] = useState(
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => (
        {
          key: `${row}-${col}`,
          color: "black"
        }))
    ));

  const [logic] = useState(new SinglePlayerLogic(rows, columns, false, setBlockColor, clearBoard, setCurrentSnakeLength, setPlayTime));

  // Before rendering on the screen, check if the client is allowed to be on '/game'
  useEffect(() => {
    if (!inGame) {
      navigate("/");
    }else{
      logic.start();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //Leave empty so this method only gets invoked once.

  function clearBoard(){  //Resets all blocks colors.
    setBlocks(
      Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, col) => (
          {
            key: `${row}-${col}`,
            color: "black",
          }))
      ));
  }

  function setBlockColor(column: number, row: number, newColor: string) {
    setBlocks((prevBlocksArray) =>
      prevBlocksArray.map((rowArray, r) =>
        r === row
          ? rowArray.map((block, c) =>
              c === column ? { ...block, color: newColor } : block
            )
          : rowArray
      )
    );
  };

  // Return an Array of div's from the blocks which are then used to render the map
  const renderBoard = () => {
    return blocks.flat().map(({ key, color }) => {
      //const row = Math.floor(index / columns);
      //const column = index % columns;
      return (
          <div
            key={key}
            className={"block"}
            style={{ 
              backgroundColor: color,
              width: blockWidth,
              height: blockHeight,
              //border: "0.5px solid rgba(255, 255, 255, 0.077)"
            }}
          />
      );
    });
  };

  return (
    <>
    <div id="stars"></div>
    <div id="stars2"></div>
    <div id="stars3"></div>
    <div id="stars4"></div>
      <div>
        <button onClick={() => {
          logic.stopGame();
          endGame();
          navigate("/");
        }}>Back to Main</button>
        <p>Length: {currentSnakeLength}</p>
        <p>Time: {playTime}</p>
      </div>
      <div className="gameMap" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${blockWidth}px)`, // Dynamically set columns
        gridTemplateRows: `repeat(${rows}, ${blockHeight}px)`, // Dynamically set rows
        width: `${columns * blockWidth}px`, // Adjust width based on columns
        height: `${rows * blockHeight}px`, // Adjust height based on rows
      }}>
        {renderBoard() //Insert the gameboard
          }
      </div>
    </>
    
  );
  //<App /> {/* Embeds the Snake game */}
};

export default GamePage;