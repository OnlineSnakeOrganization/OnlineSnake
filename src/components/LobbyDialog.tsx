import React, { useState } from "react";

interface LobbyDialogProps {
  onClose: () => void;
  onCreateLobby: (lobbyName: string) => void;
}

const LobbyDialog: React.FC<LobbyDialogProps> = ({ onClose, onCreateLobby }) => {
  const [lobbyName, setLobbyName] = useState("");

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#222",
        color: "white",
        padding: "32px 24px",
        borderRadius: "16px",
        boxShadow: "0 0 20px #000a",
        zIndex: 10001,
        textAlign: "center",
        minWidth: 320,
      }}
    >
      <h2>Create Lobby</h2>
      <input
        type="text"
        placeholder="Lobby Name"
        value={lobbyName}
        onChange={e => setLobbyName(e.target.value)}
        style={{
          padding: "8px",
          fontSize: "1em",
          borderRadius: "6px",
          border: "1px solid #888",
          marginBottom: "16px",
          width: "80%",
        }}
      />
      <div style={{ marginTop: 16 }}>
        <button
          style={{ marginRight: 12, padding: "8px 18px", fontSize: "1em" }}
          onClick={() => {
            if (lobbyName.trim()) {
              onCreateLobby(lobbyName.trim());
            }
          }}
        >
          Create
        </button>
        <button
          style={{ padding: "8px 18px", fontSize: "1em" }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LobbyDialog;