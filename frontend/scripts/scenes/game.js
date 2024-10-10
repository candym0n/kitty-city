import { BUILD_CANCEL_REFUND, BUILDING_SIZE, GAME_DELAY } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import BackgroundImages from "../media/images/Backgroundimages.js";
import EventHandler from "../ui/EventHandler.js";
import Scene from "./scene.js";
import House from "../buildings/house.js";
import Road from "../buildings/road.js";
import Dashboard from "../ui/dashboard.js";
import BuildModal from "../ui/buildModal.js";
import Building from "../buildings/building.js";
import BuildingManager from "../buildings/buildingmanager.js";

export default class Game extends Scene {
    // The amount of time since the game has started
    static timeSinceStart = 0;

    // What are you currently building?
    static building = Building.NOTHING;

    // Are you currently building something?
    static get isBuilding() { 
        this.building !== Building.NOTHING 
    }

    // How much can you build right now?
    static buildCount = 0;

    // The amount of money that you have
    static money = 1000;

    // The current date (starting at 1970, January 1st, 12:00 AM)
    static date = new Date(0);

    // Are we building right now?
    static get isBuilding() {
        // Are we building (not) nothing?
        return this.building !== Building.NOTHING;
    }

    // Cancel the current build
    static CancelBuild() {
        // Get back (some) money
        this.money += BUILD_CANCEL_REFUND * this.building

        // Build nothing
        this.building = Building.NOTHING;
    }

    static Load() {
        // Set up neccessary events
        EventHandler.AddCallback("mousedown", Graphics.camera.MouseDown.bind(Graphics.camera));
        EventHandler.AddCallback("mousemove", Graphics.camera.MouseMove.bind(Graphics.camera));
        EventHandler.AddCallback("mouseup", Graphics.camera.MouseUp.bind(Graphics.camera));
        EventHandler.AddCallback("keydown", Graphics.camera.KeyDown.bind(Graphics.camera));
        EventHandler.AddCallback("keyup", Graphics.camera.KeyUp.bind(Graphics.camera));

        EventHandler.AddCallback("mousedown", this.MouseDown.bind(this));

        // Start the game!
        this.Init();
    }

    static Init() {

    }

    static Update(dt) {
        // Update the time since the start of the game
        this.timeSinceStart += dt;

        // Draw the scene
        this.Draw();

        // Handle the keyboard movement
        Graphics.camera.HandleKeyboard();
    }

    // Draw the scene
    static Draw() {
        // Reset everything
        Graphics.Clear();
        Graphics.ResetTranslationMatrix();

        // Draw the background
        Graphics.DrawInfiniteBackground(BackgroundImages.GRASS);

        // Draw the current build
        this.DrawCurrentBuild();

        // Draw the dashboard
        Dashboard.Draw();

        // Do the fade in if we have to
        if (this.timeSinceStart < GAME_DELAY) {
            Graphics.Clear("black", 1 - Math.min(this.timeSinceStart, GAME_DELAY) / GAME_DELAY)
        }
    }

    // Draw the current thing you are building
    static DrawCurrentBuild() {
        // Abort if you aren't building anything
        if (this.building == Building.NOTHING) return;

        // Draw the building
        Building.DrawBuilding(Graphics.mouseX - BUILDING_SIZE / 2, Graphics.mouseY - BUILDING_SIZE / 2, this.building);

        // Draw the amount that you have
        Graphics.DrawText(this.buildCount, Graphics.mouseX + BUILDING_SIZE / 2- 16, Graphics.mouseY + BUILDING_SIZE / 2- 32, {
            fontSize: 32,
            font: "Fantasy"
        });
    }

    // When the mouse is clicked
    static MouseDown(x, y) {
        // Check if we want to build something
        if (this.isBuilding) BuildingManager.Build(this.building);
    }
}
