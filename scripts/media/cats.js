const NUM_CATS = 10;

// Yes, I named the cats
export default class Cats {
    // How many cats are there?
    static NUM_CATS = NUM_CATS;

    // A list of cat images
    static images = [];

    // A list of functions to be called when the images have loaded
    static callbackFunctions = [];

    // A name for the cats
    static BROWN_CAT = 0;
    static NYAN_CAT  = 1;
    static BLACK_CAT = 2;
    static LUCKY_CAT = 3;
    static SNOW_CAT  = 4;
    static GREY_CAT  = 5;
    static SANTA_CAT = 6;
    static BLUSH_CAT = 7;
    static TINY_CAT  = 8;
    static BERRY_CAT = 9;

    // Add a callback function for when the images load
    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // Load the image
    static LoadImages() {
        let needLoad = NUM_CATS;
        const functions = this.callbackFunctions;

        for (let i = 0; i < NUM_CATS; ++i) {
            let img = new Image();
            img.src = "images/cats/" + i + ".png";
            
            this.images.push(img);
            
            img.addEventListener("load", function() {
                needLoad -= 1;
                // Call the callback functions
                if (needLoad <= 0) {
                    functions.forEach((a)=>a());
                }
            });
        }
    }
}
