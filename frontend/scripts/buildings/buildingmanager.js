import Building from "./building.js";
import Intersection from "./intersection.js";
import House from "./house.js";
import Workplace from "./workplace.js";
import Graphics from "../graphics/graphics.js";
import Game from "../scenes/game.js";
import { BUILDING_SIZE, ROAD_HELPER_SIZE } from "../constants.js";
import Road from "./road.js";
import BuildModal from "../ui/modals/buildModal.js";
import EventHandler from "../ui/EventHandler.js";
import SettingsModal from "../ui/modals/settingsmodal.js";
import Cat from "../cats/cat.js";

export default class BuildingManager {
    // The buildings that have been built
    static houses = [];
    static intersections = [];
    static workplaces = [];

    // The roads that have been built
    static roads = [];

    // What are you currently building?
    static building = Building.NOTHING;

    // Are we building a road?
    static buildingRoad = false;

    // The selected building for building a road
    static selectedBuilding = null;

    // Have we done mouse up for building click click?
    static buildClickMouseUp = false;

    // The type of building (for roads)
    static buildType;
    static hybridBuild = true;

    // Have we done mouse up for road click click?
    static roadClickMouseUp = false;

    // Are you currently building something?
    static get isBuilding() {
        return this.building !== Building.NOTHING;
    }

    // Load what you gotta load
    static Load() {
        // Setup some events
        EventHandler.AddCallback("mouseup", this.MouseUp.bind(this));
        EventHandler.AddCallback("mousedown", this.MouseDown.bind(this));

        // Add the settings
        SettingsModal.AddCallback(SettingsModal.values.roadClick, (() => {
            this.buildType = BuildModal.CLICKS;
            this.hybridBuild = false;
        }).bind(this));

        SettingsModal.AddCallback(SettingsModal.values.roadDrag, (() => {
            this.buildType = BuildModal.DRAG_DROP;
            this.hybridBuild = false;
        }).bind(this));

        SettingsModal.AddCallback(SettingsModal.values.roadBoth, (() => {
            this.hybridBuild = true;
        }).bind(this));
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

                // Create a new cat
                Cat.AddCat(built);
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

        // Sorry, you're not building anymore, except if...
        if (!(SettingsModal.values.maintainBuild && BuildModal.buildType === BuildModal.CLICKS)) {
            this.building = Building.NOTHING;
        }
    }

    // Handle building mouse up
    static #BuildMouseUp(x, y) {
        // Handle click click building
        if (BuildModal.buildType === BuildModal.CLICKS) {
            // Handle building for click click
            if (this.buildClickMouseUp) {
                this.Build(this.building, x - BUILDING_SIZE / 2 + Graphics.camera.x, y - BUILDING_SIZE / 2 + Graphics.camera.y, "HI");
                if (!SettingsModal.values.maintainBuild) {
                    this.buildClickMouseUp = false;
                }
            } else {
                this.buildClickMouseUp = true;
            }
        }

        // Check if we are doing the COMBO WOMBO for building
        if (BuildModal.hybridBuild) {
            if (BuildModal.PointInside(BuildModal.clickedButton, x, y)) {
                BuildModal.buildType = BuildModal.CLICKS;
            } else {
                BuildModal.buildType = BuildModal.DRAG_DROP;
            }
        }

        // Handle drag drop building
        if (BuildModal.buildType === BuildModal.DRAG_DROP) {
           this.Build(this.building, x - BUILDING_SIZE / 2 + Graphics.camera.x, y - BUILDING_SIZE / 2 + Graphics.camera.y, "HI");
        }
    }

    // Handle mouse up for road stuff
    static #RoadMouseUp(x, y) {
        // Check if we have actually selected a building
        if (this.selectedBuilding === null) return;

        // Check if we are doing the COMBO WOMBO for roads
        if (this.hybridBuild) {
            if (this.selectedBuilding.Contains(x + Graphics.camera.x, y + Graphics.camera.y)) {
                this.buildType = BuildModal.CLICKS;
            } else {
                this.buildType = BuildModal.DRAG_DROP;
            }
        }

        // Handle click click road
        if (this.buildType === BuildModal.CLICKS) {
            if (this.roadClickMouseUp) {
                this.AttemptBuildRoad(x, y);

                if (SettingsModal.values.maintainBuild) {
                    this.roadClickMouseUp = true;
                } else {
                    this.roadClickMouseUp = false;
                }
                
            } else {
                this.roadClickMouseUp = true;
            }
        }

        // Build a road if we have selected another building
        if (this.buildType === BuildModal.DRAG_DROP) {
            this.AttemptBuildRoad(x, y);
            this.roadClickMouseUp = false;
        }
    }

    // When the mouse is up
    static MouseUp(x, y) {
        // Handle building stuff
        if (this.isBuilding) {
            this.#BuildMouseUp(x, y);
        }

        // Handle road building stuff
        if (this.buildingRoad) {
            this.#RoadMouseUp(x, y);
        }
    }

    // Handle the road's mouse down
    static #RoadMouseDown(x, y) {
        // Have we selected a building already?
        if (this.selectedBuilding !== null) return;

        // Check if we are selecting something
        this.selectedBuilding = this.GetSelectedBuilding(x + Graphics.camera.x, y + Graphics.camera.y);
    }

    // When the mouse is down
    static MouseDown(x, y) {
        // Handle road stuff
        if (this.buildingRoad) {
            this.#RoadMouseDown(x, y);
        }
    }

    // Attempt to build a road with mouse at (x, y)
    static AttemptBuildRoad(x, y) {
        let newSelected = this.GetSelectedBuilding(x + Graphics.camera.x, y + Graphics.camera.y);

        let didNotBuildRoad = newSelected === null;

        if (newSelected) {
            // Are we building a road to nowhere? (I swear that's a song)
            if (this.selectedBuilding == newSelected) didNotBuildRoad = true;
            
            // Did we already build this road?
            let cancelRoad = false;
            this.roads.forEach(((road) => {
                if (road.one == this.selectedBuilding && road.two == newSelected) cancelRoad = true;
                if (road.one == newSelected && road.two == this.selectedBuilding) cancelRoad = true;
            }).bind(this));

            if (cancelRoad) didNotBuildRoad = true;

            // Build the road
            if (!didNotBuildRoad) {
                const newRoad = new Road(this.selectedBuilding, newSelected);
                this.roads.push(newRoad);

                // You aren't building the road anymore
                if (!SettingsModal.values.maintainRoadBuild.checked) {
                    this.buildingRoad = false;
                }

                this.selectedBuilding = null;
            }
        }

        if (didNotBuildRoad) {
            if (!SettingsModal.values.maintainRoadBuild.checked) {
                this.buildingRoad = false;
            }

            this.selectedBuilding = null;
        }
    }

    // Get a selected building
    static GetSelectedBuilding(x, y) {
        let result = null;

        // Loop through EVERY SINGLE building and see if it contains the point
        this.houses.forEach(function(a) {
            if (a.Contains(x, y)) {
                result = a;
                return;
            }
        });
        
        this.workplaces.forEach(function(a) {
            if (result) return;
            if (a.Contains(x, y)) {
                result = a;
                return;
            }
        });

        this.intersections.forEach(function(a) {
            if (result) return;
            if (a.Contains(x, y)) {
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
        if (BuildModal.buildType === BuildModal.CLICKS) return;

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
        if (BuildingManager.buildingRoad && SettingsModal.values.redBoxes.checked) {
            Graphics.DrawRect(what.x + BUILDING_SIZE / 2 - ROAD_HELPER_SIZE, what.y + BUILDING_SIZE / 2, ROAD_HELPER_SIZE, ROAD_HELPER_SIZE, what.Contains(Graphics.mouseX, Graphics.mouseY) ? "blue" : what == BuildingManager.selectedBuilding ? "green" : "red");
        }
    }

    // Draw all of the buildings
    static DrawBuildings() {
        this.houses.forEach(this.#DrawBuilding);
        this.workplaces.forEach(this.#DrawBuilding);
        this.intersections.forEach(this.#DrawBuilding);
    }

    // Draw all of the roads
    static DrawRoads() {
        this.roads.forEach(a=>a.Draw());
    }
}
