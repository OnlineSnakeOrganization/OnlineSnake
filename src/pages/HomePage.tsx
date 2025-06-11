import React, { useEffect, useState } from "react";
import { useGame } from "../context/GameContext";
import { useNavigate } from "react-router-dom";
import '../css/home.css';
import '../css/stars.css';

interface Highscore {
  playerName: string;
  score: number;
  timestamp: string;
}

const HomePage: React.FC = () => {
  const { loadGame: startGame } = useGame();
  const navigate = useNavigate();

  const [globalHighscores, setGlobalHighscores] = useState<Highscore[]>([]);

  useEffect(() => {
    displayLeaderboard();

    // Fetch global highscores from backend
    fetch('http://localhost:3000/highscores')
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
        <h1 className="title">Online-Snake</h1>
        <div className="input-container">
          <input type="text" placeholder="Insert your name" id="playerName"></input>
        </div>
        <button onClick={() => {
          const playerName = (document.getElementById('playerName') as HTMLInputElement).value.trim();
          if (playerName) {
            localStorage.setItem('playerName', playerName); // Save player name to localStorage
            startGame();      // Sets the ingame variable to true
            navigate("/game"); // Loads the game page
          } else {
            alert("Please enter a valid name.");
          }
        }}>Singleplayer</button>
        <button onClick={() => { }}>Multiplayer</button>
      </div>
      <div className="leaderboard right">
        <h3>Global Highscores</h3>
        {globalHighscores.length === 0 && <div>No scores yet.</div>}
        {globalHighscores.map((entry, idx) => (
          <div key={idx}>{entry.playerName}: {entry.score}</div>
        ))}

      </div>
      <div className="help-icon" style={{position: 'fixed', bottom: 24, right: 24, zIndex: 10000, cursor: 'pointer'}} onClick={() => {
        const existingDialog = document.getElementById('help-dialog');
        if (existingDialog) {
          existingDialog.remove();
          return;
        }
        const dialog = document.createElement('div');
        dialog.id = 'help-dialog';
        dialog.style.position = 'fixed';
        dialog.style.bottom = '80px';
        dialog.style.right = '40px';
        dialog.style.background = '#222';
        dialog.style.color = 'white';
        dialog.style.padding = '28px 20px';
        dialog.style.borderRadius = '14px';
        dialog.style.boxShadow = '0 0 20px #000a';
        dialog.style.zIndex = '10001';
        dialog.style.textAlign = 'center';
        dialog.innerHTML = `
          <h3>Controls</h3>
          <ul style='padding: 0; margin: 0; list-style-position: inside; display: inline-block; text-align: left;'>
            
          </ul>
          <div style='margin: 18px 0 0 0; text-align:center; font-size:1.1em; font-weight:bold;'>Movement</div>
          <div style='margin: 8px 0 0 0; display: flex; flex-direction: row; justify-content: center; align-items: flex-start; gap: 40px;'>
            <div style='display: flex; flex-direction: column; align-items: center;'>
              <span style='font-size: 0.95em; margin-bottom: 4px;'>Arrows</span>
              <svg width="70" height="48" viewBox="0 0 70 48" style="display:block;" xmlns="http://www.w3.org/2000/svg">
                <rect x="27" y="2" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <polygon points="35,8 39,12 31,12" fill="#fff"/>
                <rect x="7" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <polygon points="15,38 19,42 11,42" fill="#fff"/>
                <rect x="27" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <polygon points="35,38 39,42 31,42" fill="#fff"/>
                <rect x="47" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <polygon points="55,38 59,42 51,42" fill="#fff"/>
              </svg>
            </div>
            <div style='display: flex; flex-direction: column; align-items: center;'>
              <span style='font-size: 0.95em; margin-bottom: 4px;'>WASD</span>
              <svg width="70" height="48" viewBox="0 0 70 48" style="display:block;" xmlns="http://www.w3.org/2000/svg">
                <rect x="27" y="2" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="35" y="15" text-anchor="middle" font-size="13" fill="#fff" font-family="Arial">W</text>
                <rect x="7" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="15" y="43" text-anchor="middle" font-size="13" fill="#fff" font-family="Arial">A</text>
                <rect x="27" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="35" y="43" text-anchor="middle" font-size="13" fill="#fff" font-family="Arial">S</text>
                <rect x="47" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="55" y="43" text-anchor="middle" font-size="13" fill="#fff" font-family="Arial">D</text>
              </svg>
            </div>
          </div>
          <div style='margin: 18px 0 0 0; display: flex; flex-direction: row; justify-content: center; gap: 32px;'>
            <div style='display: flex; flex-direction: column; align-items: center;'>
              <span style='font-size: 0.95em; margin-bottom: 4px;'>Restart</span>
              <svg width="36" height="36" viewBox="0 0 36 36" style="display:block;" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="4" width="28" height="28" rx="6" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="18" y="25" text-anchor="middle" font-size="18" fill="#fff" font-family="Arial">R</text>
              </svg>
            </div>
            <div style='display: flex; flex-direction: column; align-items: center;'>
              <span style='font-size: 0.95em; margin-bottom: 4px;'>Exit</span>
              <svg width="36" height="36" viewBox="0 0 36 36" style="display:block;" xmlns="http://www.w3.org/2000/svg">
                <rect x="1" y="4" width="34" height="28" rx="6" fill="#444" stroke="#fff" stroke-width="2"/>
                <text x="18" y="25" text-anchor="middle" font-size="14" fill="#fff" font-family="Arial">ESC</text>
              </svg>
            </div>
          </div>
          <br />
          <button id="close-help-btn" style="margin-top: 14px; padding: 6px 18px; font-size: 1em;">Close</button>
        `;
        document.body.appendChild(dialog);
        document.getElementById('close-help-btn')?.addEventListener('click', () => {
          dialog.remove();
        });
      }}>
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="22" fill="#222" stroke="#fff" strokeWidth="3"/>
          <text x="24" y="32" textAnchor="middle" fontSize="28" fill="#fff" fontFamily="Arial, sans-serif">?</text>
        </svg>

      </div>
    </>
  );
};

export default HomePage;