class AudioPlayer{
    private gameOverAudio: HTMLAudioElement | undefined;
    private backgroundMusic: HTMLAudioElement | undefined;

    constructor(){
        // Load the Audio files (Vite/React: Asset-Import)
        this.gameOverAudio = new Audio(new URL("../assets/death.wav", import.meta.url).href);
        this.gameOverAudio.volume = 0.1;
        this.backgroundMusic = new Audio(new URL("../assets/ambience.mp3", import.meta.url).href);
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.05;
    }

    public playGameOverSound() {
        if (this.gameOverAudio) {
            this.gameOverAudio.currentTime = 0;
            this.gameOverAudio.play();
        }
    }

    public playBackgroundMusic() {
        if (this.backgroundMusic) {
            this.backgroundMusic.currentTime = 0;
            this.backgroundMusic.play();
        }
    }

    public stopAllSounds() {
        if (this.backgroundMusic) {
            this.backgroundMusic.pause();
            this.backgroundMusic.currentTime = 0;
        }
        if (this.gameOverAudio) {
            this.gameOverAudio.pause();
            this.gameOverAudio.currentTime = 0;
        }
    }
}

export default AudioPlayer;