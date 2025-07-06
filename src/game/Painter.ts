import SinglePlayerLogic from "./SinglePlayerLogic";
import SnakeColorGradient from "./SnakeColorCalculator";

class Painter{
    private logic: SinglePlayerLogic;
    private snakeColorGradient: SnakeColorGradient;

    constructor(logic: SinglePlayerLogic){
        this.logic = logic;
        this.snakeColorGradient = new SnakeColorGradient("00ff00", "006600");
                    //Gold-Bone - "DCAD00", "D2CEBF"
                    //Blau Türkis - "0000ff", "00ffff"
                    //Türkis Orange - "00ffff", "FF9100"
                    //Grün DunkelGrün - "00FF00", "006100"
                    //Rot Orange - "FF1900", "FF9100"
    }

    public ApplyColorsToSnakeSegments = (): void =>{
        const snakeLength: number = this.logic.snakeSegments.length;
        for(let i = 0; i < this.logic.snakeSegments.length; i++){
            this.logic.snakeSegments[i].color = this.snakeColorGradient.getColor(i, snakeLength);
        }
    }

    public pullSnakeColorsToTheHead = (): void =>{
        for(let i = 1; i < this.logic.snakeSegments.length; i++){
            this.logic.snakeSegments[i-1].color = this.logic.snakeSegments[i].color;
        }
    }
}

export default Painter;