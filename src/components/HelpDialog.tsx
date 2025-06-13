import React from "react";

interface HelpDialogProps {
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ onClose }) => (
  <div
    id="help-dialog"
    style={{
      position: 'fixed',
      bottom: '80px',
      right: '40px',
      background: '#222',
      color: 'white',
      padding: '28px 20px',
      borderRadius: '14px',
      boxShadow: '0 0 20px #000a',
      zIndex: 10001,
      textAlign: 'center',
    }}
  >
    <h3>Controls</h3>
    <ul style={{ padding: 0, margin: 0, listStylePosition: "inside", display: "inline-block", textAlign: "left" }}>
      {/* Hier kannst du weitere Controls ergänzen */}
    </ul>
    <div style={{ margin: "18px 0 0 0", textAlign: "center", fontSize: "1.1em", fontWeight: "bold" }}>Movement</div>
    <div style={{ margin: "8px 0 0 0", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "flex-start", gap: 40 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "0.95em", marginBottom: 4 }}>Arrows</span>
        {/* SVG für Pfeiltasten */}
        <svg width="70" height="48" viewBox="0 0 70 48" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="2" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <polygon points="35,8 39,12 31,12" fill="#fff" />
          <rect x="7" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <polygon points="15,38 19,42 11,42" fill="#fff" />
          <rect x="27" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <polygon points="35,38 39,42 31,42" fill="#fff" />
          <rect x="47" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <polygon points="55,38 59,42 51,42" fill="#fff" />
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "0.95em", marginBottom: 4 }}>WASD</span>
        {/* SVG für WASD */}
        <svg width="70" height="48" viewBox="0 0 70 48" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
          <rect x="27" y="2" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="35" y="15" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial">W</text>
          <rect x="7" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="15" y="43" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial">A</text>
          <rect x="27" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="35" y="43" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial">S</text>
          <rect x="47" y="30" width="16" height="16" rx="4" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="55" y="43" textAnchor="middle" fontSize="13" fill="#fff" fontFamily="Arial">D</text>
        </svg>
      </div>
    </div>
    <div style={{ margin: "18px 0 0 0", display: "flex", flexDirection: "row", justifyContent: "center", gap: 32 }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "0.95em", marginBottom: 4 }}>Restart</span>
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
          <rect x="4" y="4" width="28" height="28" rx="6" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="18" y="25" textAnchor="middle" fontSize="18" fill="#fff" fontFamily="Arial">R</text>
        </svg>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span style={{ fontSize: "0.95em", marginBottom: 4 }}>Exit</span>
        <svg width="36" height="36" viewBox="0 0 36 36" style={{ display: "block" }} xmlns="http://www.w3.org/2000/svg">
          <rect x="1" y="4" width="34" height="28" rx="6" fill="#444" stroke="#fff" strokeWidth="2" />
          <text x="18" y="25" textAnchor="middle" fontSize="14" fill="#fff" fontFamily="Arial">ESC</text>
        </svg>
      </div>
    </div>
    <br />
    <button
      id="close-help-btn"
      style={{ marginTop: 14, padding: "6px 18px", fontSize: "1em" }}
      onClick={onClose}
    >
      Close
    </button>
  </div>
);

export default HelpDialog;