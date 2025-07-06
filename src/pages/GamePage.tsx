import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';
import SinglePlayerLogic from "../game/SinglePlayerLogic";
import GameOverDialog from "../components/GameOverDialog";
import appleImg from "../assets/Apple_Online_Snake.png"; // Import the apple image
import asteroidImg from "../assets/asteroid.png"; // Import the asteroid image

const rows = 15;
const columns = 15;
const blockWidth = 30;
const blockHeight = 30;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { inGame, gameMode, endGame } = useGame();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentSnakeLength, setCurrentSnakeLength] = useState(1);
  const [playTime, setPlayTime] = useState("");
  const [logic, setLogic] = useState<SinglePlayerLogic | null>(null);
  const [showGameOverDialog, setShowGameOverDialog] = useState(false);
  const [muted, setMuted] = useState(() => localStorage.getItem("musicMuted") === "true");

  // Food-Bild vorbereiten (außerhalb von drawBoard, am Anfang der Komponente)
  const foodImageRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    const img = new window.Image();
    img.src = appleImg;
    foodImageRef.current = img;
  }, []);

  const asteroidImageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = asteroidImg;
    asteroidImageRef.current = img;
  }, []);

  function drawBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !logic) return;

    //Chessboard Background
    for (let y = 0; y < rows; y++){
      for (let x = 0; x < columns; x++){
        if ((x + y) % 2 === 0) {
          ctx.fillStyle = "#222"; // darker square color
        }else{
          ctx.fillStyle = "#262626"; //lighter square color
        }
        ctx.fillRect(
          x * blockWidth,
          y * blockHeight,
          blockWidth,
          blockHeight
        );
      }
    }

    // Snake zeichnen
    logic.snakeSegments.forEach(segment => {
      ctx.fillStyle = segment.color || "lime";
      ctx.fillRect(
        segment.x * blockWidth,
        segment.y * blockHeight,
        blockWidth,
        blockHeight
      );
    });

    // Food zeichnen
    logic.food.forEach(food => {
      if (foodImageRef.current && foodImageRef.current.complete) {
        ctx.drawImage(
          foodImageRef.current,
          food.x * blockWidth,
          food.y * blockHeight,
          blockWidth,
          blockHeight
        );
      } else {
        // Fallback, falls das Bild noch nicht geladen ist
        ctx.fillStyle = "red";
        ctx.fillRect(
          food.x * blockWidth,
          food.y * blockHeight,
          blockWidth,
          blockHeight
        );
      }
    });

    // Statische Hindernisse zeichnen
    logic.staticObstacles?.forEach(ob => {
      if(asteroidImageRef.current && asteroidImageRef.current.complete){
        ctx.drawImage(
          asteroidImageRef.current,
          ob.x * blockWidth,
          ob.y * blockHeight,
          blockWidth,
          blockHeight
        );
      }else{
        //if the image is not loaded yet, draw a fallback rectangle
        ctx.fillStyle = "blue";
        ctx.fillRect(
          ob.x * blockWidth,
          ob.y * blockHeight,
          blockWidth,
          blockHeight
        );
      }
    });
    //Moving Obstacles 
    logic.movingObstacles?.forEach(ob => {
    ctx.fillStyle = "#30D5C8";
    ctx.fillRect(
      ob.position.x * blockWidth,
      ob.position.y * blockHeight,
      blockWidth,
      blockHeight
    );
  });
}

  //Creates a new logic object
  useEffect(() => {
    if (!inGame) { //Navigate clients to the homepage if they try to enter the GamePage using its URL directly.
      navigate("/");
    } else {
      let newLogic: SinglePlayerLogic;// | MultiPlayerLogic;
      if(gameMode === "SinglePlayer"){
        newLogic = new SinglePlayerLogic(
          rows, columns, false,
          setCurrentSnakeLength,
          setPlayTime,
          () => setShowGameOverDialog(true)
          );
      }else{
        newLogic = new SinglePlayerLogic(
          rows, columns, true,
          setCurrentSnakeLength,
          setPlayTime,
          () => setShowGameOverDialog(true)
          );
      }
      
      setLogic(newLogic);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start running the game when the logic object has been set.
  useEffect(() => {
    if (logic) {
      logic.start();
    }
  }, [logic]);

  // GameOver Dialog Overlay
  useEffect(() => {
    //Calls the Cleanup Function
    if (!showGameOverDialog) return;
    const keyListener = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setShowGameOverDialog(false);
        logic?.start();
      }
    };
    window.addEventListener('keydown', keyListener);
    //Sets the Cleanup Function
    return () => {
      window.removeEventListener('keydown', keyListener)
    };
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

  // Musiksteuerung
  useEffect(() => {
    const muted = localStorage.getItem("musicMuted") === "true";
    if (muted) {
      // Musik pausieren
      audioRef.current?.pause();
    } else {
      // Musik abspielen
      audioRef.current?.play();
    }
  }, []);

  // Optional: Auf Änderungen am Mute-Status reagieren
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "musicMuted") {
        setMuted(e.newValue === "true");
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (muted) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
  }, [muted]);

  useEffect(() => {
    let animationFrameId: number;

    function renderLoop() {
      drawBoard();
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    if (!showGameOverDialog) {
      animationFrameId = requestAnimationFrame(renderLoop);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };

  }, [logic, showGameOverDialog]);

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
        width: `${columns * blockWidth}px`,
        height: `${rows * blockHeight}px`,
        background: "black",
        position: "relative"
      }}>
        <canvas
          ref={canvasRef}
          width={columns * blockWidth}
          height={rows * blockHeight}
          style={{ display: "block" }}
        />
      </div>
      {showGameOverDialog && (
        <GameOverDialog
          onRestart={() => {
            setShowGameOverDialog(false);
            console.log("restart click")
            logic?.start();
          }}
          onMenu={() => {
            setShowGameOverDialog(false);
            console.log("Menu Click")
            if (logic){
              logic.exitGame();
              endGame();
              navigate("/");
            }
            
          }}
        />
      )}
    </>
  );
};

export default GamePage;