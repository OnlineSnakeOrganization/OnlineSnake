import SinglePlayerLogic from "./logic/SinglePlayerLogic";

type Position = {x: number, y: number};

class MovingObstacle{
    private logic: SinglePlayerLogic;

    public position: Position;
    private direction: string;

    constructor(logic: SinglePlayerLogic, position: Position, direction: string){
        this.logic = logic;
        this.position = position;
        this.direction = direction;
    }

    public moveObstacle(){
        let new_x: number = this.position.x;
        let new_y: number = this.position.y;
        switch(this.direction){
            case "UP":
                new_y -= 1;
                break;
            case "DOWN":
                new_y += 1;
                break;
            case "LEFT":
                new_x -= 1;
                break;
            case "RIGHT":
                new_x += 1;
                break;
            default:
                this.direction = "UP";
                break;
        }

        let collisionDetected: boolean = false;

        //Let it appear on the other side of the border if the walls are passable
        const columns: number = this.logic.getColumns();
        const rows: number = this.logic.getRows();
        if(!this.logic.getWallsAreDeadly()){
            new_x = (new_x + columns) % columns;
            new_y = (new_y + rows) % rows;
        }else{
            if (new_x < 0 || new_y < 0 || new_x >= columns || new_y >= rows) collisionDetected = true;
        }

        if(!collisionDetected){
            collisionDetected = this.checkCollision(new_x, new_y, [
                ...this.logic.getSnakeSegments(),    //Check for collision with snake
                ...this.logic.getStaticObstacles(),  //Check for collision with static obstacles
                ...this.logic.getMovingObstacles().map(obstacle => obstacle.position)   //Check for collision with other moving obstacles
            ]);
        }
        

        if(!collisionDetected){
            this.position = {x: new_x, y: new_y};
        }else{

            // Rotate the direction of the obstacle clockwise.
            switch(this.direction){
                case "UP":
                    this.direction = "RIGHT";
                    break;
                case "DOWN":
                    this.direction = "LEFT";
                    break;
                case "LEFT":
                    this.direction = "UP";
                    break;
                case "RIGHT":
                    this.direction = "DOWN";
                    break;
                default:
                    this.direction = "UP";
                    break;
            }
        }

    }

    private checkCollision(x: number, y: number, collidableObjects: {x: number, y: number}[]): boolean {
        return collidableObjects.some(collidableObject => collidableObject.x === x && collidableObject.y === y);
    }

}

export default MovingObstacle;