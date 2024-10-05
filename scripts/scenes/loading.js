import Scene from "./scene.js";
import CatImages from "../media/catimages.js";
import BuildingImages from "../media/buildingimages.js";
import BackgroundImages from "../media/Backgroundimages.js";
import AudioManager from "../media/audio.js";
import Graphics from "../graphics/graphics.js";
import Animation from "../graphics/animation.js";

export default class LoadingScene extends Scene {
    // How many things need to be loaded?
    static needToLoad = 5;
    
    // A loading thing
    static loadingThing = new Animation([new Image(), new Image()], 500, 100, 100);

    // Has everything loaded?
    static loaded = false;

    static Load() {
        // Load the loading thing
        this.loadingThing.frames[0].src = "images/misc/loading/0.png";
        this.loadingThing.frames[1].src = "images/misc/loading/1.png";

        // Load everything else
        CatImages.Load();
        BuildingImages.Load();
        BackgroundImages.Load();
        AudioManager.Load();

        // Add the callback
        CatImages.AddCallback(this.Init.bind(this));
        BuildingImages.AddCallback(this.Init.bind(this));
        BackgroundImages.AddCallback(this.Init.bind(this));
        AudioManager.AddCallback(this.Init.bind(this));

        // I mean, like, you gotta appreciate that spinning cat for at least 2000 miliseconds!
        setTimeout(this.Init.bind(this), 2000);

        // Init the graphics
        Graphics.Init();
        Graphics.camera.SetBoundaries(-10000, 10000, -10000, 10000);
    }

    static Init() {
        // Abort if there is still needed to load
        if (--this.needToLoad > 0) return;
        this.loaded = true;
        AudioManager.PlayBackgroundMusic();
    }

    static Update(dt) {
        if (this.loaded) {

        } else {
            this.loadingThing.Update(dt);
        }
    }
}
