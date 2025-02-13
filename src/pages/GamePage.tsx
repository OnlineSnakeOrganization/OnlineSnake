//Dieser Code rendert das Spiel
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import '../css/game.css';

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const {inGame, endGame} = useGame();
  const rows = 25;     // Number of rows
  const columns = 25;  // Number of columns
  const blockWidth: number = 25;
  const blockHeight: number = 25;
  // blocks is a 2d array
  const [blocks, setBlocks] = useState(
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => (
        {
          key: `${row}-${col}`,
          color: "black",
        }))
    )
  );

  const [test, setTest] = useState(0);

  // Before rendering on the screen, check if the client is allowed to be on '/game'
  useEffect(() => {
    if (!inGame) {
      navigate("/");
    }
  }, [inGame, navigate]);
  
  const changeBlockColor = (row: number, column: number, newColor: string) => {
    setBlocks((prevBlock) => {
      const newBlock = prevBlock.map((r) => [...r]); // Clone array
      const targetSquare = newBlock[row][column]; // Access the existing square object
      newBlock[row][column] = { ...targetSquare, color: newColor }; // Change the color
      return newBlock;
    });
  };

  
  // Generate an Array of div's from the blocs which are then used to render the map
  const renderBoard = () => {

    return blocks.flat().map(({ key, color }, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;

      return (
        <>
          <div
            key={key} // Key remains unchanged
            className={"block"}
            style={{ backgroundColor: color,
              width: blockWidth,
              height: blockHeight,
              background: "#000000",
              border: "0.5px solid rgba(255, 255, 255, 0.077)"}}
            onMouseEnter={() => {
              setTest(test + 2);
              if(test >= 255){
                setTest(0);
              } 
              let color: string = "00" + test.toString(16) + "ff"
              if (color.length === 5) color = "0" + color;
              color = "#" + color;
              changeBlockColor(row, column, color);
              console.log(color)
            }}
            onMouseLeave={() => {
              setTimeout(() => {
              changeBlockColor(row, column, "black");
              }, 1000);
            }}
          />
        </>
      );
    });
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
      <div className="gameMap" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${blockWidth}px)`, // Dynamically set columns
        gridTemplateRows: `repeat(${rows}, ${blockHeight}px)`, // Dynamically set rows

        width: `${columns * blockWidth}px`, // Adjust width based on columns
        height: `${rows * blockHeight}px`, // Adjust height based on rows
      }}>
        {renderBoard()}
      </div>
    </>
    
  );
  //<App /> {/* Embeds the Snake game */}
};

export default GamePage;