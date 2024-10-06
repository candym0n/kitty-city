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
        // Hover
        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.HOVER;
        } else {
            this.status = STATUS.NORMAL;
        }
    }

    // Called when the mouse clicks
    MouseDown(x, y) {
        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.CLICK;
        }
    }

    // Called when the mouse is up
    MouseUp(x, y) {
        if (this.ContainsPoint(x, y)) {
            this.status = STATUS.HOVER;
            // Trigger callback
            this.callbackFunctions.forEach(a=>a());
        } else {
            this.status = STATUS.NORMAL;
        }
    }

    // Draw the button in its current state
    Draw(dt) {
        switch(this.status) {
            case STATUS.NORMAL:
                Graphics.DrawImage(this.base, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
            case STATUS.HOVER:
                Graphics.DrawImage(this.hover, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
            case STATUS.CLICK:
                Graphics.DrawImage(this.click, this.x, this.y, {
                    width: this.width,
                    height: this.height,
                    opacity: this.opacity
                });
                break;
        }
    }
}
