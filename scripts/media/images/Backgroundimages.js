import ImageLoader from "./imageloader.js";

export default class BackgroundImages {
    // How many background images are there?
    static COUNT = 2;

    // The background images
    static GRASS;
    static LOADING;

    // Load the images
    static Load() {
        this.GRASS = ImageLoader.LoadImage("images/misc/grass.png");
        this.LOADING = ImageLoader.LoadImage("images/misc/loading/background.png");
    }
}
