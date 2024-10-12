import Building from "./building.js";
import Intersection from "./intersection.js";
import House from "./house.js";
import Workplace from "./workplace.js";
import Graphics from "../graphics/graphics.js";
import Game from "../scenes/game.js";
import { BUILDING_SIZE, ROAD_HELPER_SIZE } from "../constants.js";
import Road from "./road.js";
import BuildModal from "../ui/modals/buildModal.js";

export default class BuildingManager {
    // The buildings that have been built
    static houses = [];
    static intersections = [];
    static workplaces = [];

    // What are you currently building?
    static building = Building.NOTHING;

    // Are we building a road?
    static buildingRoad = false;

    // The selected building for building a road
    static selectedBuilding = null;

    // Have we done mouse up for click click?
    static clickClickMouseUp = false;

    // Are you currently building something?
    static get isBuilding() {
        return this.building !== Building.NOTHING;
    }

    // Set the building road status
    /**
     * @param {boolean} a
     */
    static set buidlingRoad(a) {
        this.selectedBuilding = null;
        this.buildingRoad = a;
    }

    // Build a building
    static Build(building, x, y, name) {        
        // Add the building
        let built;
        switch (building) {
            case Building.HOUSE:
                built = new House(x, y, name);
                this.houses.push(built);
                Game.money -= Building.houseData.cost;
                break;
            case Building.WORKPLACE:
                built = new Workplace(x, y, name);
                this.workplaces.push(built);
                Game.money -= Building.workData.cost;
                break;
            case Building.INTERSECTION:
                built = new Intersection(x, y, name);
                this.intersections.push(built);
                Game.money -= Building.intersectionData.cost;
                break;
        }

        // Sorry, you're not building anymore
        this.building = Building.NOTHING;
    }

    // Handle building mouse up
    static #BuildMouseUp(x, y) {
        // Handle click click building
        if (BuildModal.dragType === BuildModal.CLICK_CLICK) {
            // Handle building for click click
            if (this.clickClickMouseUp) {
                this.Build(this.building, x - BUILDING_SIZE / 2 + Graphics.camera.x, y - BUILDING_SIZE / 2 + Graphics.camera.y, "HI");
                this.clickClickMouseUp = false;
            } else if (!this.clickClickMouseUp) {
                this.clickClickMouseUp = true;
            }
        }

        // Check if we are doing the COMBO WOMBO for building
        if (BuildModal.dragTypeComboWombo) {
            if (BuildModal.PointInside(BuildModal.clickedButton, x, y)) {
                BuildModal.dragType = BuildModal.CLICK_CLICK;
            } else {
                BuildModal.dragType = BuildModal.DRAG_DROP;
            }
        }

        // Handle drag drop building
        if (BuildModal.dragType === BuildModal.DRAG_DROP) {
           this.Build(this.building, x - BUILDING_SIZE / 2 + Graphics.camera.x, y - BUILDING_SIZE / 2 + Graphics.camera.y, "HI");
        }
    }

    // When the mouse is up
    static MouseUp(x, y) {
        // Handle building stuff
        if (this.isBuilding) {
            this.#BuildMouseUp(x, y);
        }

        // Build a road if we are building
    }

    // When the mouse is down
    static MouseDown(x, y) {
        // Handle road stuff
        this.#HandleRoadMouseDown(x, y);
    }

    // Handle the road's mouse down
    static #HandleRoadMouseDown(x, y) {
        // Have we selected a building already?
        if (this.selectedBuilding !== null) return;

        // Check if we are selecting something
        this.selectedBuilding = this.GetSelectedBuilding(x, y);
    }

    // Get a selected building
    static GetSelectedBuilding(x, y) {
        let result = null;
        this.houses.forEach(function(a) {
            if (a.Contains(Graphics.mouseX, Graphics.mouseY)) {
                result = a;
                return;
            }
        });
        
        this.workplaces.forEach(function(a) {
            if (result) return;
            if (a.Contains(Graphics.mouseX, Graphics.mouseY)) {
                result = a;
                return;
            }
        });

        this.intersections.forEach(function(a) {
            if (result) return;
            if (a.Contains(Graphics.mouseX, Graphics.mouseY)) {
                result = a;
                return;
            }
        });

        return result;
    }

    // Draw the current building
    static DrawCurrentBuild() {
        // Check if we are building something
        if (!this.isBuilding) return;

        // Check if it is click click
        if (BuildModal.dragType === BuildModal.CLICK_CLICK) return;

        // Draw the building
        Building.DrawBuilding(Graphics.mouseX - BUILDING_SIZE / 2, Graphics.mouseY - BUILDING_SIZE / 2, this.building);
    }

    // Draw the current building road
    static DrawCurrentRoad() {
        // Check if we are building a road
        if (!this.buildingRoad || !this.selectedBuilding) return;

        // Draw the road
        Road.DrawRoad(this.selectedBuilding.x + BUILDING_SIZE / 2, this.selectedBuilding.y + BUILDING_SIZE / 2, Graphics.mouseX, Graphics.mouseY);
    }

    // Draw a building
    static #DrawBuilding(what) {
        // Draw it!
        what.Draw();

        // Draw a red dot if we are building roads
        if (BuildingManager.buildingRoad) {
            Graphics.DrawRect(what.x + BUILDING_SIZE / 2 - ROAD_HELPER_SIZE, what.y + BUILDING_SIZE / 2, ROAD_HELPER_SIZE, ROAD_HELPER_SIZE, what.Contains(Graphics.mouseX, Graphics.mouseY) ? "blue" : "red");
        }
    }

    // Draw all of the buildings
    static DrawBuildings() {
        this.houses.forEach(this.#DrawBuilding);
        this.workplaces.forEach(this.#DrawBuilding);
        this.intersections.forEach(this.#DrawBuilding);
    }
}
