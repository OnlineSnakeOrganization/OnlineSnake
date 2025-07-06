type LeaderboardEntry = { name: string, score: number };
class LocalHighscoresManager{
    public saveScore(name: string, score: number) {
        const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const existingEntryIndex = leaderboard.findIndex(entry => entry.name === name);
        if (existingEntryIndex !== -1) {
            leaderboard[existingEntryIndex].score = Math.max(leaderboard[existingEntryIndex].score, score);
        } else {
            leaderboard.push({ name, score });
        }
        leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.score - a.score); // Sortiere nach Punkten, absteigend
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    }

    public displayLeaderboard() {
        const leaderboard: LeaderboardEntry[] = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const leaderboardContainer = document.querySelector('.leaderboard.left');
        if (leaderboardContainer) {
            leaderboardContainer.innerHTML = '<h3>Local Highscores</h3>';
            leaderboard.forEach((entry: LeaderboardEntry) => {
                const entryElement = document.createElement('div');
                entryElement.textContent = `${entry.name}: ${entry.score}`;
                leaderboardContainer.appendChild(entryElement);
            });
        } else {
            console.error('Leaderboard container not found');
        }
    }

    // WIP: Sends the score to the backend and updates the global leaderboard
    public uploadScore(name: string, score: number, time: number) {
        // Calculate game duration in seconds
        const gameDuration = Math.floor(time / 1000);
        fetch("http://localhost:3000/highscores", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                playerName: name, 
                score,
                gameDuration 
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Score uploaded successfully:', data);
        })
        .catch(error => {
            console.error('Error uploading score:', error);
        });
    }
}

export default LocalHighscoresManager;