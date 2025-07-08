import Stopwatch from "../Stopwatch";

import StraightController from "../controllers/multiplayer/StraightController";

import AudioPlayer from "../AudioPlayer";
import SnakePainter from "../Painter";
import { NavigateFunction } from "react-router-dom";
import { InitMessage, unionSchema } from "../../schema/schema";
import SnakeColorCalculator from "../SnakeColorCalculator";
export type SnakeSegment = {x: number, y: number, color?: string};
export type Food = {x: number, y: number};
export type Obstacle = {x: number, y: number};
export type Player = {
    playerName: string;
    snakeSegments: SnakeSegment[];
    colorCalculator: SnakeColorCalculator;
}
class MultiplayerLogic {

    private ws: WebSocket | undefined;

    private players: Player[];
    private food: Food[];
    private staticObstacles: Obstacle[];
    private movingObstacles: Obstacle[];

    private rows: number;
    private columns: number;
    private wallsAreDeadly: boolean;

    //private displaySnakeLength: (length: number) => void;
    private painter: SnakePainter;
    private stopWatch: Stopwatch;
    private audioPlayer: AudioPlayer;
    
    //private snakeDirection: string;  //The direction the snake is facing and sneaking towards if no key is held.
    private diagonalMovementAllowed: boolean;
    private controller: StraightController; //Which controller is used depends on 'diagonalMovementAllowed' (Add DiagonalController in the future)

    //private onGameOver: () => void;    //This method triggers the code on the GamePage
    private endGame: () => void;
    private navigate: NavigateFunction;
    private setWsObject: (ws: WebSocket | undefined) => void;

    constructor(
        ws: WebSocket | undefined,
        setWsObject: (ws: WebSocket | undefined) => void,
        //onGameOver: () => void,
        endGame: () => void,
        navigate: NavigateFunction,
        //displaySnakeLength: (length: number) => void,
        displayTime: (time: string) => void
    ) {
        this.setWsObject = setWsObject;
        //this.onGameOver = onGameOver;
        this.endGame = endGame;
        this.navigate = navigate;
        //this.displaySnakeLength = displaySnakeLength;
        
        this.ws = ws;
        this.setupWsHandlers();

        this.rows = 0;
        this.columns = 0;
        this.wallsAreDeadly = false;

        this.painter = new SnakePainter(this);
        this.stopWatch = new Stopwatch(displayTime);
        this.audioPlayer = new AudioPlayer();
        
        //We already refresh theese variables in the start method but we still have to give them some value in the constructor.
        this.players = [];
        //this.snakeDirection = "UP";
        this.diagonalMovementAllowed = false;
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = []
        this.controller = new StraightController(document, this);
    }
    //----------Getter
    public getPlayers(){
        return this.players;
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
    //----------

    private setupWsHandlers(){
        if(this.ws){
            this.ws.onmessage = (event: MessageEvent) => {
                const result = unionSchema.safeParse(JSON.parse(event.data));
                if(!result.success){
                    console.log(result.error)
                    return;
                }
                const msg = result.data;
                switch(msg.type){
                    case "playerInitResponse":
                        this.rows = msg.rows;
                        this.columns = msg.columns;
                        this.players = msg.players.map(player => ({
                            playerName: player.playerName,
                            snakeSegments: player.snakeSegments,
                            colorCalculator: new SnakeColorCalculator(
                                player.startColor || "00ff00",
                                player.endColor || "006600")
                        }));
                        this.food = msg.foodPositions;
                        this.staticObstacles = msg.staticObstaclePositions;
                        this.movingObstacles = msg.movingObstaclePositions;
                        
                        this.players.forEach(player => 
                            this.painter.ApplyColorsToSnakeSegments(player.snakeSegments, player.colorCalculator));
                        break;
                    case "snakeLoop":
                        this.players = msg.players.map(player => ({
                            playerName: player.playerName,
                            snakeSegments: player.snakeSegments,
                            colorCalculator: new SnakeColorCalculator(
                                player.startColor || "00ff00",
                                player.endColor || "006600")
                        }));
                        this.food = msg.food;
                        this.players.forEach(player => 
                            this.painter.ApplyColorsToSnakeSegments(player.snakeSegments, player.colorCalculator));
                        break;
                    case "movingObstacleLoop":
                        this.movingObstacles = msg.movingObstacles;
                        break;
                    default:
                        console.error("Invalid type recieved")
                }
              };
            this.ws.onclose = () => {
                console.log('Connection closed.');
                this.killSnake();
                this.setWsObject(undefined); //Removes the WebSocket Object.
                this.endGame();
                this.navigate("/");
            };
            this.ws.onerror = (error: Event) => {
                console.error('WebSocket error:', error);
            };
        } 
    }

    public start(): void {
        this.audioPlayer.stopAllSounds();

        // Resetting all Game-Variables
        //this.snakeDirection = "UP";
        this.food = [];
        this.staticObstacles = [];
        this.movingObstacles = [];
        this.stopWatch.reset();
        this.stopWatch.start();

        //this.displaySnakeLength(this.snakeSegments.length);
        this.controller?.disable();
        if(this.diagonalMovementAllowed){
            this.controller = new StraightController(document, this);   //Add the diagonal controller
        }else{
            this.controller = new StraightController(document, this);
        }
        this.controller.enable();
        this.audioPlayer.playBackgroundMusic();

        // Ask for Basic Data.
        const message: InitMessage = {
                type: "playerInitRequest",
                playerName: localStorage.getItem('playerName') || 'Unknown'
            }
        this.ws?.send(JSON.stringify(message));

        // Start listening to the Server
    }

    public getWs(){
        return this.ws;
    }

    //Stops the snake and background ambience.
    public killSnake = (): void => {
        this.stopWatch.stop();
        this.audioPlayer.stopAllSounds();
        this.audioPlayer.playGameOverSound();
    }

    public exitGame = (): void =>{
        this.killSnake();
        this.controller.disable();
    }
}
export default MultiplayerLogic;
