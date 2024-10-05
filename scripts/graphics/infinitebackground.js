import Graphics from "./graphics.js";

export default class InfiniteBackground {
    constructor(image) {
        this.image = image;
    }
    
    Draw() {
        let x = Math.floor(Graphics.camera.x / Graphics.canvas.width) * Graphics.canvas.width;
        let y = Math.floor(Graphics.camera.y / Graphics.canvas.height) * Graphics.canvas.height;
        Graphics.DrawImage(this.image, x, y, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x + Graphics.canvas.width, y, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x - Graphics.canvas.width, y, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x, y + Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x, y - Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x - Graphics.canvas.height, y - Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x + Graphics.canvas.width, y + Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x + Graphics.canvas.width, y - Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
        Graphics.DrawImage(this.image, x - Graphics.canvas.width, y + Graphics.canvas.height, { width: Graphics.canvas.width, height: Graphics.canvas.height });
    }
}
