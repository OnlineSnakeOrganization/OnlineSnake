import Stopwatch from "../game/Stopwatch";
import DiagonalController from "./controllers/DiagonalController";
import StraightController from "./controllers/StraightController";
import MovingObstacle from "./MovingObstacle";

import EntityGenerator from "./EntityGenerator";
import AudioPlayer from "./AudioPlayer";
import LocalHighscoresManager from "./LocalHighscoresManager";
import Painter from "./Painter";
export type SnakeSegment = {x: number, y: number, color: string};
export type Food = {x: number, y: number};
export type Obstacle = {x: number, y: number};

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

    public setBlockColor: (row: number, column: number, newColor: string) => void;  //Method from Gamepage
    private clearBoard: () => void;                                                 //Method from Gamepage
    private displaySnakeLength: (length: number) => void;                           //Method from Gamepage
    private painter: Painter;
    private stopWatch: Stopwatch;
    private entityGenerator: EntityGenerator;
    private audioPlayer: AudioPlayer;
    private highscores: LocalHighscoresManager;
    
    
    public snakeDirection: string;  //The direction the snake is facing and sneaking towards if no key is held.
    private diagonalMovementAllowed: boolean;
    private controller: StraightController | DiagonalController; //Which controller is used depends on 'diagonalMovementAllowed'
  
    private snakeInterval: NodeJS.Timeout | undefined;
    private obstacleInterval: NodeJS.Timeout | undefined;

    private onGameOver?: () => void;    //This method triggers the code on the GamePage

    constructor(
        rows: number,
        columns: number,
        wallsAreDeadly: boolean,
        setBlockColor: (row: number, column: number, newColor: string) => void, // <-- Reihenfolge geändert!
        clearBoard: () => void,
        displaySnakeLength: (length: number) => void,
        displayTime: (time: string) => void,
        onGameOver?: () => void
    ) {
        this.rows = rows;
        this.columns = columns;
        this.wallsAreDeadly = wallsAreDeadly;
        this.setBlockColor = setBlockColor; // Reihenfolge passt jetzt!
        this.clearBoard = clearBoard;
        this.onGameOver = onGameOver;
        this.displaySnakeLength = displaySnakeLength;

        this.maxAmountOfFood = 1;
        this.amountOfStaticObstacles = 7;
        this.amountOfMovingObstacles = 3;
        this.painter = new Painter(this);
        this.stopWatch = new Stopwatch(displayTime);
        this.entityGenerator = new EntityGenerator(this);
        this.audioPlayer = new AudioPlayer();
        this.highscores = new LocalHighscoresManager();
        
        //We already refresh theese variables in the start method but we still have to give them some value in the constructor.
        this.snakeDirection = "UP";
        this.diagonalMovementAllowed = true;
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = []
        this.controller = new StraightController(document, this);   //Compiler is angry if this is gone
    }

    public getAmountOfMovingObstacles(): number{
        return this.amountOfMovingObstacles;
    }

    public getMaxAmountOfFood(): number{
        return this.maxAmountOfFood;
    }

    public getAmountOfStaticObstacles(): number{
        return this.amountOfStaticObstacles;
    }

    public start(): void {
        // If running intervals exist, clear them.
        clearInterval(this.snakeInterval);
        clearInterval(this.obstacleInterval);
        this.audioPlayer.stopAllSounds();

        // Resetting all Game-Variables
        this.snakeDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = [];
        this.clearBoard();
        this.stopWatch.reset();
        this.stopWatch.start();
    
        // Places the first Snake segment on the bottom left corner.
        // Edit this someday so that the snake cannot die instantly by spawning in front of an obstacle.
        this.snakeSegments.push({x: 0, y: 0, color: ""});

        this.painter.ApplyColorsToSnakeSegments();
        this.displaySnakeLength(this.snakeSegments.length);
        this.entityGenerator.generateObstacles();
        this.entityGenerator.generateMovingObstacles();
        this.entityGenerator.generateFood();
        if(this.diagonalMovementAllowed){
            this.controller = new DiagonalController(document, this);
        }else{
            this.controller = new StraightController(document, this);
        }
        this.controller.enable();
        this.audioPlayer.playBackgroundMusic();
        this.snakeInterval = setInterval(this.snakeLoop, 125);
        this.obstacleInterval = setInterval(this.obstacleLoop, 1000);
    }

    //Stops the snake, background ambience and 
    public killSnake = (): void => {
        clearInterval(this.snakeInterval);
        this.stopWatch.stop();
        this.audioPlayer.stopAllSounds();
        this.audioPlayer.playGameOverSound();
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
      
    private snakeLoop = (): void => {    //Arrow Function because else "this" would behave differently
        // Create another Snakesegment
        const head = { ...this.snakeSegments[0] };

        const oldHead = { ...this.snakeSegments[0] };

        this.controller.moveHead(head);
        this.snakeSegments.unshift(head);   //Add it to the front of the Snake

        if (this.isGameOver()) {
            const playerName = localStorage.getItem('playerName') || 'Unknown';

            // Score = snakeSegments.length - 1 (Anzahl gegessener Nahrung)
            const score = Math.max(this.snakeSegments.length - 1, 0);
            this.highscores.saveScore(playerName, score);
            this.highscores.uploadScore(playerName, score, this.stopWatch.getTime());
            this.killSnake();
            this.snakeSegments[0] = oldHead;
            if (this.onGameOver) this.onGameOver();
        } else {
            this.painter.pullSnakeColorsToTheHead();    //To keep the colors after each movement.
            
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
                this.entityGenerator.generateFood();
                //this.generateFood();
                this.displaySnakeLength(this.snakeSegments.length);
                this.painter.ApplyColorsToSnakeSegments();
            } else {
                const lastSegment: SnakeSegment = this.snakeSegments[this.snakeSegments.length - 1];
                this.setBlockColor(lastSegment.y, lastSegment.x, "black") // <-- Reihenfolge geändert!
                this.snakeSegments.pop(); // Remove the tail if no food is eaten
            }
            this.painter.drawBoard();
        }
    }

    //This function moves all movable obstacles
    private obstacleLoop = (): void => {
        for(const obstacle of this.movingObstacles){
            obstacle.moveObstacle();
        }
        this.painter.drawBoard();
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
}
export default SinglePlayerLogic;
