import Graphics from "../graphics/graphics.js";
import EventHandler from "./EventHandler.js";

const STATUS = {
    NORMAL: 0,
    HOVER: 1,
    CLICK: 2
}

export default class Button {
    // The current status of the button
    status = STATUS.NORMAL;

    // The callback functions for click
    callbackFunctions = [];

    constructor(options = {}) {
        // The normal state of the button
        this.base = options.base;

        // Will there be a black overlay?
        this.overlay = options.overlay;

        // The image of the button when hovered (but not click)
        this.hover = options.hover || options.base;

        // The image of the button when clicked
        this.click = options.click || options.hover;

        // The width and height of the button
        this.width = options.width || options.default.width;
        this.height = options.height || options.default.height;

        // The position of the button
        this.x = options.x || 0;
        this.y = options.y || 0;

        // The opacity of the button
        this.opacity = options.opacity || 1;

        // Check if we want to move with the camera
        this.moveWithCamera = options.moveWithCamera || false;

        // Add the events
        EventHandler.AddCallback("mousedown", this.MouseDown.bind(this));
        EventHandler.AddCallback("mouseup", this.MouseUp.bind(this));
        EventHandler.AddCallback("mousemove", this.MouseMove.bind(this));
    }
    
    // Add a callback function
    AddCallback(func) {
        this.callbackFunctions.push(func);
    }

    // Check if a point is inside the button
    ContainsPoint(x, y) {
        return (x > this.x) && (x < this.x + this.width) && (y > this.y) && (y < this.y + this.height);
    }

    // Called when the mouse moves
    MouseMove(x, y) {
        x += this.moveWithCamera ? Graphics.camera.x : 0;
        y += this.moveWithCamera ? Graphics.camera.y : 0;

        // Hover
        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.HOVER;
        } else {
            this.status = STATUS.NORMAL;
        }
    }

    // Called when the mouse clicks
    MouseDown(x, y) {
        x += this.moveWithCamera ? Graphics.camera.x : 0;
        y += this.moveWithCamera ? Graphics.camera.y : 0;

        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.CLICK;
        }
    }

    // Called when the mouse is up
    MouseUp(x, y) {
        x += this.moveWithCamera ? Graphics.camera.x : 0;
        y += this.moveWithCamera ? Graphics.camera.y : 0;

        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.HOVER;
            // Trigger callback
            this.callbackFunctions.forEach(a=>a());
        } else {
            this.status = STATUS.NORMAL;
        }
    }

    // Draw the button in its current state
    Draw() {
        if (this.overlay && this.status !== STATUS.NORMAL) {
            Graphics.DrawRect(this.x, this.y, this.width, this.height, "black", {
                opacity: this.status == STATUS.HOVER ? 0.25 : 0.5
            });
        }
        switch(this.status) {
            case STATUS.NORMAL:
                Graphics.DrawImage(this.base, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
            case STATUS.HOVER:
                Graphics.DrawImage(this.overlay ? this.base : this.hover, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
            case STATUS.CLICK:
                Graphics.DrawImage(this.overlay ? this.base : this.click, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
        }
    }

    // Move to a location
    MoveTo(x, y) {
        this.x = x;
        this.y = y;
    }
}
