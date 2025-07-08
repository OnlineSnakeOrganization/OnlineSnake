import { ControllerInterface } from "./ControllerInterface";
import SinglePlayerLogic, { SnakeSegment } from "../../logic/SinglePlayerLogic";

class StraightController implements ControllerInterface{
    public document: Document;
    public logic: SinglePlayerLogic;
    public keyDownListener;
    public keyUpListener;

    private inputsHeld: string[];

    constructor(document: Document, logic: SinglePlayerLogic) {
        this.document = document;
        this.logic = logic;
        this.inputsHeld = [];
        this.keyDownListener = (key: KeyboardEvent) =>{
            //Add the inputs held to an array and then use the oldest one.
            if(key.code === "ArrowUp" || key.code === "KeyW"){ 
                if(!this.inputsHeld.includes("UP")){
                    this.inputsHeld.unshift("UP");
                }
            }
            if(key.code === "ArrowRight" || key.code === "KeyD"){
                if(!this.inputsHeld.includes("RIGHT")){
                    this.inputsHeld.unshift("RIGHT");
                }
            }
            if(key.code === "ArrowDown" || key.code === "KeyS"){
                if(!this.inputsHeld.includes("DOWN")){
                    this.inputsHeld.unshift("DOWN");
                }
            }
            if(key.code === "ArrowLeft" || key.code === "KeyA"){
                if(!this.inputsHeld.includes("LEFT")){
                    this.inputsHeld.unshift("LEFT");
                }
            }
            if(key.code === "KeyR"){
                this.logic.start();
            }
            if(key.code === "Escape"){
                this.logic.exitGame();
            }
        };
        this.keyUpListener = (key: KeyboardEvent) =>{
            let inputLetGo: string = "";
            if(key.code === "ArrowUp" || key.code === "KeyW"){
                inputLetGo = "UP";
            }
            if(key.code === "ArrowRight" || key.code === "KeyD"){
                inputLetGo = "RIGHT";
            }
            if(key.code === "ArrowDown" || key.code === "KeyS"){
                inputLetGo = "DOWN";
            }
            if(key.code === "ArrowLeft" || key.code === "KeyA"){
                inputLetGo = "LEFT";
            }

            if(this.inputsHeld.length === 1){
                console.log("Let Go of " + this.inputsHeld[0])
                this.setSnakeDirectionToLatestInputIfAllowed();
                this.inputsHeld = [];
            }else{
                this.inputsHeld = this.inputsHeld.filter(input => input !== inputLetGo);
            }
            
        }
    }

    public moveHead(head: SnakeSegment) {
        this.setSnakeDirectionToLatestInputIfAllowed();
        console.log(this.inputsHeld + " | "+ this.logic.snakeDirection)
        if (this.logic.snakeDirection === 'UP') head.y -= 1;
        if (this.logic.snakeDirection === 'DOWN') head.y += 1;
        if (this.logic.snakeDirection === 'LEFT') head.x -= 1;
        if (this.logic.snakeDirection === 'RIGHT') head.x += 1;

        if(!this.logic.getWallsAreDeadly()){
            //This makes the head appear on the other side of the map if it creeps into a wall.
            const columns: number = this.logic.getColumns();
            const rows: number = this.logic.getRows();
            head.x = (head.x + columns) % columns;
            head.y = (head.y + rows) % rows;
        }
    }

    public enable() {
        this.document.addEventListener("keydown", this.keyDownListener);
        this.document.addEventListener("keyup", this.keyUpListener);
    }

    public disable() {
        this.document.removeEventListener("keydown", this.keyDownListener);
        this.document.removeEventListener("keyup", this.keyUpListener);
    }

    private setSnakeDirectionToLatestInputIfAllowed(){
        const newDirection: string = this.inputsHeld[0];
        if(newDirection){
            switch(this.logic.snakeDirection){
                case "UP":
                    if(newDirection !== "DOWN"){
                        this.logic.snakeDirection = newDirection;
                    }
                    break;
                case "DOWN":
                    if(newDirection !== "UP"){
                        this.logic.snakeDirection = newDirection;
                    }
                    break;
                case "LEFT":
                    if(newDirection !== "RIGHT"){
                        this.logic.snakeDirection = newDirection;
                    }
                    break;
                case "RIGHT":
                    if(newDirection !== "LEFT"){
                        this.logic.snakeDirection = newDirection;
                    }
                    break;
            }
        }
    }

}

export default StraightController;