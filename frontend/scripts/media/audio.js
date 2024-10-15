import SettingsModal from "../ui/modals/settingsModal.js";
import CatImages from "./images/catimages.js";

export default class AudioManager {
    // A list of the background music
    static backgroundMusic = [
        new Audio("audio/background/hepcats.mp3"),
    ];

    // A list of special cat tunes
    static catTunes = {
        santa: new Audio("audio/special/meow-ride.mp3"),
        nyan: new Audio("audio/special/nyan.mp3")
    }

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

    // Play a sound effect
    static Play(effect) {
        // Set the volume of the sound effect
        effect.volume = SettingsModal.values.effectsVolume.value;

        // Check if it is zero
        if (effect === 0) return;

        effect.currentTime = 0;
        effect.play();
    }

    // Play a special tune for the cats
    static PlayCatTune(index) {
        switch (index) {
            case CatImages.SANTA_CAT:
                this.Play(this.catTunes.santa);
                break;
            case CatImages.NYAN_CAT:
                this.Play(this.catTunes.nyan);
                break;
        }
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

        // Set some event listeners
        SettingsModal.AddCallback(SettingsModal.values.backgroundVolume, (function(volume) {
            this.backgroundMusic.forEach(function(music) {
                music.volume = volume;
            });
        }).bind(this), "input");
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
        this.PauseBackgroundMusic();
        this.backgroundMusic[this.backgroundMusicIndex].currentTime = 0;
        this.backgroundMusicIndex = (++this.backgroundMusicIndex) % this.backgroundMusic.length;
        this.backgroundMusic[this.backgroundMusicIndex].play();
    }
}
