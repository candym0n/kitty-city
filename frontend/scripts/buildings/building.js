import Graphics from "../graphics/graphics.js";
import { BUILDING_SIZE } from "../constants.js";
import BuildingImages from "../media/images/buildingimages.js";

export default class Building {
    // The different kinds of buildings
    static HOUSE = 0;
    static WORKPLACE = 1;
    static INTERSECTION = 2;
    static NOTHING = 3;
    static ROAD = 4;

    // The building data
    static intersectionData = {};
    static houseData = {};
    static workData = {};
    static roadData = {};

    constructor(x, y, name, type) {
        // The position of the building
        this.x = x;
        this.y = y;

        // The name of the building
        this.name = name;

        // The type of the building
        this.type = type;

        // The roads that the building touches
        this.roads = [];

        // Which roads are backwards?
        this.backwards = [];

        // A random ID for path finding
        this.id = Math.random();
    }

    // Update the building
    Update(dt) {
        
    }

    // Is a point inside of the building?
    Contains(x, y) {
        return x > this.x && y > this.y && x < this.x + BUILDING_SIZE && y < this.y + BUILDING_SIZE;
    }

    // Load the neccessary metadata
    static Load() {
        fetch("http://localhost:3000/get-building?all=true").then((async function(result) {
            result = await result.json();
            this.intersectionData = result.find(a=>a.name == "Intersection") || {};
            this.houseData = result.find(a=>a.name == "House") || {};
            this.workData = result.find(a=>a.name == "Work") || {};
            this.roadData = result.find(a=>a.name == "Road") || {};
        }).bind(this));
    }

    // Draw a building at a certain location, also supports roads
    static DrawBuilding(x, y, type) {
        Graphics.DrawImage(
            type == this.HOUSE ? BuildingImages.HOUSE :
            type == this.WORKPLACE ? BuildingImages.WORKPLACE :
            type == this.ROAD ? BuildingImages.ROAD :
            BuildingImages.INTERSECTION,
        x, y, {
            width: BUILDING_SIZE,
            height: BUILDING_SIZE
        });
    }
}
