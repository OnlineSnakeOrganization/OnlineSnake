import Stopwatch from "../game/Stopwatch";
import DiagonalController from "./controllers/DiagonalController";
import StraightController from "./controllers/StraightController";
import MovingObstacle from "./MovingObstacle";
import SnakeColorGradient from "./SnakeColorCalculator";
export type SnakeSegment = {x: number, y: number, color: string};
type Food = {x: number, y: number};
type Obstacle = {x: number, y: number};
type LeaderboardEntry = { name: string, score: number };

class SinglePlayerLogic {
    public snakeSegments: SnakeSegment[];
    public food: Food[];
    private maxAmountOfFood: number;
    public staticObstacles: Obstacle[];
    private amountOfStaticObstacles: number;
    public movingObstacles: MovingObstacle[];
    private amountOfMovingObstacles: number;

    public rows: number;
    public columns: number;
    public wallsAreDeadly: boolean;

    public setBlockColor: (row: number, column: number, newColor: string) => void;
    private clearBoard: () => void;
    private displaySnakeLength: (length: number) => void;
    private stopWatch: Stopwatch
    private snakeColorGradient: SnakeColorGradient;
    
    public snakeDirection: string;  //The direction the snake is facing and sneaking towards if no key is held.
    private diagonalMovementAllowed: boolean;
    private controller: StraightController | DiagonalController;
  
    private snakeInterval: NodeJS.Timeout | undefined;
    private obstacleInterval: NodeJS.Timeout | undefined;

    private gameOverAudio: HTMLAudioElement | undefined;
    private backgroundMusic: HTMLAudioElement | undefined;

    private onGameOver?: () => void;

    constructor(rows: number, columns: number, wallsAreDeadly: boolean, setBlockColor: (column: number, rows: number, newColor: string) => void,
        clearBoard: () => void, displaySnakeLength: (length: number) => void, displayTime: (time: string) => void, onGameOver?: () => void) {

        this.rows = rows;
        this.columns = columns;
        this.wallsAreDeadly = wallsAreDeadly;
        this.setBlockColor = setBlockColor;
        this.clearBoard = clearBoard;
        this.displaySnakeLength = displaySnakeLength;
        this.snakeColorGradient = new SnakeColorGradient("00ff00", "006600");
                    //Gold-Bone - "DCAD00", "D2CEBF"
                    //Blau Türkis - "0000ff", "00ffff"
                    //Türkis Orange - "00ffff", "FF9100"
                    //Grün DunkelGrün - "00FF00", "006100"
                    //Rot Orange - "FF1900", "FF9100"
        this.maxAmountOfFood = 1;
        this.amountOfStaticObstacles = 7;
        this.amountOfMovingObstacles = 3;
        this.stopWatch = new Stopwatch(displayTime);
        
        //We already refresh theese variables in the start method but the compiler isnt happy.
        this.snakeDirection = "UP";
        this.diagonalMovementAllowed = true;
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = []
        this.controller = new StraightController(document, this);   //Compiler is angry if this is gone

        this.gameOverAudio = new Audio("/src/assets/gameover.mp3");
        this.gameOverAudio.volume = 0.7;
        this.backgroundMusic = new Audio("/src/assets/background.mp3");
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        this.onGameOver = onGameOver;
     }

    public start(): void {
        // Vor jedem Start: Intervals beenden, um doppelte zu verhindern
        clearInterval(this.snakeInterval);
        clearInterval(this.obstacleInterval);


        this.snakeDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = [];
        this.clearBoard();
        this.stopWatch.reset();
        this.stopWatch.start();
    
        this.snakeSegments.push({x: 0, y: 0, color: ""});   //Places the first Snake segment on the bottom left corner.

        this.resetSnakeColors();
        this.displaySnakeLength(this.snakeSegments.length);
        this.generateObstacles();
        this.generateMovingObstacles();
        this.generateFood();
        if(this.diagonalMovementAllowed){
            this.controller = new DiagonalController(document, this);
        }else{
            this.controller = new StraightController(document, this);
        }
        this.controller.enable();
        this.snakeInterval = setInterval(this.snakeLoop, 125);
        this.obstacleInterval = setInterval(this.obstacleLoop, 1000);
        this.drawBoard();

        this.playBackgroundMusic();

    }
    public killSnake = (): void => {
        clearInterval(this.snakeInterval);
        this.stopWatch.stop();

        this.stopBackgroundMusic();

    }

    public exitGame = (): void =>{
        this.killSnake();
        clearInterval(this.obstacleInterval);
        this.controller.disable();
    }

    public clearIntervals = (): void =>{
        clearInterval(this.snakeInterval);
        clearInterval(this.obstacleInterval);
    }
      
    private snakeLoop = (): void => {    //Arrow Function because else "this" would be different
        // Create another Snakesegment
        const head = { ...this.snakeSegments[0] };

        const oldHead = { ...this.snakeSegments[0] };

        this.controller.moveHead(head);
        this.snakeSegments.unshift(head);   //Add it to the front of the Snake

        if (this.isGameOver()) {
            const playerName = localStorage.getItem('playerName') || 'Unknown';

            // Score = snakeSegments.length - 1 (Anzahl gegessener Nahrung)
            const score = Math.max(this.snakeSegments.length - 1, 0);
            this.playGameOverSound();
            this.saveScore(playerName, score);
            this.uploadScore(playerName, score);
            this.killSnake();
            this.snakeSegments[0] = oldHead;
            if (this.onGameOver) this.onGameOver();

        } else {
            this.pullSnakeColorsToTheHead();    //To keep the colors after each movement.
            
            //Check if the snake eats food
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

    private obstacleLoop = (): void => {
        for(const obstacle of this.movingObstacles){
            obstacle.moveObstacle();
        }
        this.drawBoard();
    }
  
    private resetSnakeColors = ():void =>{
        const snakeLength: number = this.snakeSegments.length;
        for(let i = 0; i < this.snakeSegments.length; i++){
            this.snakeSegments[i].color = this.snakeColorGradient.getColor(i, snakeLength);
        }
    }

    private pullSnakeColorsToTheHead = ():void =>{
        for(let i = 1; i < this.snakeSegments.length; i++){
            this.snakeSegments[i-1].color = this.snakeSegments[i].color;
        }
    }
  
    private generateFood = (): void => {
        let availableBlocksForNewFood: Food[] = [];     // An array of free blocks where food could spawn
        for (let row = 0; row < this.rows; row++) {     // Fill it up
            for (let column = 0; column < this.columns; column++) {
                const availableBlock: Food = { x: column, y: row };
                availableBlocksForNewFood.push(availableBlock);
            }
        }
        // Then remove all the blocks which are already taken
        // Food cannot spawn where there are snake segments => Remove the blocks taken by the snake
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !this.snakeSegments.some(segment => ob.x === segment.x && ob.y === segment.y));
        // Food cannot spawn on other food => Remove the blocks taken by other food
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !this.food.some(food => ob.x === food.x && ob.y === food.y));
        // Food cannot spawn on staticObstacles => Remove the blocks taken by staticObstacles
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !this.staticObstacles.some(staticObstacle => ob.x === staticObstacle.x && ob.y === staticObstacle.y));

        // Always make sure to spawn the maximum Amount of food allowed and possible
        while (this.food.length < this.maxAmountOfFood && availableBlocksForNewFood.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForNewFood.length);
            this.food.push({ ...availableBlocksForNewFood[randomIdx] });

            // Make this used ob now unavailable
            availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !(ob.x === availableBlocksForNewFood[randomIdx].x && ob.y === availableBlocksForNewFood[randomIdx].y));
        }
    }

    private generateObstacles = (): void =>{
        let availableBlocksForObstacles: Obstacle[] = [];
        for (let row = 0; row < this.rows; row++) {     // Fill it up
            for (let column = 0; column < this.columns; column++) {
                const availableBlock: Obstacle = { x: column, y: row };
                availableBlocksForObstacles.push(availableBlock);
            }
        }

        while (this.staticObstacles.length < this.amountOfStaticObstacles
     && availableBlocksForObstacles.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForObstacles.length);
            this.staticObstacles.push({ ...availableBlocksForObstacles[randomIdx] });

            // Make this used ob now unavailable
            availableBlocksForObstacles = availableBlocksForObstacles.filter(ob => !(ob.x === availableBlocksForObstacles[randomIdx].x && ob.y === availableBlocksForObstacles[randomIdx].y));
        }
    }

    private generateMovingObstacles = (): void =>{
        const randomDirection = (): string => {
            const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
            return directions[Math.floor(Math.random() * 4)];
        };

        let availableBlocksForMovingObstacles: MovingObstacle[] = [];
        for (let row = 0; row < this.rows; row++) {     // Fill it up
            for (let column = 0; column < this.columns; column++) {
                const availableBlock: MovingObstacle = new MovingObstacle(this, {x: column, y: row}, randomDirection());
                availableBlocksForMovingObstacles.push(availableBlock);
            }
        }

        // Food cannot spawn on staticObstacles => Remove the blocks taken by staticObstacles
        availableBlocksForMovingObstacles = availableBlocksForMovingObstacles.filter(ob => !this.staticObstacles.some(staticObstacle => ob.position.x === staticObstacle.x && ob.position.y === staticObstacle.y));

        while (this.movingObstacles.length < this.amountOfMovingObstacles
     &&     availableBlocksForMovingObstacles.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForMovingObstacles.length);
            this.movingObstacles.push(availableBlocksForMovingObstacles[randomIdx]);
            // Make this used ob now unavailable
            availableBlocksForMovingObstacles = availableBlocksForMovingObstacles.filter(ob => !(ob.position.x === availableBlocksForMovingObstacles[randomIdx].position.x && ob.position.y === availableBlocksForMovingObstacles[randomIdx].position.y));
        }
    }

    private isGameOver = (): boolean =>{
        const head = this.snakeSegments[0];
        // Check wall collision
        if (head.x < 0 || head.y < 0 || head.x >= this.columns || head.y >= this.rows) return true;

        // Check self collision
        for (let i = 1; i < this.snakeSegments.length-1; i++){
            // Skip the first segment because we don't compare the head to itself
            // Skip the last segment because it will move out of the way in the same tick.
            if (head.x === this.snakeSegments[i].x && head.y === this.snakeSegments[i].y) return true;
        }

        // Check staticObstacle collision
        for (const staticObstacle of this.staticObstacles){
            if (head.x === staticObstacle.x && head.y === staticObstacle.y) return true;
        }

        // Check movingObstacle collision
        for (const movingObstacle of this.movingObstacles){
            if (head.x === movingObstacle.position.x && head.y === movingObstacle.position.y) return true;
        }

        return false;
    }
  
    private drawBoard = (): void =>{
        for(let i = 0; i < this.snakeSegments.length; i++){
            const segment = this.snakeSegments[i];
            this.setBlockColor(segment.x, segment.y, segment.color); 
            //Only recalculate colors when food was eaten
        }
        for (const staticObstacle of this.staticObstacles) {
            this.setBlockColor(staticObstacle.x, staticObstacle.y, "blue");
        }
        for (const food of this.food) {
            this.setBlockColor(food.x, food.y, "pink");
        }
        for (const movingObstacle of this.movingObstacles){
            this.setBlockColor(movingObstacle.position.x, movingObstacle.position.y, "#30D5C8");
        }
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

    // WIP: Sends the score to the backend and updates the global leaderboard
    uploadScore(name: string, score: number) {
        fetch('http://localhost:3000/highscores', { // Must be replaced with the actual URL of the backend
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerName: name, score })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Score uploaded successfully:', data);
        })
        .catch(error => {
            console.error('Error uploading score:', error);
        });
    }


    private playGameOverSound() {
        if (this.gameOverAudio) {
            this.gameOverAudio.currentTime = 0;
            this.gameOverAudio.play();
        }
    }

    private playBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play();
        }
    }

    private stopBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
    }


}
export default SinglePlayerLogic;
