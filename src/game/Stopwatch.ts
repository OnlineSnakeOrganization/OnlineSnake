class Stopwatch {
    private startTime: number;
    private intervalId: NodeJS.Timeout | null = null;
    private displayTime:(time: string)=>void
  
    constructor(showTime:(time: string)=>void) {
        this.startTime = 0;
        this.displayTime = showTime;
    }
  
    start() {
        this.stop();
        this.startTime = Date.now();
        this.continue();
    }
  
    continue() {
        this.intervalId = setInterval(() => {
            const elapsedMs = Date.now() - this.startTime;
            const minutes = Math.floor(elapsedMs / 60000);
            const seconds = Math.floor((elapsedMs % 60000) / 1000);
            this.displayTime(this.formatTime(minutes, seconds));
        }, 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
    
    reset(){
        this.displayTime(this.formatTime(0, 0))
    }

    getTime(): number {
        return this.startTime ? Date.now() - this.startTime : 0;
    }
  
    private formatTime(minutes: number, seconds: number): string {
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }
  }

export default Stopwatch;