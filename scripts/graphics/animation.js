import Graphics from "./graphics.js";

export default class Animation {
    // The time accumulator
    accumulator = 0;

    // The current frame
    frameIndex = 0;

    constructor(frames, delay = 10, x = 0, y = 0, options = {}) {
        // The frames
        this.frames = frames;

        // The delay from one frame to the other
        this.delay = delay;

        // Some things for Graphics.DrawImage
        this.x = x;
        this.y = y;
        this.options = options;
    }

    Update(dt) {
        // Update the frame
        this.accumulator += dt;

        if (this.accumulator >= this.delay) {
            this.accumulator -= this.delay;
            this.frameIndex = ++this.frameIndex % this.frames.length;
        }

        // Draw the current frame
        Graphics.DrawImage(this.frames[this.frameIndex], this.x, this.y, this.options);
    }
}
