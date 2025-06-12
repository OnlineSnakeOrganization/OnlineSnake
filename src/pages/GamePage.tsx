import React, {useContext, useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentSnakeLength, setCurrentSnakeLength] = useState(1);
  const [playTime, setPlayTime] = useState("");

  

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
        () => {}, //Dummy setBlockColor
        () => {}, //Dummy clearBoard 
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

  useEffect(() =>{
    if (showGameOverDialog){
      drawBoard(); //Canvas wird geleert, wenn GameOver Dialog angezeigt wird
    }
  }, [showGameOverDialog]);

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

  function drawBoard(){
    const ctx = canvasRef.current?.getContext("2d");
  if (!ctx || !logic) return;

  // Hintergrund
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, columns * blockWidth, rows * blockHeight);

  // Snake zeichnen
  logic.snakeSegments.forEach(segment => {
    ctx.fillStyle = segment.color || "lime";
    ctx.fillRect(segment.x * blockWidth, segment.y * blockHeight, blockWidth, blockHeight);
  });

  // Food zeichnen
  if (logic.food) {
    logic.food.forEach(food => {
      ctx.fillStyle = "red";
      ctx.fillRect(food.x * blockWidth, food.y * blockHeight, blockWidth, blockHeight);
    });
  }

  // Statische Hindernisse
  if (logic.staticObstacles) {
    logic.staticObstacles.forEach(ob => {
      ctx.fillStyle = "blue";
      ctx.fillRect(ob.x * blockWidth, ob.y * blockHeight, blockWidth, blockHeight);
    });
  }

  // Bewegliche Hindernisse (falls vorhanden)
  if (logic.movingObstacles) {
    logic.movingObstacles.forEach(ob => {
      ctx.fillStyle = "#30D5C8";
      ctx.fillRect(ob.position.x * blockWidth, ob.position.y * blockHeight, blockWidth, blockHeight);
    });
  }
  }

  useEffect(() => {
    drawBoard();
  }, [logic, currentSnakeLength, playTime, showGameOverDialog]);
  

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
      {/*<div className="gameMap" style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, ${blockWidth}px)`,
        gridTemplateRows: `repeat(${rows}, ${blockHeight}px)`,
        width: `${columns * blockWidth}px`,
        height: `${rows * blockHeight}px`,
      }}>
        {renderBoard()}
      </div>*/}

      <div className = "gameMap" style = {{
        width: `${columns * blockWidth}px`,
        height: `${rows * blockHeight}px`,
        background: "black",
        position: "relative",
      }}>
        <canvas
        ref = {canvasRef}
        width = {columns * blockWidth}
        height = {rows * blockHeight}
        style = {{display: "block"}}
        />
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
