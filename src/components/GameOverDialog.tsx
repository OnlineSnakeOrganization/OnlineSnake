import React from "react";

interface GameOverDialogProps {
  onRestart: () => void;
  onMenu: () => void;
}

const GameOverDialog: React.FC<GameOverDialogProps> = ({ onRestart, onMenu }) => (
  <div
    id="gameover-dialog"
    style={{
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
    }}
  >
    <h2>Game Over</h2>
    <p></p>
    <button
      id="restart-btn"
      style={{ margin: '10px', padding: '10px 20px', fontSize: '1.2em' }}
      onClick={onRestart}
    >
      Restart
    </button>
    <button
      id="menu-btn"
      style={{ margin: '10px', padding: '10px 20px', fontSize: '1.2em' }}
      onClick={onMenu}
    >
      Menu
    </button>
  </div>
);

export default GameOverDialog;