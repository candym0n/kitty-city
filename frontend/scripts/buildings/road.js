import { ROAD_WIDTH } from "../constants.js";
import Graphics from "../graphics/graphics.js";

export default class Road {
    // Draw a road
    static DrawRoad(x1, y1, x2, y2) {
        // Draw the black thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH, "black");
        
        // Draw the white thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH / 4, "white", {
            lineDash: [3, 5]
        });
    }
}