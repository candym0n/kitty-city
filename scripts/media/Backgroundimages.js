export default class BackgroundImages {
    // How many background images are there?
    static COUNT = 1;

    // The callback functions
    static callbackFunctions = [];

    // Add a callback function for when the images load
    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // The grassy background
    static GRASS = new Image();

    // Load the images
    static Load() {
        const functions = this.callbackFunctions;
        
        this.GRASS.src = "images/misc/grass.png";
        this.GRASS.addEventListener("load", function() {
            functions.forEach(a=>a());
        });
    }
}
