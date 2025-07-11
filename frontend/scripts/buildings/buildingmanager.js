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
import SettingsModal from "../ui/modals/settingsModal.js";
import Cat from "../cats/cat.js";
import AudioManager from "../media/audio.js";
import CatStatus from "../cats/catstatus.js";

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

    // The place building sound effect
    static placeBuildingNoise = new Audio("audio/building/place.mp3");

    // The destroying sound efing
    static destroyBuildingNoise = new Audio("audio/building/explosion.mp3");

    // Are you currently building something?
    static get isBuilding() {
        return this.building !== Building.NOTHING;
    }

    // Load what you gotta load
    static Load() {
        // Setup some events
        EventHandler.AddCallback("mouseup", this.MouseUp.bind(this));
        EventHandler.AddCallback("mousedown", this.MouseDown.bind(this));
        EventHandler.AddCallback("keydown", ((key) => {
            // Only do escape
            if (key !== "Escape") return;

            // No more building
            this.building = Building.NOTHING;
            this.buildingRoad = false;
            this.roadClickMouseUp = false;
            this.buildClickMouseUp = false;
        }).bind(this));

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
    static Build(building, x, y, name, free) {
        // Play that noise!
        AudioManager.Play(this.placeBuildingNoise);

        // One last time, check if you have enough money
        if (!free && Game.money < Building.GetCost(building)) {
            this.building = Building.NOTHING;
            return;
        }

        // Add the building
        let built;
        switch (building) {
            case Building.HOUSE:
                built = new House(x, y, name);
                this.houses.push(built);
                if (!free) Game.money -= Building.houseData.cost;

                // Create a new cat
                Cat.AddCat(built);
                break;
            case Building.WORKPLACE:
                built = new Workplace(x, y, name);
                this.workplaces.push(built);
                if (!free) Game.money -= Building.workData.cost;
                break;
            case Building.INTERSECTION:
                built = new Intersection(x, y, name);
                this.intersections.push(built);
                if (!free) Game.money -= Building.intersectionData.cost;
                break;
        }

        // Sorry, you're not building anymore, except if...
        if (!(SettingsModal.values.maintainBuild.checked && BuildModal.buildType === BuildModal.CLICKS)) {
            this.building = Building.NOTHING;
        }
    }

    // Handle building mouse up
    static #BuildMouseUp(x, y) {
        // Check if we are doing the COMBO WOMBO for building
        if (BuildModal.hybridBuild) {
            if (BuildModal.PointInside(BuildModal.clickedButton, x, y) || this.buildClickMouseUp) {
                BuildModal.buildType = BuildModal.CLICKS;
            } else {
                BuildModal.buildType = BuildModal.DRAG_DROP;
            }
        }

        // Handle click click building
        if (BuildModal.buildType === BuildModal.CLICKS) {
            // Handle building for click click
            if (this.buildClickMouseUp && !BuildModal.PointInside(BuildModal.clickedButton, x, y)) {
                this.Build(this.building, x - BUILDING_SIZE / 2 + Graphics.camera.x, y - BUILDING_SIZE / 2 + Graphics.camera.y, "HI");
                this.buildClickMouseUp = SettingsModal.values.maintainBuild.checked;
            } else {
                this.buildClickMouseUp = true;
            }

            return;
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
            if (this.selectedBuilding.Contains(x + Graphics.camera.x, y + Graphics.camera.y) || this.roadClickMouseUp) {
                this.buildType = BuildModal.CLICKS;
            } else {
                this.buildType = BuildModal.DRAG_DROP;
            }
        }

        // Handle click click road
        if (this.buildType === BuildModal.CLICKS) {
            if (this.roadClickMouseUp) {
                let newBuilding = this.AttemptBuildRoad(x, y);

                // Set the first building to this new building
                this.selectedBuilding = newBuilding;

                this.roadClickMouseUp = SettingsModal.values.maintainBuild.checked;
            } else {
                this.roadClickMouseUp = true;
            }

            return;
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

                // Alert the buildings for a new road
                this.selectedBuilding.roads.push(newRoad);
                newSelected.roads.push(newRoad);

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

        return newSelected;
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

    // Destroy a building
    static DestroyBuilding(building) {
        // Play that noise
        AudioManager.Play(this.destroyBuildingNoise);

        // Delete the building
        switch (building.type) {
            case Building.HOUSE:
                this.houses = this.houses.filter(a=>a !== building);

                // KILL THE KITIZEN!
                Cat.cats = Cat.cats.filter(a=>a.resides !== building);
                break;
            case Building.WORKPLACE:
                this.workplaces = this.workplaces.filter(a=>a !== building);
                break;
            case Building.INTERSECTION:
                this.intersections = this.intersections.filter(a=>a !== building);
                break;
        }

        // Send back cats who are walking on any connected roads
        for (let road of this.roads) {
            // Check if this is a connected road
            if (road.one !== building && road.two !== building) continue;

            // Find any cats walking down this road
            const cats = Cat.cats.filter(a=>a.status.walkingRoad === road);

            cats.forEach(function(cat) {
                // Make him go back to waiting
                cat.status.walkingRoad = null;
                cat.status.state = CatStatus.WAIT;
                cat.status.walked = 0;

                // Move him to a safe building
                cat.status.location = road.one == building ? road.two : road.one;
            });

            // Update any buildings that are connected to this road
            this.houses.forEach(a=>a.roads = a.roads.filter(b=>b!==road));
            this.workplaces.forEach(a=>a.roads = a.roads.filter(b=>b!==road));
            this.intersections.forEach(a=>a.roads = a.roads.filter(b=>b!==road));
        }

        // Get rid of the connected roads
        this.roads = this.roads.filter(a=>a.one !== building && a.two !== building);
    }
}
