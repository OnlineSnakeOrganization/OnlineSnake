import { StraightControllerMovementInputsHeldMessage } from "../../../schema/schema";
import MultiplayerLogic from "../../logic/MultiPlayerLogic";
import { ControllerInterface } from "./ControllerInterface";

class StraightController implements ControllerInterface{
    public document: Document;
    public logic: MultiplayerLogic;
    public keyDownListener;
    public keyUpListener;

    private movementInputsHeld: string[];

    constructor(document: Document, logic: MultiplayerLogic) {
        this.document = document;
        this.logic = logic;
        this.movementInputsHeld = [];
        this.keyDownListener = (key: KeyboardEvent) =>{
            let movementInputsChanged: boolean = false;

            //Add the inputs held to an array and then use the oldest one.
            if(key.code === "ArrowUp" || key.code === "KeyW"){ 
                if(!this.movementInputsHeld.includes("UP")){
                    this.movementInputsHeld.unshift("UP");
                    movementInputsChanged = true;
                }
            }
            if(key.code === "ArrowRight" || key.code === "KeyD"){
                if(!this.movementInputsHeld.includes("RIGHT")){
                    this.movementInputsHeld.unshift("RIGHT");
                    movementInputsChanged = true;
                }
            }
            if(key.code === "ArrowDown" || key.code === "KeyS"){
                if(!this.movementInputsHeld.includes("DOWN")){
                    this.movementInputsHeld.unshift("DOWN");
                    movementInputsChanged = true;
                }
            }
            if(key.code === "ArrowLeft" || key.code === "KeyA"){
                if(!this.movementInputsHeld.includes("LEFT")){
                    this.movementInputsHeld.unshift("LEFT");
                    movementInputsChanged = true;
                }
            }

            if(movementInputsChanged) this.sendMovementInputsHeldMessage();

            if(key.code === "KeyR"){
                //Tell the server the player wants to kys
                
            }
            if(key.code === "Escape"){
                this.logic.getWs()?.close();
                this.disable();
            }
        };
        this.keyUpListener = (key: KeyboardEvent) =>{
            let movementInputsChanged: boolean = false;

            let inputLetGo: string = "";
            if(key.code === "ArrowUp" || key.code === "KeyW"){
                inputLetGo = "UP";
                movementInputsChanged = true;
            }
            if(key.code === "ArrowRight" || key.code === "KeyD"){
                inputLetGo = "RIGHT";
                movementInputsChanged = true;
            }
            if(key.code === "ArrowDown" || key.code === "KeyS"){
                inputLetGo = "DOWN";
                movementInputsChanged = true;
            }
            if(key.code === "ArrowLeft" || key.code === "KeyA"){
                inputLetGo = "LEFT";
                movementInputsChanged = true;
            }

            if(this.movementInputsHeld.length === 1){
                this.movementInputsHeld = [];
            }else{
                this.movementInputsHeld = this.movementInputsHeld.filter(input => input !== inputLetGo);
            }

            if(movementInputsChanged) this.sendMovementInputsHeldMessage();
            
        }
    }

    private sendMovementInputsHeldMessage(): void{
        const message: StraightControllerMovementInputsHeldMessage = {
                type: "straightControllerMovementInputsHeld",
                movementInputsHeld: this.movementInputsHeld
            }
        this.logic.getWs()?.send(JSON.stringify(message));
    }

    public enable() {
        this.document.addEventListener("keydown", this.keyDownListener);
        this.document.addEventListener("keyup", this.keyUpListener);
    }

    public disable() {
        this.document.removeEventListener("keydown", this.keyDownListener);
        this.document.removeEventListener("keyup", this.keyUpListener);
    }

}

export default StraightController;