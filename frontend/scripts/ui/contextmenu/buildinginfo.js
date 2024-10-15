import BuildingManager from "../../buildings/buildingmanager.js";
import { BUILDING_SIZE } from "../../constants.js";
import Graphics from "../../graphics/graphics.js";
import ImageLoader from "../../media/images/imageloader.js";
import Button from "../button.js";
import EventHandler from "../EventHandler.js";

export default class BuildingInfo {
    // The current thing that we are looking at
    static currentVictim = null;
    
    // Did we select something
    static selectedVictim = false;

    // The position the mouse was when selected
    static selectedX = 0;
    static selectedY = 0;

    // Information button
    static informationButton;

    // Delete button
    static deleteButton;

    // Load what you gotta load
    static Load() {
        // Create the buttons
        this.informationButton = new Button({
            base: ImageLoader.LoadImage("images/contextmenu/information.png"),
            overlay: true,
            width: 100,
            height: 30,
            moveWithCamera: true
        });

        this.deleteButton = new Button({
            base: ImageLoader.LoadImage("images/contextmenu/delete.png"),
            overlay: true,
            width: 100,
            height: 30,
            moveWithCamera: true
        });

        // Setup some event listeners
        EventHandler.AddCallback("contextmenu", ((x, y) => {
            // Get the mouse position
            const selectedX = x + Graphics.camera.x;
            const selectedY = y + Graphics.camera.y;

            // Check if we have selected a building
            this.currentVictim = BuildingManager.GetSelectedBuilding(selectedX, selectedY);

            this.selectedVictim = this.currentVictim !== null;
            
            // Trick me into thinking that we clicked a little to the right (so you can see it over what you selected)
            this.selectedX = selectedX + 5;
            this.selectedY = selectedY;

            // Move the buttons
            this.informationButton.MoveTo(this.selectedX, this.selectedY);
            this.deleteButton.MoveTo(this.selectedX, this.selectedY + this.informationButton.height);
        }).bind(this));

        this.deleteButton.AddCallback((() => {
            BuildingManager.DestroyBuilding(this.currentVictim);
        }).bind(this));

        EventHandler.AddCallback("mousedown", () => {
            BuildingInfo.selectedVictim = false;
        });
    }

    // Draw the context menu
    static Draw() {
        // Abort if we did not select anything
        if (!this.selectedVictim) return;

        // Draw the background
        Graphics.DrawRect(this.selectedX - 3, this.selectedY - 3, 106, 106, "black", {
            roundness: 5
        });
        Graphics.DrawRect(this.selectedX, this.selectedY, 100, 100, "white", {
            roundness: 5
        });

        // Draw the buttons
        this.informationButton.Draw();
        this.deleteButton.Draw();
    }
}
