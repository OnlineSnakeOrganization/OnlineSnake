import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GameContext } from "../context/GameContext";
import '../css/game.css';
import '../css/stars.css';
import SinglePlayerLogic from "../game/SinglePlayerLogic";
import GameOverDialog from "../components/GameOverDialog";
import appleImg from "../assets/Apple_Online_Snake.png"; // Import the apple image

const rows = 15;
const columns = 15;
const blockWidth = 30;
const blockHeight = 30;

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const { inGame, endGame } = useContext(GameContext);
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

  // HIER DIE FUNKTION EINFÜGEN:
  function drawBoard() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !logic) return;

    // Hintergrund
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, columns * blockWidth, rows * blockHeight);

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
      ctx.fillStyle = "blue";
      ctx.fillRect(
        ob.x * blockWidth,
        ob.y * blockHeight,
        blockWidth,
        blockHeight
      );
    });

    // Bewegliche Hindernisse zeichnen
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

  useEffect(() => {
    if (!inGame) {
      navigate("/");
    } else {
      const newLogic = new SinglePlayerLogic(
        rows,
        columns,
        false,
        () => { }, // Dummy setBlockColor
        () => { }, // Dummy clearBoard
        setCurrentSnakeLength,
        setPlayTime,
        () => setShowGameOverDialog(true)
      );
      setLogic(newLogic);
      //newLogic.start();
      return () => {
        newLogic.exitGame();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inGame]);

  useEffect(() => {
    if (logic) {
      logic.start();
      // drawBoard();  // <-- Entfernen!
    }
  }, [logic]);

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
      audioRef.current?.play().catch(() => { });
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
            logic?.start();
          }}
          onMenu={() => {
            setShowGameOverDialog(false);
            if (logic) logic.exitGame();
            endGame();
            navigate("/");
          }}
        />
      )}
      <audio ref={audioRef} src="/src/assets/background.mp3" loop />
    </>
  );
};

export default GamePage;