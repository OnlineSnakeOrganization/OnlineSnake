import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';
import SinglePlayerLogic from "../game/SinglePlayerLogic";

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { inGame, endGame } = useContext(GameContext);
  const rows = 15;     // Number of rows
  const columns = 15;  // Number of columns
  const blockWidth: number = 30;
  const blockHeight: number = 30;
  const [currentSnakeLength, setCurrentSnakeLength] = useState(1);
  const [playTime, setPlayTime] = useState("");

  const [blocks, setBlocks] = useState(
    Array.from({ length: rows }, (_, row) =>
      Array.from({ length: columns }, (_, col) => (
        {
          key: `${row}-${col}`,
          color: "black"
        })))
  );

  const [logic, setLogic] = useState<SinglePlayerLogic | null>(null);

  const [showGameOverDialog, setShowGameOverDialog] = useState(false);


  useEffect(() => {
    if (!inGame) {
      navigate("/");
    } else {

      const newLogic = new SinglePlayerLogic(
        rows,
        columns,
        false,
        setBlockColor,
        clearBoard,
        setCurrentSnakeLength,
        setPlayTime,
        () => setShowGameOverDialog(true) // onGameOver Callback
      );

      setLogic(newLogic);
      newLogic.start();
      return () => {
        newLogic.exitGame(); // Ensure the old logic instance is stopped
      };
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame]); // Add inGame as dependency to reinitialize logic when game starts

  function clearBoard() {
    setBlocks(
      Array.from({ length: rows }, (_, row) =>
        Array.from({ length: columns }, (_, col) => (
          {
            key: `${row}-${col}`,
            color: "black",
          })))
    );
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
  }

  const renderBoard = () => {
    return blocks.flat().map(({ key, color }) => {
      return (
        <div
          key={key}
          className={"block"}
          style={{
            backgroundColor: color,
            width: blockWidth,
            height: blockHeight,
          }}
        />
      );
    });
  };

  // GameOver Dialog Overlay
  useEffect(() => {
    if (!showGameOverDialog) return;
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowGameOverDialog(false);
        logic?.start();
      }
    };
    window.addEventListener('keydown', keyListener);
    return () => window.removeEventListener('keydown', keyListener);
  }, [showGameOverDialog, logic]);

  return (
    <>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
      <div>
        <button onClick={() => {
          if (logic) {
            logic.exitGame(); // Call exitGame method to stop the game
          }
          endGame();
          navigate("/");
        }}>Back to Main</button>
        <p>Length: {currentSnakeLength}</p>
        <p>Time: {playTime}</p>
      </div>
      <div className="gameMap" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${blockWidth}px)`,
        gridTemplateRows: `repeat(${rows}, ${blockHeight}px)`,
        width: `${columns * blockWidth}px`,
        height: `${rows * blockHeight}px`,
      }}>
        {renderBoard()}
      </div>
      {showGameOverDialog && (
        <div id="gameover-dialog" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#222',
          color: 'white',
          padding: '32px 24px',
          borderRadius: '16px',
          boxShadow: '0 0 20px #000a',
          zIndex: 9999,
          textAlign: 'center',
        }}>
          <h2>Game Over</h2>
          <p></p>
          <button
            id="restart-btn"
            style={{ margin: '10px', padding: '10px 20px', fontSize: '1.2em' }}
            onClick={() => {
              setShowGameOverDialog(false);
              logic?.start();
            }}
          >Restart</button>
          <button
            id="menu-btn"
            style={{ margin: '10px', padding: '10px 20px', fontSize: '1.2em' }}
            onClick={() => {
              setShowGameOverDialog(false);
              if (logic) logic.exitGame();
              endGame();
              navigate("/");
            }}
          >Menu</button>
        </div>
      )}
    </>
  );
};

export default GamePage;
