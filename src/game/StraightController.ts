class StraightController {
    private document: Document;
    private keyDownListener;
    private snakeDirection: string;
    private illegalInputHeld: string;
  
    constructor(document: Document) {
        this.document = document;
        this.snakeDirection = "UP";
        this.illegalInputHeld = ""
        this.keyDownListener = (key: KeyboardEvent) =>{
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
    }
    start() {
        throw new Error("Method not implemented.");
    }
    stopGame() {
        throw new Error("Method not implemented.");
    }
    private addAllowedInputHeld(arg0: string) {
        throw new Error("Method not implemented." + arg0);
    }
  
}

export default StraightController;