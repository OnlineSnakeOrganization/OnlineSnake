import React from "react";

interface MuteButtonProps {
  muted: boolean;
  onToggle: () => void;
}

const MuteButton: React.FC<MuteButtonProps> = ({ muted, onToggle }) => (
  <button
    className="mute-btn"
    style={{
      position: "fixed",
      bottom: 24,
      right: 84,
      zIndex: 10001,
      background: "none",
      border: "none",
      cursor: "pointer",
      outline: "none",
      padding: 0,
    }}
    onClick={onToggle}
    aria-label={muted ? "Unmute music" : "Mute music"}
  >
    {muted ? (
      // Muted Speaker Icon
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="6" fill="#444" stroke="#fff" strokeWidth="2" />
        {/* Speaker */}
        <polygon points="11,24 17,24 22,29 22,7 17,12 11,12" fill="#fff" />
        {/* Muted */}
        <line x1="11" y1="11" x2="25" y2="25" stroke="#f44" strokeWidth="3" />
        <line x1="25" y1="11" x2="11" y2="25" stroke="#f44" strokeWidth="3" />
      </svg>
    ) : (
      // Overall speaker icon with sound waves
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <rect x="4" y="4" width="28" height="28" rx="6" fill="#444" stroke="#fff" strokeWidth="2" />
        {/* Speaker*/}
        <polygon points="11,24 17,24 22,29 22,7 17,12 11,12" fill="#fff" />
        {/* Waves */}
        <path d="M24 14 Q27 18 24 22" stroke="#fff" strokeWidth="2" fill="none" />
        <path d="M27 11 Q31 18 27 25" stroke="#fff" strokeWidth="2" fill="none" />
      </svg>
    )}
  </button>
);

export default MuteButton;