import Stopwatch from "../game/Stopwatch";
import SnakeColorCalculator from "./SnakeColorCalculator";
type SnakeSegment = {x: number, y: number, color: string};
type Food = {x: number, y: number};
class SinglePlayerLogic{
    private snakeSegments: SnakeSegment[];
    private food: Food[]
    private maxAmountOfFood: number;
    private rows: number;
    private columns: number;
    private wallsAreDeadly: boolean;

    private setBlockColor: (row: number, column: number, newColor: string) => void;
    private clearBoard: () => void;
    private displaySnakeLength: (length: number) => void;
    private stopWatch: Stopwatch
    private snakeColor: SnakeColorCalculator;
    
    private snakeDirection: string;         //direction the snake is facing towards
    private directionOnNextTick: string;    //input direction
    private allowedInputsHeld: string[];
    private illegalInputHeld: string;
    private diagonalMovementAllowed: boolean;
    private keyUpListener = (key: KeyboardEvent) =>{
        this.removeInputHeld(key.code);
    };
    private keyDownListener = (key: KeyboardEvent) =>{
        if(key.code === "ArrowUp" || key.code === "KeyW"){ 
            if(this.snakeDirection === 'DOWN'){
                this.illegalInputHeld = "UP";
            }else{
                this.addAllowedInputHeld("UP");
            }
        }
        if(key.code === "ArrowRight" || key.code === "KeyD"){
            if(this.snakeDirection === 'LEFT'){
                this.illegalInputHeld = "RIGHT";
            }else{
                this.addAllowedInputHeld("RIGHT");
            }
        }
        if(key.code === "ArrowDown" || key.code === "KeyS"){
            if(this.snakeDirection === 'UP'){
                this.illegalInputHeld = "DOWN";
                
            }else{
                this.addAllowedInputHeld("DOWN");
            }
        }
        if(key.code === "ArrowLeft" || key.code === "KeyA"){
            if(this.snakeDirection === 'RIGHT'){
                this.illegalInputHeld = "LEFT";
            }else{
                this.addAllowedInputHeld("LEFT");
            }
        }
        if(key.code === "KeyR"){
            this.stopGame();
            this.start();
        }
        if(key.code === "Escape"){
            this.stopGame();
        }
    };

    private gameInterval: NodeJS.Timeout | undefined;

    constructor(rows: number, columns: number, wallsAreDeadly: boolean,setBlockColor: (column: number, rows: number, newColor: string) => void, 
                clearBoard:()=>void, displaySnakeLength:(length: number)=>void, displayTime:(time:string)=>void){
        this.rows = rows;
        this.columns = columns
        this.wallsAreDeadly = wallsAreDeadly;
        this.setBlockColor = setBlockColor;
        this.clearBoard = clearBoard;
        this.displaySnakeLength = displaySnakeLength;
        this.snakeColor = new SnakeColorCalculator("FF1900", "FF9100");
                    //Gold-Bone - "DCAD00", "D2CEBF"
                    //Blau Türkis - "0000ff", "00ffff"
                    //Türkis Orange - "00ffff", "FF9100"
                    //Grün DunkelGrün - "00FF00", "006100"
                    //Rot Orange - "FF1900", "FF9100"
        this.maxAmountOfFood = 20;
        this.stopWatch = new Stopwatch(displayTime);

        //We already refresh theese variables in the start method but the compiler isnt happy.
        this.directionOnNextTick = "UP";
        this.snakeDirection = "UP";
        this.allowedInputsHeld = [];
        this.illegalInputHeld = "";
        this.diagonalMovementAllowed = true;
        this.snakeSegments = [];
        this.food = [];
    }

    gameLoop = (): void => {    //Arrow Function because else "this" would be different
        // Create another Snakesegment
        const head = { ...this.snakeSegments[0] };
        if(this.diagonalMovementAllowed)    this.moveHead_withDiagonal(head);
        else                                this.moveHead_straight(head);
        this.snakeSegments.unshift(head);   //Add it to the front of the Snake

        this.pullSnakeColorsToTheHead();    //To keep the colors after each movement.

        if (this.isGameOver()) {
            this.stopGame();
        }else{
            //Check if the snake eats food
            let justAteFood: boolean = false;
            for (let i = 0; i < this.food.length; i++) {
                if (head.x === this.food[i].x && head.y === this.food[i].y){
                    justAteFood = true;
                    this.food = this.food.filter(food => !(food.x === head.x && food.y === head.y));
                    break;
                }
            }
            if(justAteFood === true){
                this.generateFood();
                this.displaySnakeLength(this.snakeSegments.length);
                this.resetSnakeColors();
            }else{
                const lastSegment: SnakeSegment = this.snakeSegments[this.snakeSegments.length-1];
                this.setBlockColor(lastSegment.x, lastSegment.y, "black")
                this.snakeSegments.pop(); // Remove the tail if no food is eaten
            }
            this.drawBoard();
        }
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

    private moveHead_withDiagonal(head: SnakeSegment){
        
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
            this.snakeDirection = direction;
        }else{                                      //Diagonal creeping, with input/s
            if (this.allowedInputsHeld.indexOf("UP") !== -1) head.y -= 1;
            if (this.allowedInputsHeld.indexOf("DOWN") !== -1) head.y += 1;
            if (this.allowedInputsHeld.indexOf("LEFT") !== -1) head.x -= 1;
            if (this.allowedInputsHeld.indexOf("RIGHT") !== -1) head.x += 1;
            if (this.allowedInputsHeld.length === 1) this.snakeDirection = this.allowedInputsHeld[0];
        }

        if(oldX - head.x === 0 && oldY - head.y === 0){ //This happens if two inputs are held at the same time. Let the snake creep into its head's direction.
            const direction: string = this.snakeDirection;
            if (direction === 'UP') head.y -= 1;
            if (direction === 'DOWN') head.y += 1;
            if (direction === 'LEFT') head.x -= 1;
            if (direction === 'RIGHT') head.x += 1;
        }

        //After moving the snake check if the input is still illegal
        this.isIllegalInputAllowedNow();
        
        if(!this.wallsAreDeadly){
            //This makes the head appear on the other side of the map if it creeps into a wall.
            head.x = (head.x + this.columns) % this.columns;
            head.y = (head.y + this.rows) % this.rows;
        }
    }

    private moveHead_straight(head: SnakeSegment){
        let direction: string;
        if (this.allowedInputsHeld.length === 0){
            this.isIllegalInputAllowedNow();
            direction = this.snakeDirection;
        }else{
            direction = this.allowedInputsHeld[0];
        }
        
        if (direction === 'UP') head.y -= 1;
        if (direction === 'DOWN') head.y += 1;
        if (direction === 'LEFT') head.x -= 1;
        if (direction === 'RIGHT') head.x += 1;
        this.snakeDirection = direction;

        console.log("ALLOWED: " + this.allowedInputsHeld)

        if(!this.wallsAreDeadly){
            //This makes the head appear on the other side of the map if it creeps into a wall.
            head.x = (head.x + this.columns) % this.columns;
            head.y = (head.y + this.rows) % this.rows;
        }
    }

    private isIllegalInputAllowedNow(): void{
        const snakeDirection: string = this.snakeDirection;
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

    resetSnakeColors = ():void =>{
        const snakeLength: number = this.snakeSegments.length;
        for(let i = 0; i < this.snakeSegments.length; i++){
            this.snakeSegments[i].color = this.snakeColor.getColor(i, snakeLength);
        }
    }

    pullSnakeColorsToTheHead = ():void =>{
        for(let i = 1; i < this.snakeSegments.length; i++){
            this.snakeSegments[i-1].color = this.snakeSegments[i].color;
        }
    }

    

    generateFood = (): void =>{
        let availableBlocksForNewFood: Food[] = [];   //An array of free blocks where food could spawn
        for (let row = 0; row < this.rows; row++) {
            for (let column = 0; column < this.columns; column++) {
                const place: Food = {x: column, y: row};
                availableBlocksForNewFood.push(place);
            }
        }
        
        //Food cannot spawn where there are snake segments => Remove the blocks taken by the snake
        availableBlocksForNewFood = availableBlocksForNewFood.filter(block => !this.snakeSegments.some(segment => block.x === segment.x && block.y === segment.y));
        //Food cannot spawn on other food => Remove the blocks taken by other food
        availableBlocksForNewFood = availableBlocksForNewFood.filter(place => !this.food.some(food => place.x === food.x && place.y === food.y));

        //Always make sure to spawn the maximum Amount of food allowed and possible
        while(this.food.length < this.maxAmountOfFood && availableBlocksForNewFood.length > 0){ 
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForNewFood.length);
            this.food.push({ ...availableBlocksForNewFood[randomIdx] });
            
            //Make this used block now unavailable
            availableBlocksForNewFood = availableBlocksForNewFood.filter(place => !(place.x === availableBlocksForNewFood[randomIdx].x && place.y === availableBlocksForNewFood[randomIdx].y));
        }
    }

    isGameOver = (): boolean =>{
        const head = this.snakeSegments[0];
        // Check wall collision
        if (head.x < 0 || head.y < 0 || head.x >= this.columns || head.y >= this.rows) return true;

        // Check self collision
        for (let i = 1; i < this.snakeSegments.length-1; i++) {   //Start i=1 because we dont compare the head to itself, also running into the tail is fine so length-1
            if (head.x === this.snakeSegments[i].x && head.y === this.snakeSegments[i].y) return true;
        }
        return false;
    }

    start(): void {
        this.directionOnNextTick = "UP";
        this.snakeDirection = "UP";
        this.snakeSegments = [];
        this.food = [];
        this.clearBoard();
        this.stopWatch.reset();
        this.stopWatch.start();
    
        this.snakeSegments.push(
            {   x: Math.floor(Math.random() * (this.columns-6))+3,
                y: Math.floor(Math.random() * (this.rows-6))+3,
                color: ""}
        );   //Place the first Snake segment randomly on the board but with a distance to the border

        this.resetSnakeColors();
        this.displaySnakeLength(this.snakeSegments.length);
        this.generateFood();
        document.addEventListener("keydown", this.keyDownListener);
        document.addEventListener("keyup", this.keyUpListener);
        this.gameInterval = setInterval(this.gameLoop, 125);
    }

    drawBoard = (): void =>{
        for(let i = 0; i < this.snakeSegments.length; i++){
            const segment = this.snakeSegments[i];
            this.setBlockColor(segment.x, segment.y, segment.color); 
            //Only calc colors when food was eaten
        }

        for(const food of this.food){
            this.setBlockColor(food.x, food.y, "pink")
        }
    }

    stopGame = (): void => {
        clearInterval(this.gameInterval);
        this.stopWatch.stop();
    }

    exit = (): void =>{
        this.stopGame();
        document.removeEventListener("keydown", this.keyDownListener);    //Disables the inputs
        document.removeEventListener("keyup", this.keyUpListener);
    }
}
export default SinglePlayerLogic;
