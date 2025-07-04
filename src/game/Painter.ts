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
  
    public drawBoard = (): void =>{
        for(let i = 0; i < this.logic.snakeSegments.length; i++){
            const segment = this.logic.snakeSegments[i];
            this.logic.setBlockColor(segment.y, segment.x, segment.color); // <-- Reihenfolge geändert!
        }
        for (const staticObstacle of this.logic.staticObstacles) {
            this.logic.setBlockColor(staticObstacle.y, staticObstacle.x, "blue"); // <-- Reihenfolge geändert!
        }
        for (const food of this.logic.food) {
            this.logic.setBlockColor(food.y, food.x, "pink"); // <-- Reihenfolge geändert!
        }
        for (const movingObstacle of this.logic.movingObstacles){
            this.logic.setBlockColor(movingObstacle.position.y, movingObstacle.position.x, "#30D5C8"); // <-- Reihenfolge geändert!
        }
    }
}

export default Painter;