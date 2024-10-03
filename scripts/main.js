import Graphics from "./graphics/graphics.js";
import Cats from "./media/cats.js";

// Init the graphics
Graphics.Init();

// Load cat images
Cats.LoadImages();

// Draw a cat :)
function main() {
    Graphics.DrawImage(Cats.images[Cats.SANTA_CAT], 50, 50);
}

Cats.AddCallback(main);
