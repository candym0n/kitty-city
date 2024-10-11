import { GAME_DELAY } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import BackgroundImages from "../media/images/backgroundimages.js";
import EventHandler from "../ui/EventHandler.js";
import Scene from "./scene.js";
import Dashboard from "../ui/dashboard.js";
import BuildingManager from "../buildings/buildingmanager.js";
import BuildModal from "../ui/modals/buildmodal.js";

export default class Game extends Scene {
    // The amount of time since the game has started
    static timeSinceStart = 0;

    // The amount of money that you have
    static money = 1000;

    // The current date (starting at 1970, January 1st, 12:00 AM)
    static date = new Date(0);

    static Load() {
        // Set up camera
        EventHandler.AddCallback("mousedown", Graphics.camera.MouseDown.bind(Graphics.camera));
        EventHandler.AddCallback("mousemove", Graphics.camera.MouseMove.bind(Graphics.camera));
        EventHandler.AddCallback("mouseup", Graphics.camera.MouseUp.bind(Graphics.camera));
        EventHandler.AddCallback("keydown", Graphics.camera.KeyDown.bind(Graphics.camera));
        EventHandler.AddCallback("keyup", Graphics.camera.KeyUp.bind(Graphics.camera));

        // Setup building events
        EventHandler.AddCallback("mouseup", BuildingManager.MouseUp.bind(BuildingManager));
        EventHandler.AddCallback("mousedown", BuildingManager.MouseDown.bind(BuildingManager));

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

        // Draw EVERYTHING
        Graphics.DrawInfiniteBackground(BackgroundImages.GRASS);
        BuildingManager.DrawCurrentRoad();
        BuildingManager.DrawBuildings();
        Dashboard.Draw();
        BuildingManager.DrawCurrentBuild();
        
        // Do the fade in if we have to
        if (this.timeSinceStart < GAME_DELAY) {
            Graphics.Clear("black", 1 - Math.min(this.timeSinceStart, GAME_DELAY) / GAME_DELAY)
        }
    }
}
