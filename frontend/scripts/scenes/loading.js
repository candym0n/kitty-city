import Scene from "./scene.js";
import CatImages from "../media/images/catimages.js";
import BuildingImages from "../media/images/buildingimages.js";
import BackgroundImages from "../media/images/backgroundimages.js";
import ImageLoader from "../media/images/imageloader.js";
import AudioManager from "../media/audio.js";
import Graphics from "../graphics/graphics.js";
import Animation from "../graphics/animation.js";
import Button from "../ui/button.js";
import EventHandler from "../ui/EventHandler.js";
import { GAME_DELAY, MIN_LOAD, FADE_TIME } from "../constants.js";
import Game from "./game.js";
import Dashboard from "../ui/dashboard.js";
import Building from "../buildings/building.js";
import BuildModal from "../ui/modals/buildModal.js";

export default class LoadingScene extends Scene {
    // We need images, audio, and delay the loading for some time
    static needToLoad = 3;

    // A loading thing
    static loadingThing;

    // The start button
    static startButton;

    // The time since the button has been clicked
    static timeAccumulator = -1;

    // Has everything loaded?
    static loaded = false;

    // Have we reached the game load time?
    static pastFade = false;

    static Load() {
        // Load everything
        CatImages.Load();
        BuildingImages.Load();
        BackgroundImages.Load();
        AudioManager.Load();
        Dashboard.Load();
        Building.Load();
        BuildModal.Load();

        // I mean, like, you gotta appreciate that spinning cat for at least a second!
        setTimeout(this.Init.bind(this), MIN_LOAD);

        // Setup some UI stuff
        this.loadingThing = new Animation([
            ImageLoader.LoadImage("images/misc/loading/0.png"),
            ImageLoader.LoadImage("images/misc/loading/1.png")
        ], 500, Graphics.GetWidth() / 2 - 200, Graphics.GetHeight() / 2, {
            width: 200,
            height: 200
        });

        this.startButton = new Button({
            base: ImageLoader.LoadImage("images/buttons/start-button/base.png"),
            hover: ImageLoader.LoadImage("images/buttons/start-button/hover.png"),
            click: ImageLoader.LoadImage("images/buttons/start-button/click.png"),
            width: Graphics.GetWidth() / 10,
            height: Graphics.GetWidth() / 10,
            x: Graphics.GetWidth() / 2 - Graphics.GetWidth() / 15,
            y: Graphics.GetHeight() / 2
        });

        // Add the callbacks
        AudioManager.AddCallback(this.Init.bind(this));
        ImageLoader.AddCallback(this.Init.bind(this));
        EventHandler.AddCallback("mousedown", this.StartMusic.bind(this));
        this.startButton.AddCallback(this.OnStartClick.bind(this));
    }

    static Init() {
        // Abort if there is still needed to load
        if (--this.needToLoad > 0) return;
        this.loaded = true;
    }

    // Start the music
    static StartMusic() {
        // Only play music if everything has loaded
        if (this.loaded) AudioManager.PlayBackgroundMusic();
        else setTimeout(this.StartMusic.bind(this), 500);
    }

    static Update(dt) {
        // Abort if it has not loaded yet
        if (!this.loaded) {
            return void this.loadingThing.Update(dt);
        }

        // Draw the background
        Graphics.DrawImage(BackgroundImages.LOADING, 0, 0, {
            width: Graphics.canvas.width,
            height: Graphics.canvas.height
        });

        // Draw the start button
        this.startButton.Draw();

        // Make a cool fade if the button is clicked
        if (this.timeAccumulator >= 0) {
            this.timeAccumulator += dt;
            Graphics.Clear("black", Math.min(this.timeAccumulator, GAME_DELAY) / GAME_DELAY);
        }

        if (this.pastFade) {
            Graphics.Clear("black", 1);
        }

        // Check if we can start the game
        if (this.timeAccumulator >= GAME_DELAY) {
            setTimeout(function() {
                Graphics.SwitchToScene(Game);
            }, FADE_TIME);
            this.timeAccumulator = -Infinity;
            this.pastFade = true;
        }
    }

    static OnStartClick() {
        if (this.timeAccumulator >= 0) return;
        if (!this.loaded) return;
        this.timeAccumulator = 0;
    }
}
