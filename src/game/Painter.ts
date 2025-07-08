import MultiplayerLogic, { SnakeSegment } from "./logic/MultiPlayerLogic";
import SinglePlayerLogic from "./logic/SinglePlayerLogic";
import SnakeColorCalculator from "./SnakeColorCalculator";

class SnakePainter{
    private logic: SinglePlayerLogic | MultiplayerLogic;
    private snakeColorCalculator: SnakeColorCalculator | undefined; //Only for SinglePlayer

    constructor(logic: SinglePlayerLogic | MultiplayerLogic){
        this.logic = logic;
        if(logic instanceof SinglePlayerLogic){
            this.snakeColorCalculator = new SnakeColorCalculator("00ff00", "006600");
                    //Gold-Bone - "DCAD00", "D2CEBF"
                    //Blau Türkis - "0000ff", "00ffff"
                    //Türkis Orange - "00ffff", "FF9100"
                    //Grün DunkelGrün - "00FF00", "006100"
                    //Rot Orange - "FF1900", "FF9100"
        }          
    }

    public ApplyColorsToSnakeSegments = (snakeSegments?: SnakeSegment[], snakeCoorCalculator?: SnakeColorCalculator): void =>{
        if(this.snakeColorCalculator && this.logic instanceof SinglePlayerLogic){
            const snakeLength: number = this.logic.getSnakeSegments().length;
            for(let i = 0; i < snakeLength; i++){
                this.logic.getSnakeSegments()[i].color = this.snakeColorCalculator.getColor(i, snakeLength);
            }
        }else{
            if(snakeSegments && snakeCoorCalculator){
                const snakeLength: number = snakeSegments.length
                for(let i = 0; i < snakeLength; i++){
                    snakeSegments[i].color = snakeCoorCalculator.getColor(i, snakeLength);
                }
            }else{
                console.error("The Method 'ApplyColorsToSnakeSegments' was called incorrectly");
            }
        }
    }

    public pullSnakeColorsToTheHead = (snakeSegments?: SnakeSegment[]): void =>{
        if(this.logic instanceof SinglePlayerLogic){
            const snakeSegments: SnakeSegment[] = this.logic.getSnakeSegments()
            for(let i = 1; i < snakeSegments.length; i++){
                snakeSegments[i-1].color = snakeSegments[i].color;
            }
        }else{
            if(snakeSegments){
                for(let i = 1; i < snakeSegments.length; i++){
                    snakeSegments[i-1].color = snakeSegments[i].color;
                }
            }else{
                console.error("The Method 'pullSnakeColorsToTheHead' was called incorrectly")
            }
        }
        
    }
}

export default SnakePainter;