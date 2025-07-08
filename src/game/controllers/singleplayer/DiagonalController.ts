import { ControllerInterface } from "./ControllerInterface";
import SinglePlayerLogic, { SnakeSegment } from "../../logic/SinglePlayerLogic";

class DiagonalController implements ControllerInterface{
    public document: Document;
    public logic: SinglePlayerLogic;
    public keyDownListener: (key: KeyboardEvent) => void;
    public keyUpListener: (key: KeyboardEvent) => void;

    private illegalInputHeld: string;
    private allowedInputsHeld: string[];
    private directionOnNextTick: string;

    constructor(document: Document, logic: SinglePlayerLogic){
        this.document = document;
        this.logic = logic;
        this.keyUpListener = (key: KeyboardEvent) =>{
            this.removeInputHeld(key.code);
        };
         this.keyDownListener = (key: KeyboardEvent) =>{
            if(key.code === "ArrowUp" || key.code === "KeyW"){ 
                if(this.logic.snakeDirection === 'DOWN'){
                    this.illegalInputHeld = "UP";
                }else{
                    this.addAllowedInputHeld("UP");
                }
            }
            if(key.code === "ArrowRight" || key.code === "KeyD"){
                if(this.logic.snakeDirection === 'LEFT'){
                    this.illegalInputHeld = "RIGHT";
                }else{
                    this.addAllowedInputHeld("RIGHT");
                }
            }
            if(key.code === "ArrowDown" || key.code === "KeyS"){
                if(this.logic.snakeDirection === 'UP'){
                    this.illegalInputHeld = "DOWN";
                    
                }else{
                    this.addAllowedInputHeld("DOWN");
                }
            }
            if(key.code === "ArrowLeft" || key.code === "KeyA"){
                if(this.logic.snakeDirection === 'RIGHT'){
                    this.illegalInputHeld = "LEFT";
                }else{
                    this.addAllowedInputHeld("LEFT");
                }
            }
            if(key.code === "KeyR"){
                this.logic.start();
            }
            if(key.code === "Escape"){
                this.logic.killSnake();
            }
        };
        this.illegalInputHeld = "";
        this.allowedInputsHeld = [];
        this.directionOnNextTick = this.logic.snakeDirection;
    }

    public moveHead(head: SnakeSegment): void {
        //When holding two allowed directions at once, it is possible for the snake to stand still (example: LEFT,RIGHT; UP, DOWN)
        //To avoid this, check if the snake moved in any direction at all, if not, just move one block into the snakeDirection.
        const oldX: number = head.x;
        const oldY: number = head.y;

        if (this.allowedInputsHeld.length === 0){   //Straight creeping, with no input
            const direction: string = this.directionOnNextTick;
            if (direction === 'UP') head.y -= 1;
            if (direction === 'DOWN') head.y += 1;
            if (direction === 'LEFT') head.x -= 1;
            if (direction === 'RIGHT') head.x += 1;
            this.logic.snakeDirection = direction;
        }else{                                      //Diagonal creeping, with input/s
            if (this.allowedInputsHeld.indexOf("UP") !== -1) head.y -= 1;
            if (this.allowedInputsHeld.indexOf("DOWN") !== -1) head.y += 1;
            if (this.allowedInputsHeld.indexOf("LEFT") !== -1) head.x -= 1;
            if (this.allowedInputsHeld.indexOf("RIGHT") !== -1) head.x += 1;
            if (this.allowedInputsHeld.length === 1) this.logic.snakeDirection = this.allowedInputsHeld[0];
        }

        if(oldX - head.x === 0 && oldY - head.y === 0){ //This happens if two inputs are held at the same time. Let the snake creep into its head's direction.
            const direction: string = this.logic.snakeDirection;
            if (direction === 'UP') head.y -= 1;
            if (direction === 'DOWN') head.y += 1;
            if (direction === 'LEFT') head.x -= 1;
            if (direction === 'RIGHT') head.x += 1;
        }

        //After moving the snake check if the input is still illegal
        this.isIllegalInputAllowedNow();
        
        
        const rows: number = this.logic.getRows();
        const columns: number = this.logic.getColumns();
        if(!this.logic.getWallsAreDeadly()){
            //This makes the head appear on the other side of the map if it creeps into a wall.
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

    private removeInputHeld(keyCode: string){
        const inputsHeld: string[] = this.allowedInputsHeld;

        let directionLetGo: string = "";
        if(keyCode === "ArrowUp" || keyCode === "KeyW"){
            directionLetGo = "UP";
        }
        if(keyCode === "ArrowRight" || keyCode === "KeyD"){
            directionLetGo = "RIGHT";
        }
        if(keyCode === "ArrowDown" || keyCode === "KeyS"){
            directionLetGo = "DOWN";
        }
        if(keyCode === "ArrowLeft" || keyCode === "KeyA"){
            directionLetGo = "LEFT";
        }
        
        const inputLetGoPosition: number = inputsHeld.indexOf(directionLetGo);
        //Check if the input was even held in the first place
        if(inputLetGoPosition !== -1){
            //Remove it
            this.allowedInputsHeld = inputsHeld.filter((input) => input !== inputsHeld[inputLetGoPosition]);
        }

        //Clear the illegalInputHeld if it was let go.
        if(this.illegalInputHeld === directionLetGo) this.illegalInputHeld = "";

        this.ifOnlyOneInputSetDirectionOnNextTick(this.allowedInputsHeld[0])
    
    }

    private ifOnlyOneInputSetDirectionOnNextTick(direction: string){
        //directionOnNextTick is equal to the input, if there is only one input
        if(this.allowedInputsHeld.length === 1){
            this.directionOnNextTick = direction;
        }
    }

    private addAllowedInputHeld(key: string){
        if(this.allowedInputsHeld.indexOf(key) === -1){
            this.allowedInputsHeld.push(key);

            //directionOnNextTick is equal to the input, if there is only one input
            this.ifOnlyOneInputSetDirectionOnNextTick(key);
        }
    }

    private isIllegalInputAllowedNow(): void{
        const snakeDirection: string = this.logic.snakeDirection;
        let isAllowedNow: boolean;
        switch (this.illegalInputHeld) {
            case "UP":
                if(snakeDirection === "DOWN")   isAllowedNow = false;
                else                            isAllowedNow = true;
                break;
            case "RIGHT":
                if(snakeDirection === "LEFT")   isAllowedNow = false;
                else                            isAllowedNow = true;
                break;
            case "DOWN":
                if(snakeDirection === "UP")     isAllowedNow = false;
                else                            isAllowedNow = true;
                break;
            case "LEFT":
                if(snakeDirection === "RIGHT")  isAllowedNow = false;
                else                            isAllowedNow = true;
                break;
            default:
                isAllowedNow = false;
        }

        if(isAllowedNow){
            //If its legal now, add it to the allowedInputsHeld
            this.allowedInputsHeld.push(this.illegalInputHeld);
            this.ifOnlyOneInputSetDirectionOnNextTick(this.illegalInputHeld);
            this.illegalInputHeld = "";
        }
    }
}

export default DiagonalController;