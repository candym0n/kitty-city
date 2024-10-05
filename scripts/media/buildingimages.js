export default class BuildingImages {
    // The number of medias to load
    static COUNT = 3;

    // The images
    static HOUSE = new Image();
    static WORKPLACE = new Image();
    static INTERSECTION = new Image();

    // A list of callback functions
    static callbackFunctions = [];

    // Add a callback function for when the images load
    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // Load a single building
    static #LoadBuilding(image, name, callback, functions) {
        image.src = "images/buildings/" + name + ".png";
        image.addEventListener("load", ()=>{
            if(callback() <= 0) {
                functions.forEach(a=>a());
            }
        });
    }

    // Load the media
    static Load() {
        let needLoad = this.COUNT;

        this.#LoadBuilding(this.HOUSE, "house", ()=>--needLoad, this.callbackFunctions);
        this.#LoadBuilding(this.WORKPLACE, "work", ()=>--needLoad, this.callbackFunctions);
        this.#LoadBuilding(this.INTERSECTION, "intersection", ()=>--needLoad, this.callbackFunctions);
    }
}
