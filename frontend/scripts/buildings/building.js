import Graphics from "../graphics/graphics.js";
import { BUILDING_SIZE } from "../constants.js";
import BuildingImages from "../media/images/buildingimages.js";

export default class Building {
    // The different kinds of buildings
    static HOUSE = 0;
    static WORKPLACE = 1;
    static INTERSECTION = 2;

    constructor(x, y, name, type) {
        // The position of the building
        this.x = x;
        this.y = y;

        // The name of the building
        this.name = name;

        // The type of the building
        this.type = type;
    }

    // Update the building
    Update(dt) {
        
    }

    // Draw a building at a certain location
    static DrawBuilding(x, y, type) {
        Graphics.DrawImage(
            type == this.HOUSE ? BuildingImages.HOUSE :
            type == this.WORKPLACE ? BuildingImages.WORKPLACE :
            BuildingImages.INTERSECTION,
        x, y, {
            width: BUILDING_SIZE,
            height: BUILDING_SIZE
        });
    }
}
