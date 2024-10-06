// This class is used to load ANY image
// Should only be used in the loading scene
// Loaded images can be used anywhere else
export default class ImageLoader {
    static images = {};
    static callbackFunctions = [];
    static needLoad = 0;

    static AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    static LoadImage(url, name) {
        let image = new Image();
        image.src = url;
        this.needLoad += 1;
        image.addEventListener("load", (function() {
            if (--this.needLoad <= 0) {
                this.callbackFunctions.forEach(a=>a());
            }
        }).bind(this));

        if (name) this.images[name] = image;
        return image;
    }
}
