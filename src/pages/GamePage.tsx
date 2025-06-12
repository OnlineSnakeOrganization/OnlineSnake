import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';
import SinglePlayerLogic from "../game/SinglePlayerLogic";

const rows = 15;
const columns = 15;
const blockWidth = 30;
const blockHeight = 30;

type Block = { key: string, color: string };

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { inGame, endGame } = useContext(GameContext);

  // 2D-Array für die Blockfarben
  const [blocks, setBlocks] = useState<Block[][]>(
    Array.from({ length: rows }, (_, y) =>
      Array.from({ length: columns }, (_, x) => ({
        key: `${x},${y}`,
        color: "black"
      }))
    )
  );

  const [currentSnakeLength, setCurrentSnakeLength] = useState(1);
  const [playTime, setPlayTime] = useState("");
  const [logic, setLogic] = useState<SinglePlayerLogic | null>(null);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);

  // Hilfsfunktionen für das Block-Grid
  const setBlockColor = (row: number, column: number, newColor: string) => {
    setBlocks(prev =>
      prev.map((rowArr, y) =>
        rowArr.map((block, x) =>
          y === row && x === column ? { ...block, color: newColor } : block
        )
      )
    );
  };

  const clearBoard = () => {
    setBlocks(Array.from({ length: rows }, (_, y) =>
      Array.from({ length: columns }, (_, x) => ({
        key: `${x},${y}`,
        color: "black"
      }))
    ));
  };

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
        () => setShowGameOverDialog(true)
      );
      setLogic(newLogic);
      newLogic.start();
      return () => {
        newLogic.exitGame();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame]);

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

  // ESC key: Exit to menu
  useEffect(() => {
    const escListener = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (logic) logic.exitGame();
        endGame();
        navigate("/");
      }
    };
    window.addEventListener('keydown', escListener);
    return () => window.removeEventListener('keydown', escListener);
  }, [logic, endGame, navigate]);

  // Board-Rendering
  const renderBoard = () => {
    return blocks.flat().map(({ key, color }) => (
      <div
        key={key}
        className="block"
        style={{
          backgroundColor: color,
          width: blockWidth,
          height: blockHeight,
        }}
      />
    ));
  };

  return (
    <>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
      <div>
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