import { NUM_CATS } from "../constants.js";

export default class MediaLoader {
    // The number of medias to load
    static COUNT = 0;

    // A list of callback functions
    static callbackFunctions = [];

    // The event that must be fired for it to be done loading
    static eventString = "load";

    // Add a callback function for when the images load
    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // Load a single media
    static LoadMedia(i) {

    }

    // Load the media
    static Load() {
        let needLoad = this.COUNT;
        const functions = this.callbackFunctions;

        for (let i = 0; i < this.COUNT; ++i) {
            let media = this.LoadMedia(i);
            
            media.addEventListener(this.eventString, function() {
                needLoad -= 1;
                // Call the callback functions
                if (needLoad <= 0) {
                    functions.forEach((a)=>a());
                }
            });
        }
    }
}
