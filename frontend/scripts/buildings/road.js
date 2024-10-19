import { BUILDING_SIZE, ROAD_WIDTH } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import Maths from "../maths.js";
import Building from "./building.js";
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

        // The type. It is a road. DUH.
        this.type = Building.ROAD;

        // The distances to important buildings
        this.distances = [];

        // Run the update road on build function
        RoadProfit.RoadOnBuild(this);
    }

    // Draw the road
    Draw() {
        Road.DrawRoad(this.one.x + BUILDING_SIZE / 2, this.one.y + BUILDING_SIZE / 2, this.two.x + BUILDING_SIZE / 2, this.two.y + BUILDING_SIZE / 2);
    }

    // Determine whether a point lies in the road
    ContainsPoint(x, y) {
        return Maths.IsPointOnLine(this.one.x, this.one.y, this.two.x, this.two.y, x, y, ROAD_WIDTH);
    }

    // Get the connected roads (by immediate buildings)
    get connectedRoads() {
        return this.one.roads.concat(this.two.roads);
    }

    // Draw a road
    static DrawRoad(x1, y1, x2, y2) {
        // Draw the black thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH, "black");
        
        // Draw the white thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH / 4, "white", {
            lineDash: [3, 5],
        });
    }
}
