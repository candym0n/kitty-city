import BuildingManager from "../buildings/buildingmanager.js";
import SettingsModal from "../ui/modals/settingsmodal.js";
import Graphics from "./graphics.js";

export default class Camera {
    // The point of first click during drag
    #prevX = 0;
    #prevY = 0;

    // Where the camera was at during the first click of drag
    #startX = 0;
    #startY = 0;

    // Values for clamping
    #minX = -Infinity;
    #maxX = +Infinity;
    #minY = -Infinity;
    #maxY = +Infinity;

    // Is it dragging?
    #drag = false;

    // The last key that was pressed
    #key = null;

    constructor(x=0, y=0) {
        this.x = x;
        this.y = y;
    }

    // Set the boundaries for clamping
    SetBoundaries(minX, maxX, minY, maxY) {
        this.#minX = minX;
        this.#maxX = maxX;
        this.#minY = minY;
        this.#maxY = maxY;
    }

    MoveTo(x, y) {
        this.x = x;
        this.y = y;

        // Update the mouse position
        Graphics.mouseX = x + this.x;
        Graphics.mouseY = y + this.y;
    }

    MoveBy(dx, dy) {
        this.x += dx;
        this.y += dy;
    }

    Clamp() {
        this.x = Math.max(this.#minX, Math.min(this.#maxX, this.x));
        this.y = Math.max(this.#minY, Math.min(this.#maxY, this.y));
    }

    MouseDown(x, y) {
        // Make sure we aren't building
        if (BuildingManager.isBuilding || BuildingManager.buildingRoad) return;

        // Make sure we aren't doing settings
        if (SettingsModal.isShown) return;

        // Start drag
        this.#drag = true;

        this.#prevX = x;
        this.#prevY = y;

        this.#startX = this.x;
        this.#startY = this.y;

        this.#key = "";

        // Update the mouse position
        Graphics.mouseX = x + this.x;
        Graphics.mouseY = y + this.y;
    }

    MouseUp(x, y) {
        // Update the camera as if it were mouse drag
        this.MouseMove(x, y);

        // End drag
        this.#drag = false;

        
        // Update the mouse position
        Graphics.mouseX = x + this.x;
        Graphics.mouseY = y + this.y;
    }

    MouseMove(x, y) {
        // Update the mouse position
        Graphics.mouseX = x + this.x;
        Graphics.mouseY = y + this.y;

        // Abort if not dragging
        if (!this.#drag) return;

        // Transformation to bring the first point of drag to the current drag
        const deltaX = this.#prevX - x;
        const deltaY = this.#prevY - y;

        // Apply transformation to the camera
        this.x = this.#startX + deltaX;
        this.y = this.#startY + deltaY;
        this.Clamp();
    }

    KeyDown(key) {
        // Cancel if it is dragging
        if (this.#drag) return;

        this.#key = key.toLowerCase();
    }

    KeyUp() {
        this.#key = "";
    }

    HandleKeyboard() {
        Graphics.mouseX -= this.x;
        Graphics.mouseY -= this.y;

        switch (this.#key) {
            case "arrowup":
                this.y -= 20;
                break;
            case "arrowdown":
                this.y += 20;
                break;
            case "arrowright":
                this.x += 20;
                break;
            case "arrowleft":
                this.x -= 20;
                break;
        }
        
        this.Clamp();

        // Update the mouse position
        Graphics.mouseX += this.x;
        Graphics.mouseY += this.y;
    }
}
