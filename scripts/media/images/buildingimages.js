import ImageLoader from "./imageloader.js";

export default class BuildingImages {
    // The number of medias to load
    static COUNT = 3;

    // The images
    static HOUSE;
    static WORKPLACE;
    static INTERSECTION;

    // Load the media
    static Load() {
        this.HOUSE = ImageLoader.LoadImage("images/buildings/house.png");
        this.WORKPLACE = ImageLoader.LoadImage("images/buildings/work.png");
        this.INTERSECTION = ImageLoader.LoadImage("images/buildings/intersection.png");
    }
}
