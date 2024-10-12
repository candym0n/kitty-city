import Button from "./button.js";
import ImageLoader from "../media/images/imageloader.js";
import Graphics from "../graphics/graphics.js";
import BuildModal from "./modals/buildModal.js";
import Game from "../scenes/game.js";
import Building from "../buildings/building.js";
import SettingsModal from "./modals/settingsmodal.js";
import BuildingManager from "../buildings/buildingmanager.js";

export default class Dashboard {
    // Buttons
    static stats;
    static universalUpgrade;
    static settings;
    static build;

    // Load what you gotta load
    static Load() {
        // Setup the buttons
        this.stats = new Button({
            base: ImageLoader.LoadImage("images/buttons/dashboard/stats.png"),
            overlay: true,
            width: 100,
            height: 100,
            x: 10,
            y: Graphics.GetHeight() - 110
        });

        this.universalUpgrade = new Button({
            base: ImageLoader.LoadImage("images/buttons/dashboard/universal-upgrade.png"),
            overlay: true,
            width: 100,
            height: 100,
            x: 120,
            y: Graphics.GetHeight() - 110
        });

        this.settings = new Button({
            base: ImageLoader.LoadImage("images/buttons/dashboard/settings.png"),
            overlay: true,
            width: 100,
            height: 100,
            x: 230,
            y: Graphics.GetHeight() - 110
        });
        
        this.build = new Button({
            base: ImageLoader.LoadImage("images/buttons/dashboard/build.png"),
            overlay: true,
            width: 100,
            height: 100,
            x: 340,
            y: Graphics.GetHeight() - 110
        });

        // Setup the callbacks
        this.build.AddCallback(function() {
            // Close everything else
            SettingsModal.Display(false);

            // Cancel all building
            BuildingManager.building = Building.NOTHING;
            BuildingManager.buildingRoad = false;

            // Show the build modal
            BuildModal.modalShown = !BuildModal.modalShown;
        });

        this.settings.AddCallback(function() {
            // Close everything else
            BuildModal.modalShown = false;

            // Cancel all building
            BuildingManager.building = Building.NOTHING;
            BuildingManager.buildingRoad = false;

            // Display the settings modal
            SettingsModal.Display(true);
        });
        SettingsModal.Init();
    }

    static Draw(dt) {
        Graphics.SetTranslate(0, 0);
        
        // Draw the background
        Graphics.DrawRect(0, Graphics.GetHeight() - 120, Graphics.GetWidth(), 120, "white", {
            opacity: 0.8
        });

        // Draw the buttons
        this.stats.Draw(dt);
        this.universalUpgrade.Draw(dt);
        this.settings.Draw(dt);
        this.build.Draw(dt);

        // Draw the build modal
        BuildModal.Draw();

        // Draw user info
        Graphics.DrawText("You have $" + Game.money, 450, Graphics.GetHeight() - 20, {
            fontSize: 32
        });

        Graphics.ResetTranslationMatrix();
    }
}
