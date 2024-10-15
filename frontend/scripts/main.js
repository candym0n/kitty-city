import Graphics from "./graphics/graphics.js";
import EventHandler from "./ui/EventHandler.js";

// Init the graphics
Graphics.Init();
Graphics.camera.SetBoundaries(-1000, 1000, -1000, 1000);

// Init the event handler
EventHandler.Init();

let prevTime = 0;
let dt = 0;

function update(time) {
    requestAnimationFrame(update);

    // Calculate delta time
    dt = time - prevTime;
    prevTime = time;

    // Reset everything
    Graphics.Clear();
    Graphics.ResetTranslationMatrix();

    Graphics.UpdateScene(dt);
}

requestAnimationFrame(update);

// Give a nice message
console.log(`  _  ___ _   _            ____ _ _         
 | |/ (_) |_| |_ _   _   / ___(_) |_ _   _ 
 | ' /| | __| __| | | | | |   | | __| | | |
 | . \| | |_| |_| |_| | | |___| | |_| |_| |
 |_|\_\_|\__|\__|\__, |  \____|_|\__|\__, |
                 |___/               |___/ `)
