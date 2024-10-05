import { NUM_CATS } from "../constants.js";
import MediaLoader from "./medialoader.js";

// Yes, I named the cats
export default class CatImages extends MediaLoader {
    // How many cats are there?
    static COUNT = NUM_CATS;

    // An array of all the images
    static images = [];

    // The event to be fired
    static eventString = "load";

    // A name for the cats
    static OG_CAT        = 0;
    static NYAN_CAT      = 1;
    static TOOTHLESS_CAT = 2;
    static LUCKY_CAT     = 3;
    static SNOW_CAT      = 4;
    static GREY_CAT      = 5;
    static SANTA_CAT     = 6;
    static BLUSH_CAT     = 7;
    static GLIDER_KITTY  = 8;
    static BERRY_CAT     = 9;
    static KITTY_EYE_CAT = 10;
    static CRANE_CAT     = 11;
    static SIMPLE_CAT    = 12;

    // Load an image
    static LoadMedia(i) {
        let img = new Image();
        img.src = "images/cats/" + i + ".png";
        
        this.images.push(img);

        return img;
    }
}
