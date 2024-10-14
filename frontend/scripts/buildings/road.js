import { BUILDING_SIZE, ROAD_WIDTH } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import BuildingManager from "./buildingmanager.js";
import RoadProfit from "./roadprofit.js";

// Remember, all a road is is a connection of two buildings
export default class Road {
    // Order should not and does not matter
    constructor(one, two) {
        // The buildings that the road connects
        this.one = one;
        this.two = two;

        // The length of the road
        this.length = Math.hypot(this.one.x - this.two.x, this.one.y - this.two.y);

        // An ID for the road to identify it even when it has passed away
        this.id = Math.random();
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

    // Find ALL roads that connect to a building
    static FindRoads(building) {
        let result = [];

        BuildingManager.roads.forEach(a=>{
            if (a.one === building || a.two === building) {
                result.push(a);
            }
        });

        return result;
    }
}
