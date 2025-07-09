import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/stars.css';
import HelpDialog from "../components/HelpDialog";

let BACKEND_URL: string;
let USE_SECURE: string;
try {
  BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  USE_SECURE = import.meta.env.VITE_USE_SECURE;
} catch (error) {
  BACKEND_URL = "onlinesnakeserver-production.up.railway.app";
  USE_SECURE = "true";
}

interface Highscore {
  playerName: string;
  score: number;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const { loadGame, setMode, setWsObject} = useGame();
  const navigate = useNavigate();

  const [globalHighscores, setGlobalHighscores] = useState<Highscore[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    displayLeaderboard();
    // Fetch global highscores from backend
    fetch(`http${USE_SECURE === 'true' ? 's' : ''}://${BACKEND_URL}/highscores`)
      .then(res => res.json())
      .then((data: Highscore[]) => {
        setGlobalHighscores(data);
      })
      .catch(() => setGlobalHighscores([]));
  }, []);

  const displayLeaderboard = () => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
    const leaderboardContainer = document.querySelector('.leaderboard.left');
    if (leaderboardContainer) {
      leaderboardContainer.innerHTML = '<h3>Local Highscores</h3>';
      leaderboard.forEach((entry: { name: string; score: number }) => {
        const entryElement = document.createElement('div');
        entryElement.textContent = `${entry.name}: ${entry.score}`;
        leaderboardContainer.appendChild(entryElement);
      });
    } else {
      console.error('Leaderboard container not found');
    }
  };

  return (
    <>
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div id="stars4"></div>
      <div className="leaderboard left">
        <h3>Local Highscores</h3>
      </div>
      <div className="container">
        {/* Title */}
        <h1 className="title">Online-Snake</h1>
        
        {/* Player Name Box */}
        <div className="input-container">
          <input type="text" placeholder="Insert your name" id="playerName"></input>
        </div>

        {/* Singleplayer Button */}
        <button onClick={() => {
          const playerName = (document.getElementById('playerName') as HTMLInputElement).value.trim(); 
          //                   Trim HTML characters (<, >, /, \) to prevent injection attacks here? ^ 
          if (playerName) {
            localStorage.setItem('playerName', playerName); // Save player name to localStorage
            setMode("SinglePlayer");
            loadGame();      // Sets the ingame variable to true
            navigate("/game"); // Loads the game page
          } else {
            alert("Please enter a valid name.");
          }
        }}>Singleplayer</button>

        {/* Multiplayer Button (WORK IN PROGRESS) */}
        <button onClick={() => {
            const playerName = (document.getElementById('playerName') as HTMLInputElement).value.trim();
            if (playerName) {
              localStorage.setItem('playerName', playerName); // Save player name to localStorage
              console.log('Connecting to Server...');
              const ws = new WebSocket(`ws${USE_SECURE === 'true' ? 's' : ''}://${BACKEND_URL}/ws`);
              ws.onopen = () => {
                console.log("Connection Established!")
                setWsObject(ws);  //Sets the WebSocket Object for further use.
                setMode("MultiPlayer");
                loadGame();
                navigate("/game");
              };
            } else {
              alert("Please enter a valid name.");
            }
          
        }}>Multiplayer</button>
      </div>

      { /* Global Highscores Section */}
      <div className="leaderboard right">
        <h3>Global Highscores</h3>
        {globalHighscores.length === 0 && <div>No scores yet.</div>}
        {globalHighscores.map((entry, idx) => (
          <div key={idx}>{entry.playerName}: {entry.score}</div>
        ))}
      </div>

      {/* Help Icon */}
      <div
        className="help-icon"
        style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000, cursor: 'pointer' }}
        onClick={() => setShowHelp(!showHelp)}
      >
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#222" stroke="#fff" strokeWidth="3"/>
          <text x="24" y="32" textAnchor="middle" fontSize="28" fill="#fff" fontFamily="Arial, sans-serif">?</text>
        </svg>
      </div>
      {showHelp && <HelpDialog onClose={() => setShowHelp(false)} />}
    </>
  );
};

export default HomePage;
