import { BUILDING_SIZE, ROAD_WIDTH } from "../constants.js";
import Graphics from "../graphics/graphics.js";

// Remember, all a road is is a connection of two buildings
export default class Road {
    // Order should not and does not matter
    constructor(one, two) {
        this.one = one;
        this.two = two;
    }

    Draw() {
        Road.DrawRoad(this.one.x + BUILDING_SIZE / 2, this.one.y + BUILDING_SIZE / 2, this.two.x + BUILDING_SIZE / 2, this.two.y + BUILDING_SIZE / 2);
    }

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