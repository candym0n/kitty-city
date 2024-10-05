import Graphics from "./graphics/graphics.js";
import LoadingScene from "./scenes/loading.js";

LoadingScene.Load();

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

    LoadingScene.Update(dt);
}

requestAnimationFrame(update);
