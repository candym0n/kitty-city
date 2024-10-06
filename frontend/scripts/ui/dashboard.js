import Button from "./button.js";
import ImageLoader from "../media/images/imageloader.js";
import Graphics from "../graphics/graphics.js";
import BuildModal from "./buildModal.js";

export default class Dashboard {
    // Buttons
    static stats;
    static universalUpgrade;
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

        this.build = new Button({
            base: ImageLoader.LoadImage("images/buttons/dashboard/build.png"),
            overlay: true,
            width: 100,
            height: 100,
            x: 230,
            y: Graphics.GetHeight() - 110
        });

        // Setup the modals
        BuildModal.Init();

        // Setup events
        this.build.AddCallback(function() {
            BuildModal.Display(true);
        });
    }

    static Update(dt) {
        Graphics.SetTranslate(0, 0);
        
        // Draw the background
        Graphics.DrawRect(0, Graphics.GetHeight() - 120, Graphics.GetWidth(), 120, "white", {
            opacity: 0.8
        });

        // Draw the buttons
        this.stats.Draw(dt);
        this.universalUpgrade.Draw(dt);
        this.build.Draw(dt);

        Graphics.ResetTranslationMatrix();
    }
}
