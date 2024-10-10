import Building from "./building.js";
import Intersection from "./intersection.js";
import House from "./house.js";
import Workplace from "./workplace.js";
import Game from "../scenes/game.js";
import BuildModal from "../ui/buildModal.js";

export default class BuildingManager {
    // The buildings that have been built
    static houses = [];
    static intersections = [];
    static workplaces = [];

    // What are you currently building?
    static building = Building.NOTHING;

    // Are you currently building something?
    static get isBuilding() {
        return this.building !== Building.NOTHING;
    }

    // The number of things that you can currently build
    static buildCount = 0;

    // Add N buildings to the things you can build
    static AddBuildings(building, count) {
        // Very simple for now...
        BuildModal.Display(false);
        this.building = building;
        this.count = count;
    }

    // Build a building
    static Build(building, x, y, name) {
        // Add the building
        let built;
        switch (building) {
            case Building.HOUSE:
                built = new House(x, y, name);
                this.houses.push(building);
                break;
            case Building.WORKPLACE:
                built = new Workplace(x, y, name);
                this.workplaces.push(building);
                break;
            case Building.INTERSECTION:
                built = new Intersection(x, y, name);
                this.intersections.push(building);
                break;
        }

        // Subtract from the build count
        this.buildCount -= 1;

        // Check if we are still building
        if (this.buildCount <= 0) {
            this.building = Building.NOTHING;
        }
    }
}
