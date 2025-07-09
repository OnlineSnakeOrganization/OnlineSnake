import MovingObstacle from "./MovingObstacle";
import SinglePlayerLogic, { Food, Obstacle } from "./logic/SinglePlayerLogic";

class EntityGenerator{
    private logic: SinglePlayerLogic;

    constructor(logic: SinglePlayerLogic){
        this.logic = logic;
    }
    
    public generateFood = (): void => {
        const rows: number = this.logic.getRows();
        const columns: number = this.logic.getColumns();
        const food: Food[] = this.logic.getFood();

        let availableBlocksForNewFood: Food[] = [];     // An array of free blocks where food could spawn
        for (let row = 0; row < rows; row++) {     // Fill it up
            for (let column = 0; column < columns; column++) {
                const availableBlock: Food = { x: column, y: row };
                availableBlocksForNewFood.push(availableBlock);
            }
        }
        // Then remove all the blocks which are already taken
        // Food cannot spawn where there are snake segments => Remove the blocks taken by the snake
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !this.logic.getSnakeSegments().some(segment => ob.x === segment.x && ob.y === segment.y));
        // Food cannot spawn on other food => Remove the blocks taken by other food
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !food.some(food => ob.x === food.x && ob.y === food.y));
        // Food cannot spawn on staticObstacles => Remove the blocks taken by staticObstacles
        availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !this.logic.getStaticObstacles().some(staticObstacle => ob.x === staticObstacle.x && ob.y === staticObstacle.y));

        // Always make sure to spawn the maximum Amount of food allowed and possible
        while (food.length < this.logic.getMaxAmountOfFood() && availableBlocksForNewFood.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForNewFood.length);
            food.push({ ...availableBlocksForNewFood[randomIdx] });

            // Make this used ob now unavailable
            availableBlocksForNewFood = availableBlocksForNewFood.filter(ob => !(ob.x === availableBlocksForNewFood[randomIdx].x && ob.y === availableBlocksForNewFood[randomIdx].y));
        }
    }

    public generateObstacles = (): void =>{
        
        let availableBlocksForObstacles: Obstacle[] = [];
        for (let row = 0; row < this.logic.getRows(); row++) {     // Fill it up
            for (let column = 0; column < this.logic.getColumns(); column++) {
                const availableBlock: Obstacle = { x: column, y: row };
                availableBlocksForObstacles.push(availableBlock);
            }
        }

        const staticObstacles: Obstacle[] = this.logic.getStaticObstacles();
        while (staticObstacles.length < this.logic.getMaxAmountOfStaticObstacles()
     && availableBlocksForObstacles.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForObstacles.length);
            staticObstacles.push({ ...availableBlocksForObstacles[randomIdx] });

            // Make this used ob now unavailable
            availableBlocksForObstacles = availableBlocksForObstacles.filter(ob => !(ob.x === availableBlocksForObstacles[randomIdx].x && ob.y === availableBlocksForObstacles[randomIdx].y));
        }
    }

    public generateMovingObstacles = (): void =>{
        const randomDirection = (): string => {
            const directions = ["UP", "DOWN", "LEFT", "RIGHT"];
            return directions[Math.floor(Math.random() * 4)];
        };

        let availableBlocksForMovingObstacles: MovingObstacle[] = [];
        for (let row = 0; row < this.logic.getRows(); row++) {     // Fill it up
            for (let column = 0; column < this.logic.getColumns(); column++) {
                const availableBlock: MovingObstacle = new MovingObstacle(this.logic, {x: column, y: row}, randomDirection());
                availableBlocksForMovingObstacles.push(availableBlock);
            }
        }

        // Food cannot spawn on staticObstacles => Remove the blocks taken by staticObstacles
        availableBlocksForMovingObstacles = availableBlocksForMovingObstacles
            .filter(ob => !this.logic.getStaticObstacles()
            .some(staticObstacle => 
                ob.position.x === staticObstacle.x && ob.position.y === staticObstacle.y));
        const movingObstacles: MovingObstacle[] = this.logic.getMovingObstacles();
        while (movingObstacles.length < this.logic.getMaxAmountOfMovingObstacles()
     &&     availableBlocksForMovingObstacles.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * availableBlocksForMovingObstacles.length);
            movingObstacles.push(availableBlocksForMovingObstacles[randomIdx]);
            // Make this used ob now unavailable
            availableBlocksForMovingObstacles = availableBlocksForMovingObstacles.filter(ob => !(ob.position.x === availableBlocksForMovingObstacles[randomIdx].position.x && ob.position.y === availableBlocksForMovingObstacles[randomIdx].position.y));
        }
    }
}

export default EntityGenerator;