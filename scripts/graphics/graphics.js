import LoadingScene from "../scenes/loading.js";
import Camera from "./camera.js";;

export default class Graphics {
    // The canvas that is used for all graphics
    static canvas = document.querySelector("#canvas");
    static c = this.canvas.getContext("2d");

    // The height of the header and footer combined
    static HEADER_HEIGHT =  document.querySelector("header").getBoundingClientRect().height || 0;
    static FOOTER_HEIGHT = document.querySelector("footer").getBoundingClientRect().height || 0;

    // The camera used for graphics
    static camera = new Camera(0, 0);

    // The current scene to be drawn
    static currentScene = LoadingScene;

    // Init the graphics
    static Init(removeFooter) {
        // Check if we can REMOVE THAT GOD DAMN FOOTER
        if (removeFooter) {
            this.FOOTER_HEIGHT = 0;
        }
        
        // Resize the canvas
        this.canvas.width = this.GetWidth();
        this.canvas.height = this.GetHeight();

        // Disable antialiasing
        this.c.imageSmoothingEnabled = false;

        // Load the loading scene
        this.currentScene.Load();
    }

    // Draw a single image
    static DrawImage(image, x, y, options = {}) {
        this.c.globalAlpha = options.opacity;
        if (options.opacity === undefined) this.c.globalAlpha = 1;
        let width = options.width || image.width || 50;
        let height = options.height || image.height || 50;
        this.c.drawImage(image, x, y, width, height);
        this.c.globalAlpha = 1;
    }

    // Write text
    static DrawText(text, x, y, options = {}) {
        this.c.globalAlpha = options.opacity;
        if (options.opacity === undefined) this.c.globalAlpha = 1;
        this.c.font = (options.fontSize || 16) + "px " + (options.font || "Bold");
        this.c.textAlign = options.align || "left";
        this.c.fillStyle = options.color || "black";
        this.c.fillText(text, x, y);
        this.c.globalAlpha = 1;
    }

    // Clear the canvas (or not)
    static Clear(color, opacity) {
        if (color) {
            this.c.globalAlpha = opacity;
            if (opacity === undefined) this.c.globalAlpha = 1;
            this.c.fillStyle = color;
            this.c.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
        } else {
            this.c.clearRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
        }
    }

    // Update the current scene
    static UpdateScene(dt) {
        this.currentScene.Update(dt);
    }

    // Switch to a scene
    static SwitchToScene(scene) {
        this.currentScene = scene;
        scene.Load();
    }

    // Move everything away from the camera
    static ResetTranslationMatrix() {
        this.c.setTransform(1, 0, 0, 1, -this.camera.x, -this.camera.y);
    }

    // Translate the matrix relative to the camera
    static MoveRelativeToCamera() {
        this.c.translate(-this.camera.x, -this.camera.y);
    }

    // Reset the translation matrix to a position
    static SetTranslate(x, y) {
        this.c.setTransform(1, 0, 0, 1, x, y);
    }

    // Show or hide the canvas
    static Display(display) {
        this.canvas.style.display = display ? "block" : "none";
    }

    // Get the dimensions of the canvas
    static GetWidth() {
        return window.innerWidth;
    }
    static GetHeight() {
        return window.innerHeight - (this.HEADER_HEIGHT + this.FOOTER_HEIGHT);
    }

    // Draw an infinite background relative to the camera
    static DrawInfiniteBackground(image) {
        let x = Math.floor(this.camera.x / this.canvas.width) * this.canvas.width;
        let y = Math.floor(this.camera.y / this.canvas.height) * this.canvas.height;
        this.DrawImage(image, x, y, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x + this.canvas.width, y, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x - this.canvas.width, y, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x, y + this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x, y - this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x - this.canvas.height, y - this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x + this.canvas.width, y + this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x + this.canvas.width, y - this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
        this.DrawImage(image, x - this.canvas.width, y + this.canvas.height, { width: this.canvas.width, height: this.canvas.height });
    }

    // Draw a line
    static DrawLine(x1, y1, x2, y2, width, color, options = {}) {
        this.c.lineWidth = width || 20;
        this.c.strokeStyle = color || "black";
        this.c.setLineDash(options.lineDash || []);
        this.c.beginPath();
        this.c.moveTo(x1, y1);
        this.c.lineTo(x2, y2);
        this.c.stroke();
        this.c.closePath();
    }
}
