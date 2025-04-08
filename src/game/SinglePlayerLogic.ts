import Stopwatch from "../game/Stopwatch";
import SnakeColorCalculator from "./SnakeColorCalculator";

type SnakeSegment = { x: number, y: number, color: string };
type Food = { x: number, y: number };
type LeaderboardEntry = { name: string, score: number };

class SinglePlayerLogic {
    private snakeSegments: SnakeSegment[];
    private food: Food[];
    private maxAmountOfFood: number;
    private rows: number;
    private columns: number;
    private wallsAreDeadly: boolean;

    private setBlockColor: (row: number, column: number, newColor: string) => void;
    private clearBoard: () => void;
    private displaySnakeLength: (length: number) => void;
    private stopWatch: Stopwatch;
    private snakeColor: SnakeColorCalculator;

    private lastDirection: string;
    private direction: string;
    private inputListener = (key: KeyboardEvent) => {
        if (key.code === "ArrowUp" || key.code === "KeyW") {
            if (this.direction !== 'DOWN' && this.lastDirection !== 'DOWN') {
                this.direction = "UP";
            }
        }
        if (key.code === "ArrowDown" || key.code === "KeyS") {
            if (this.direction !== 'UP' && this.lastDirection !== 'UP') {
                this.direction = "DOWN";
            }
        }
        if (key.code === "ArrowLeft" || key.code === "KeyA") {
            if (this.direction !== 'RIGHT' && this.lastDirection !== 'RIGHT') {
                this.direction = "LEFT";
            }
        }
        if (key.code === "ArrowRight" || key.code === "KeyD") {
            if (this.direction !== 'LEFT' && this.lastDirection !== 'LEFT') {
                this.direction = "RIGHT";
            }
        }
        if (key.code === "KeyR") {
            const playerName = localStorage.getItem('playerName') || 'Unknown';
            this.saveScore(playerName, this.snakeSegments.length);
            this.stopGame();
            this.start();
        }
        if (key.code === "Escape") {
            this.stopGame();
        }
    };
    private gameInterval: NodeJS.Timeout | undefined;

    constructor(rows: number, columns: number, wallsAreDeadly: boolean, setBlockColor: (column: number, rows: number, newColor: string) => void,
        clearBoard: () => void, displaySnakeLength: (length: number) => void, displayTime: (time: string) => void) {
        this.rows = rows;
        this.columns = columns;
        this.wallsAreDeadly = wallsAreDeadly;
        this.setBlockColor = setBlockColor;
        this.clearBoard = clearBoard;
        this.displaySnakeLength = displaySnakeLength;
        this.snakeColor = new SnakeColorCalculator("FF1900", "FF9100"); //"80FF00", "5900FF"

        this.maxAmountOfFood = 20;
        this.stopWatch = new Stopwatch(displayTime);

        // We already refresh these variables in the start method but the compiler isn't happy.
        this.direction = "UP";
        this.lastDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
    }

    moveHead(head: SnakeSegment) {
        const direction: string = this.direction;
        if (direction === 'UP') head.y -= 1;
        else if (direction === 'DOWN') head.y += 1;
        else if (direction === 'LEFT') head.x -= 1;
        else if (direction === 'RIGHT') head.x += 1;
        this.lastDirection = direction;

        if (!this.wallsAreDeadly) {
            // This makes the head appear on the other side of the map if it creeps into a wall.
            head.x = (head.x + this.columns) % this.columns;
            head.y = (head.y + this.rows) % this.rows;
        }
    }

    resetSnakeColors = (): void => {
        const snakeLength: number = this.snakeSegments.length;
        for (let i = 0; i < this.snakeSegments.length; i++) {
            this.snakeSegments[i].color = this.snakeColor.getColor(i, snakeLength);
        }
    }

    pullSnakeColorsToTheHead = (): void => {
        for (let i = 1; i < this.snakeSegments.length; i++) {
            this.snakeSegments[i - 1].color = this.snakeSegments[i].color;
        }
    }

    gameLoop = (): void => {
        const head = { ...this.snakeSegments[0] };
        this.moveHead(head);
        this.snakeSegments.unshift(head);   // Add it to the front of the Snake

        this.pullSnakeColorsToTheHead();    // To keep the colors after each movement.

        if (this.isGameOver()) {
            const playerName = localStorage.getItem('playerName') || 'Unknown';
            this.saveScore(playerName, this.snakeSegments.length);
            this.stopGame();
        } else {
            let justAteFood: boolean = false;
            for (let i = 0; i < this.food.length; i++) {
                if (head.x === this.food[i].x && head.y === this.food[i].y) {
                    justAteFood = true;
                    this.food = this.food.filter(food => !(food.x === head.x && food.y === head.y));
                    break;
                }
            }
            if (justAteFood === true) {
                this.generateFood();
                this.displaySnakeLength(this.snakeSegments.length);
                this.resetSnakeColors();
            } else {
                const lastSegment: SnakeSegment = this.snakeSegments[this.snakeSegments.length - 1];
                this.setBlockColor(lastSegment.x, lastSegment.y, "black")
                this.snakeSegments.pop(); // Remove the tail if no food is eaten
            }
            this.drawBoard();
        }
    }

    generateFood = (): void => {
        let availableBlocksForNewFood: Food[] = [];   // An array of free blocks where food could spawn
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const place: Food = { x: column, y: row };
                availableBlocksForNewFood.push(place);
            }
        }

        // Food cannot spawn where there are snake segments => Remove the blocks taken by the snake
        availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !this.snakeSegments.some(segment => block.x === segment.x && block.y === segment.y));
        // Food cannot spawn on other food => Remove the blocks taken by other food
        availableBlocksForNewFood = availableBlocksForNewFood.filter(place => !this.food.some(food => place.x === food.x && place.y === food.y));

        // Always make sure to spawn the maximum Amount of food allowed and possible
        while (this.food.length < this.maxAmountOfFood && availableBlocksForNewFood.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForNewFood.length);
            this.food.push({ ...availableBlocksForNewFood[randomIdx] });

            // Make this used block now unavailable
            availableBlocksForNewFood = availableBlocksForNewFood.filter(place => !(place.x === availableBlocksForNewFood[randomIdx].x && place.y === availableBlocksForNewFood[randomIdx].y));
        }
    }

    isGameOver = (): boolean => {
        const head = this.snakeSegments[0];
        // Check wall collision
        if (head.x < 0 || head.y < 0 || head.x >= this.columns || head.y >= this.rows) return true;

        // Check self collision
        for (let i = 1; i < this.snakeSegments.length; i++) {   // Start i=1 because we don't compare the head to itself
            if (head.x === this.snakeSegments[i].x && head.y === this.snakeSegments[i].y) return true;
        }

        return false;
    }

    saveScore(name: string, score: number) {
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

    displayLeaderboard() {
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
    start(): void {
        this.direction = "UP";
        this.lastDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.clearBoard();
        this.stopWatch.reset();
        this.stopWatch.start();

        const initialHead: SnakeSegment = { x: Math.floor(Math.random() * (this.columns - 6)) + 3, y: Math.floor(Math.random() * (this.rows - 6)) + 3, color: this.snakeColor.getColor(0, 1) };
        this.snakeSegments.push(initialHead);   // Place the first Snake segment randomly on the board but with a distance to the border

        this.displaySnakeLength(this.snakeSegments.length);
        this.generateFood();
        document.addEventListener("keydown", this.inputListener);
        this.gameInterval = setInterval(this.gameLoop, 125);
    }

    drawBoard = (): void => {
        for (let i = 0; i < this.snakeSegments.length; i++) {
            const segment = this.snakeSegments[i];
            this.setBlockColor(segment.x, segment.y, segment.color);
        }

        for (const food of this.food) {
            this.setBlockColor(food.x, food.y, "pink"); // Use color for food
        }
    }

    stopGame = (): void => {
        if (this.gameInterval) {
            clearInterval(this.gameInterval);
            this.gameInterval = undefined;
        }
        this.stopWatch.stop();
    }
    
    exit = (): void => {
        document.removeEventListener("keydown", this.inputListener);    // Disables the inputs
        this.stopGame();
    }
}
export default SinglePlayerLogic;