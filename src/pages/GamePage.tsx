//Dieser Code rendert das Spiel
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {inGame, endGame} = useGame();
  const rows = 20;     // Number of rows
  const columns = 20;  // Number of columns
  const blockWidth: number = 25;
  const blockHeight: number = 25;

  // blocks is a 2d array of (you guessed it) blocks
  const [blocks, setBlocks] = useState(
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => (
        {
          key: `${row}-${col}`,
          color: "black",
        }))
    ));

  // Before rendering on the screen, check if the client is allowed to be on '/game'
  useEffect(() => {
    if (!inGame) {
      navigate("/");
    }
    setBlocks(blocks);  //Useless call but I have to use setBlocks atleast once
  }, [blocks, inGame, navigate]);
  
  const setBlockColor = (row: number, column: number, newColor: string) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((rowArray, r) =>
        r === row
          ? rowArray.map((block, c) =>
              c === column ? { ...block, color: newColor } : block
            )
          : rowArray
      )
    );
    blocks[row][column].color = newColor;
  };

  // Return an Array of div's from the blocks which are then used to render the map
  const renderBoard = () => {
    return blocks.flat().map(({ key, color }, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;
      return (
        <>
          <div
            key={key}
            className={"block"}
            style={{ backgroundColor: color,
              width: blockWidth,
              height: blockHeight,
              background: "#000000",
              border: "0.5px solid rgba(255, 255, 255, 0.077)"}}
            onMouseEnter={() => {
              setBlockColor(row, column, "green");
            }}
            //onMouseLeave={() => {
            //  setBlockColor(row, column, "blue");
            //}}
            onClick={()=>{
              setBlockColor(row, column, "red");
            }}
          />
        </>
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
          endGame();
          navigate("/");
        }}>Back to Main</button>
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