import Stopwatch from "../Stopwatch";
import DiagonalController from "../controllers/singleplayer/DiagonalController";
import StraightController from "../controllers/singleplayer/StraightController";
import MovingObstacle from "../MovingObstacle";

import EntityGenerator from "../EntityGenerator";
import AudioPlayer from "../AudioPlayer";
import LocalHighscoresManager from "../LocalHighscoresManager";
import SnakePainter from "../Painter";
export type SnakeSegment = {x: number, y: number, color: string};
export type Food = {x: number, y: number};
export type Obstacle = {x: number, y: number};
export type GhostSegment = {x: number, y: number};
export type GhostFrame = {segments: GhostSegment[]};
export type GhostRun = {score: number, duration: number, frames: GhostFrame[]};
export type RunStats = {score: number, duration: number};

const BEST_GHOST_RUN_KEY = "bestGhostRun";
const LAST_RUN_STATS_KEY = "lastRunStats";

class SinglePlayerLogic {
    private snakeSegments: SnakeSegment[];
    private food: Food[];
    private maxAmountOfFood: number;
    private staticObstacles: Obstacle[];
    private maxAmountOfStaticObstacles: number;
    private movingObstacles: MovingObstacle[];
    private maxAmountOfMovingObstacles: number;

    private rows: number;
    private columns: number;
    private wallsAreDeadly: boolean;

    private displaySnakeLength: (length: number) => void;                           //Method from Gamepage
    private painter: SnakePainter;
    private stopWatch: Stopwatch;
    private entityGenerator: EntityGenerator;
    private audioPlayer: AudioPlayer;
    private highscores: LocalHighscoresManager;
    
    
    public snakeDirection: string;  //The direction the snake is facing and sneaking towards if no key is held.
    private diagonalMovementAllowed: boolean;
    private controller: StraightController | DiagonalController; //Which controller is used depends on 'diagonalMovementAllowed'
  
    private snakeInterval: NodeJS.Timeout | undefined;
    private movingObstacleInterval: NodeJS.Timeout | undefined;

    private onGameOver?: () => void;    //This method triggers the code on the GamePage
    private currentRunFrames: GhostFrame[];
    private ghostReplayFrames: GhostFrame[];
    private currentTick: number;

    constructor(
        rows: number,
        columns: number,
        wallsAreDeadly: boolean,
        diagonalMovementAllowed: boolean,
        displaySnakeLength: (length: number) => void,
        displayTime: (time: string) => void,
        onGameOver?: () => void
    ) {
        this.rows = rows;
        this.columns = columns;
        this.wallsAreDeadly = wallsAreDeadly;
        this.onGameOver = onGameOver;
        this.displaySnakeLength = displaySnakeLength;

        this.maxAmountOfFood = 1;
        this.maxAmountOfStaticObstacles = 7;
        this.maxAmountOfMovingObstacles = 3;
        this.painter = new SnakePainter(this);
        this.stopWatch = new Stopwatch(displayTime);
        this.entityGenerator = new EntityGenerator(this);
        this.audioPlayer = new AudioPlayer();
        this.highscores = new LocalHighscoresManager();
        
        //We already refresh theese variables in the start method, but we still have to give them some value in the constructor.
        this.snakeDirection = "right";
        this.diagonalMovementAllowed = diagonalMovementAllowed;
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = []
        this.controller = new StraightController(document, this);   //Compiler is angry if this is gone
        this.currentRunFrames = [];
        this.ghostReplayFrames = this.loadBestGhostRun().frames;
        this.currentTick = 0;

        window.addEventListener("storage", this.handleMuteChange);
    }

    private handleMuteChange = (e: StorageEvent) => {
        if (e.key === "musicMuted") {
            const muted = e.newValue === "true";
            if (muted) {
                this.audioPlayer.pauseBackgroundMusic();
            } else {
                this.audioPlayer.playBackgroundMusic();
            }
        }
    };

    //----------Getter
    public getSnakeSegments(){
        return this.snakeSegments;
    }
    public getFood(){
        return this.food;
    }
    public getStaticObstacles(){
        return this.staticObstacles;
    }
    public getMovingObstacles(){
        return this.movingObstacles;
    }
    public getRows(){
        return this.rows;
    }
    public getColumns(){
        return this.columns;
    }
    public getWallsAreDeadly(){
        return this.wallsAreDeadly;
    }

    public getMaxAmountOfMovingObstacles(): number{
        return this.maxAmountOfMovingObstacles;
    }

    public getMaxAmountOfFood(): number{
        return this.maxAmountOfFood;
    }

    public getMaxAmountOfStaticObstacles(): number{
        return this.maxAmountOfStaticObstacles;
    }

    public getGhostFrame(): GhostFrame | undefined {
        return this.ghostReplayFrames[this.currentTick];
    }

    public getBestGhostRun(): GhostRun {
        const bestGhostRun = this.loadBestGhostRun();
        const lastRunStats = this.loadLastRunStats();
        return {
            score: bestGhostRun.score,
            duration: bestGhostRun.duration || lastRunStats.duration,
            frames: this.ghostReplayFrames,
        };
    }
    //----------
    public start(): void {
        // If running intervals exist, clear them.
        this.clearIntervals();
        this.audioPlayer.stopAllSounds();

        // Resetting all Game-Variables
        this.snakeDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = [];
        this.currentRunFrames = [];
        this.currentTick = 0;
        this.ghostReplayFrames = this.loadBestGhostRun().frames;
        this.stopWatch.reset();
        this.stopWatch.start();
    
        // Places the first Snake segment on the bottom left corner.
        // Edit this someday so that the snake cannot die instantly by spawning in front of an obstacle.
        this.snakeSegments.push({x: 0, y: 0, color: ""});

        this.painter.ApplyColorsToSnakeSegments();
        this.recordCurrentFrame();
        this.displaySnakeLength(this.snakeSegments.length);
        this.entityGenerator.generateObstacles();
        this.entityGenerator.generateMovingObstacles();
        this.entityGenerator.generateFood();
        this.controller?.disable();
        if(this.diagonalMovementAllowed){
            this.controller = new DiagonalController(document, this);
        }else{
            this.controller = new StraightController(document, this);
        }
        this.controller.enable();
        const muted = localStorage.getItem("musicMuted") === "true";
        if (!muted) {
            this.audioPlayer.playBackgroundMusic();
        } else {
            this.audioPlayer.pauseBackgroundMusic();
        }
        this.snakeInterval = setInterval(this.snakeLoop, 125);
        this.movingObstacleInterval = setInterval(this.movingObstacleLoop, 1000);
    }

    //Stops the snake and background ambience.
    public killSnake = (): void => {
        clearInterval(this.snakeInterval);
        this.stopWatch.stop();
        this.audioPlayer.stopAllSounds();
        this.audioPlayer.playGameOverSound();
    }

    public exitGame = (): void =>{
        this.killSnake();
        clearInterval(this.movingObstacleInterval);
        this.controller.disable();
        window.removeEventListener("storage", this.handleMuteChange);
    }

    public clearIntervals = (): void =>{
        clearInterval(this.snakeInterval);
        clearInterval(this.movingObstacleInterval);
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
            const duration = this.stopWatch.getTime();
            this.highscores.saveScore(playerName, score);
            this.highscores.uploadScore(playerName, score, duration);
            this.persistLastRunStats(score, duration);
            this.persistGhostRun(score, duration);
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
                this.displaySnakeLength(this.snakeSegments.length);
                this.painter.ApplyColorsToSnakeSegments();
            } else {
                this.snakeSegments.pop(); // Remove the tail if no food is eaten
            }

            this.currentTick++;
            this.recordCurrentFrame();
        }
    }

    //This function moves all movable obstacles
    private movingObstacleLoop = (): void => {
        for(const movingObstacle of this.movingObstacles){
            movingObstacle.moveObstacle();
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

    private recordCurrentFrame(): void {
        this.currentRunFrames.push({
            segments: this.snakeSegments.map(segment => ({
                x: segment.x,
                y: segment.y,
            })),
        });
    }

    private persistGhostRun(score: number, duration: number): void {
        if (this.currentRunFrames.length === 0) return;
        const bestGhostRun = this.loadBestGhostRun();
        const isHigherScore = score > bestGhostRun.score;
        const isEqualScoreWithBetterTime =
            score === bestGhostRun.score && (bestGhostRun.duration === 0 || duration < bestGhostRun.duration);

        if (!isHigherScore && !isEqualScoreWithBetterTime) return;

        const nextBestRun: GhostRun = {
            score,
            duration,
            frames: this.currentRunFrames,
        };
        localStorage.setItem(BEST_GHOST_RUN_KEY, JSON.stringify(nextBestRun));
    }

    private persistLastRunStats(score: number, duration: number): void {
        const runStats: RunStats = { score, duration };
        localStorage.setItem(LAST_RUN_STATS_KEY, JSON.stringify(runStats));
    }

    private loadLastRunStats(): RunStats {
        const rawRunStats = localStorage.getItem(LAST_RUN_STATS_KEY);
        if (!rawRunStats) return { score: -1, duration: 0 };

        try {
            const parsed = JSON.parse(rawRunStats);
            return {
                score: typeof parsed?.score === "number" ? parsed.score : -1,
                duration: typeof parsed?.duration === "number" ? parsed.duration : 0,
            };
        } catch (error) {
            console.error("Failed to load last run stats", error);
            return { score: -1, duration: 0 };
        }
    }

    private loadBestGhostRun(): GhostRun {
        const rawGhostRun = localStorage.getItem(BEST_GHOST_RUN_KEY);
        if (!rawGhostRun) return { score: -1, duration: 0, frames: [] };

        try {
            const parsed = JSON.parse(rawGhostRun);
            if (Array.isArray(parsed)) {
                return {
                    score: -1,
                    duration: 0,
                    frames: this.normalizeGhostFrames(parsed),
                };
            }

            const score = typeof parsed?.score === "number" ? parsed.score : -1;
            const duration = typeof parsed?.duration === "number" ? parsed.duration : 0;
            return {
                score,
                duration,
                frames: this.normalizeGhostFrames(parsed?.frames),
            };
        } catch (error) {
            console.error("Failed to load ghost run", error);
            return { score: -1, duration: 0, frames: [] };
        }
    }

    private normalizeGhostFrames(rawFrames: unknown): GhostFrame[] {
        if (!Array.isArray(rawFrames)) return [];

        return rawFrames
            .filter(frame => Array.isArray((frame as GhostFrame)?.segments))
            .map(frame => ({
                segments: (frame as GhostFrame).segments
                    .filter((segment: GhostSegment) =>
                        typeof segment?.x === "number" && typeof segment?.y === "number")
                    .map((segment: GhostSegment) => ({
                        x: segment.x,
                        y: segment.y,
                    })),
            }));
    }
}
export default SinglePlayerLogic;
    
