import { GAME_DELAY } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import BackgroundImages from "../media/images/Backgroundimages.js";
import EventHandler from "../ui/EventHandler.js";
import Scene from "./scene.js";
import House from "../buildings/house.js";
import Road from "../buildings/road.js";
import Dashboard from "../ui/dashboard.js";
import BuildModal from "../ui/buildModal.js";

export default class Game extends Scene {
    // The amount of time since the game has started
    static timeSinceStart = 0;

    // A house. That's it.
    static testHouse;

    static Load() {
        // Set up neccessary events
        EventHandler.AddCallback("mousedown", Graphics.camera.MouseDown.bind(Graphics.camera));
        EventHandler.AddCallback("mousemove", Graphics.camera.MouseMove.bind(Graphics.camera));
        EventHandler.AddCallback("mouseup", Graphics.camera.MouseUp.bind(Graphics.camera));
        EventHandler.AddCallback("keydown", Graphics.camera.KeyDown.bind(Graphics.camera));
        EventHandler.AddCallback("keyup", Graphics.camera.KeyUp.bind(Graphics.camera));

        // Start the game!
        this.Init();
    }

    static Init() {
        this.testHouse = new House(100, 100, "John's apartment");
        
        // Show a modal
        BuildModal.ShowModal();
    }

    static Update(dt) {
        // Update the time since the start of the game
        this.timeSinceStart += dt;

        // Reset everything
        Graphics.Clear();
        Graphics.ResetTranslationMatrix();

        // Draw the background
        Graphics.DrawInfiniteBackground(BackgroundImages.GRASS);
        
        // Draw a road.
        Road.DrawRoad(125, 125, Graphics.mouseX, Graphics.mouseY);

        // Draw a house.
        this.testHouse.Update(dt);

        // Draw the dashboard
        Dashboard.Update(dt);

        // Do the fade in if we have to
        if (this.timeSinceStart < GAME_DELAY) {
            Graphics.Clear("black", 1 - Math.min(this.timeSinceStart, GAME_DELAY) / GAME_DELAY)
        }

        // Handle the keyboard movement
        Graphics.camera.HandleKeyboard();
    }
}
