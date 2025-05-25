import Stopwatch from "../game/Stopwatch";
import DiagonalController from "./controllers/DiagonalController";
import StraightController from "./controllers/StraightController";
import SnakeColorGradient from "./SnakeColorCalculator";
export type SnakeSegment = {x: number, y: number, color: string};
type Food = {x: number, y: number};
type Obstacle = {x: number, y: number};
type LeaderboardEntry = { name: string, score: number };

class SinglePlayerLogic {
    private snakeSegments: SnakeSegment[];
    private food: Food[];
    private maxAmountOfFood: number;
    private obstacles: Obstacle[];
    private amountOfObstacles: number;
    public rows: number;
    public columns: number;
    public wallsAreDeadly: boolean;

    private setBlockColor: (row: number, column: number, newColor: string) => void;
    private clearBoard: () => void;
    private displaySnakeLength: (length: number) => void;
    private stopWatch: Stopwatch
    private snakeColorGradient: SnakeColorGradient;
    
    public snakeDirection: string;  //The direction the snake is facing and sneaking towards if no key is held.
    private diagonalMovementAllowed: boolean;
    private controller: StraightController | DiagonalController;
  
    private gameInterval: NodeJS.Timeout | undefined;

    constructor(rows: number, columns: number, wallsAreDeadly: boolean, setBlockColor: (column: number, rows: number, newColor: string) => void,
        clearBoard: () => void, displaySnakeLength: (length: number) => void, displayTime: (time: string) => void) {
        this.rows = rows;
        this.columns = columns;
        this.wallsAreDeadly = wallsAreDeadly;
        this.setBlockColor = setBlockColor;
        this.clearBoard = clearBoard;
        this.displaySnakeLength = displaySnakeLength;
        this.snakeColorGradient = new SnakeColorGradient("FF1900", "FF9100");
                    //Gold-Bone - "DCAD00", "D2CEBF"
                    //Blau Türkis - "0000ff", "00ffff"
                    //Türkis Orange - "00ffff", "FF9100"
                    //Grün DunkelGrün - "00FF00", "006100"
                    //Rot Orange - "FF1900", "FF9100"
        this.maxAmountOfFood = 1;
        this.amountOfObstacles = 10
        this.stopWatch = new Stopwatch(displayTime);
        
        //We already refresh theese variables in the start method but the compiler isnt happy.
        this.snakeDirection = "UP";
        this.diagonalMovementAllowed = true;
        this.snakeSegments = [];
        this.food = [];
        this.obstacles = [];
        this.controller = new StraightController(document, this);   //Compiler is angry if this is gone
     }

    public start(): void {
        this.snakeDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.obstacles = [];
        this.clearBoard();
        this.stopWatch.reset();
        this.stopWatch.start();
    
        this.snakeSegments.push({x: 0, y: 0, color: ""});   //Places the first Snake segment on the bottom left corner.

        this.resetSnakeColors();
        this.displaySnakeLength(this.snakeSegments.length);
        this.generateObstacles();
        this.generateFood();
        if(this.diagonalMovementAllowed){
            this.controller = new DiagonalController(document, this);
        }else{
            this.controller = new StraightController(document, this);
        }
        this.controller.enable();
        this.gameInterval = setInterval(this.gameLoop, 125);
    }

    public stopGame = (): void => {
        clearInterval(this.gameInterval);
        this.stopWatch.stop();
    }

    public exit = (): void =>{
        this.stopGame();
        this.controller.disable();
    }
      
    private gameLoop = (): void => {    //Arrow Function because else "this" would be different
        // Create another Snakesegment
        const head = { ...this.snakeSegments[0] };
        this.controller.moveHead(head);
        this.snakeSegments.unshift(head);   //Add it to the front of the Snake
        this.pullSnakeColorsToTheHead();    //To keep the colors after each movement.

        if (this.isGameOver()) {
            const playerName = localStorage.getItem('playerName') || 'Unknown';
            this.saveScore(playerName, this.snakeSegments.length);
            this.stopGame();
        } else {
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
        availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !this.snakeSegments.some(segment => block.x === segment.x && block.y === segment.y));
        // Food cannot spawn on other food => Remove the blocks taken by other food
        availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !this.food.some(food => block.x === food.x && block.y === food.y));
        // Food cannot spawn on obstacles => Remove the blocks taken by obstacles
        availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !this.obstacles.some(obstacle => block.x === obstacle.x && block.y === obstacle.y));

        // Always make sure to spawn the maximum Amount of food allowed and possible
        while (this.food.length < this.maxAmountOfFood && availableBlocksForNewFood.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForNewFood.length);
            this.food.push({ ...availableBlocksForNewFood[randomIdx] });

            // Make this used block now unavailable
            availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !(block.x === availableBlocksForNewFood[randomIdx].x && block.y === availableBlocksForNewFood[randomIdx].y));
        }
    }

    private generateObstacles = (): void =>{
        let availableBlocksForObstacles: Obstacle[] = []
        for (let row = 0; row < this.rows; row++) {     // Fill it up
            for (let column = 0; column < this.columns; column++) {
                const availableBlock: Obstacle = { x: column, y: row };
                availableBlocksForObstacles.push(availableBlock);
            }
        }

        while (this.obstacles.length < this.amountOfObstacles && availableBlocksForObstacles.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForObstacles.length);
            this.obstacles.push({ ...availableBlocksForObstacles[randomIdx] });

            // Make this used block now unavailable
            availableBlocksForObstacles = availableBlocksForObstacles.filter(block => !(block.x === availableBlocksForObstacles[randomIdx].x && block.y === availableBlocksForObstacles[randomIdx].y));
        }
    }

    private isGameOver = (): boolean =>{
        const head = this.snakeSegments[0];
        // Check wall collision
        if (head.x < 0 || head.y < 0 || head.x >= this.columns || head.y >= this.rows) return true;

        // Check self collision
        for (const segment of this.snakeSegments.slice(1)){ // Skip the first segment because we don't compare the head to itself
            if (head.x === segment.x && head.y === segment.y) return true;
        }

        // Check obstacle collision
        for (const obstacle of this.obstacles){
            if (head.x === obstacle.x && head.y === obstacle.y) return true;
        }

        return false;
    }
  
    private drawBoard = (): void =>{
        for(let i = 0; i < this.snakeSegments.length; i++){
            const segment = this.snakeSegments[i];
            this.setBlockColor(segment.x, segment.y, segment.color); 
            //Only recalculate colors when food was eaten
        }
        for (const obstacle of this.obstacles) {
            this.setBlockColor(obstacle.x, obstacle.y, "blue");
        }
        for (const food of this.food) {
            this.setBlockColor(food.x, food.y, "pink");
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
}
export default SinglePlayerLogic;