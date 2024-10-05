export default class AudioManager {
    // A list of the background music
    static backgroundMusic = [
        new Audio("../../audio/background/hepcats.mp3"),
    ];

    // Which background music is currently playing?
    static backgroundMusicIndex = 0;

    // Callback functions
    static callbackFunctions = [];

    // The number of things that need to be loaded
    static needLoad = this.backgroundMusic.length;

    // Add a callback function
    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // Load the audio
    static Load() {
        this.backgroundMusic.forEach(a=>a.loop = true);
        const func = this.callbackFunctions;
        for (let music of this.backgroundMusic) {
            music.load();

            music.addEventListener("canplaythrough", ()=>{
                if (--this.needLoad <= 0) {
                    func.forEach(a=>a());
                }
            });
        }
    }

    static PlayBackgroundMusic() {
        // Try to play background music
        this.backgroundMusic[this.backgroundMusicIndex].play();
        
        // Check if it actually played
        if (!this.backgroundMusic[this.backgroundMusicIndex].paused) return;
        
        // Uh oh, 再試一次 
        setTimeout(this.PlayBackgroundMusic.bind(this), 500);

    }
    static PauseBackgroundMusic() {
        this.backgroundMusic[this.backgroundMusicIndex].pause();
    }
    static Update() {
        if (this.backgroundMusic[this.backgroundMusicIndex].paused) {
            this.NextSong();
        }
    }
    static NextSong() {
        console.log("Next song!");
        this.PauseBackgroundMusic();[]
        this.backgroundMusic[this.backgroundMusicIndex].currentTime = 0;
        this.backgroundMusicIndex = (++this.backgroundMusicIndex) % this.backgroundMusic.length;
        this.backgroundMusic[this.backgroundMusicIndex].play();
    }
}
