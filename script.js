function startSinglePlayer() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        alert(`Singleplayer-Modus wird gestartet für ${playerName}!`);
    } else {
        alert('Bitte gib deinen Namen ein.');
    }
}

function startMultiPlayer() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        alert(`Multiplayer-Modus wird gestartet für ${playerName}!`);
    } else {
        alert('Bitte gib deinen Namen ein.');
    }
}