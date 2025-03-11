class SnakeColorCalculator{
    private startColor: number[];
    private endColor: number[];

    constructor(startColor: string, endColor: string){
        this.startColor = [];
        this.startColor.push(parseInt(startColor.substring(0, 2), 16)); // Red
        this.startColor.push(parseInt(startColor.substring(2, 4), 16)); // Green
        this.startColor.push(parseInt(startColor.substring(4, 6), 16)); // Blue

        this.endColor = [];
        this.endColor.push(parseInt(endColor.substring(0, 2), 16)); // Red
        this.endColor.push(parseInt(endColor.substring(2, 4), 16)); // Green
        this.endColor.push(parseInt(endColor.substring(4, 6), 16)); // Blue
    }

    //f(x) = a-((a-b)/(l-1))x       !! l-1 != 0
    getColor(snakeSegment: number, snakeLength: number): string{
        let segmentColor: string = "#";
        const a: number[] = this.startColor;
        const b: number[] = this.endColor;
        snakeLength = snakeLength - 1;
        if(snakeLength === 0) snakeLength = 1;
        for(let i = 0; i < 3; i++) {
            segmentColor = segmentColor + Math.floor(a[i]-((a[i]-b[i])/snakeLength)*snakeSegment).toString(16).padStart(2, "0");
        }
        
        return segmentColor;
    }
}
export default SnakeColorCalculator;