import Building from "./building.js";
import Workplace from "./workplace.js";

export default class BuildingManager {
    // The buildings that have been built
    static houses = [];
    static intersections = [];
    static workplaces = [];

    // Build a building
    static Build(building, x, y, name) {
        let building;
        
        switch (building) {
            case Building.HOUSE:
                building = new House(x, y, name);
                this.houses.push(building);
                break;
            case Building.WORKPLACE:
                building = new Workplace(x, y, name);
            case Building.INTERSECTION:
        }
    }
}
