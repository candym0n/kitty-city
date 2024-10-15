import Building from "../../buildings/building.js";
import BuildingManager from "../../buildings/buildingmanager.js";
import { BUILDING_SIZE } from "../../constants.js";
import Graphics from "../../graphics/graphics.js";
import Game from "../../scenes/game.js";
import EventHandler from "../EventHandler.js";
import SettingsModal from "./settingsModal.js";

// The offset of every building
const BUILDING_OFFSET = 50;

export default class BuildModal {
    // The close button
    static closeButton;

    // Is the modal shown?
    static modalShown = false;

    // The description text
    static descriptionText = "Hover a building to see what it is!";

    // The build type
    static DRAG_DROP = 0;
    static CLICKS = 1;
    static buildType;

    // Do we have... BOTH???
    static hybridBuild = true;

    // The index of the button that was clicked
    static clickedButton = -1;

    // Load what you gotta load
    static Load() {
        // Setup some event listeners
        EventHandler.AddCallback("mousedown", this.MouseDown.bind(this));
        EventHandler.AddCallback("mousemove", this.MouseMove.bind(this));

        // Setup some settings
        SettingsModal.AddCallback(SettingsModal.values.buildDrag, (() => {
            this.buildType = this.DRAG_DROP;
            this.hybridBuild = false;
        }).bind(this));
        SettingsModal.AddCallback(SettingsModal.values.buildClick, (() => {
            this.buildType = this.CLICKS;
            this.hybridBuild = false;
        }).bind(this));
        SettingsModal.AddCallback(SettingsModal.values.buildBoth, (() => {
            this.hybridBuild = true;
        }));
    }

    // Draw the modal
    static Draw() {
        // Check if we are present
        if (!this.modalShown) return;

        // Draw the background
        Graphics.DrawRect(0, Graphics.GetHeight() - 240, Graphics.GetWidth(), 120, "white");

        // Draw the buildings
        this.#DrawBuilding(Building.HOUSE, 0, Building.houseData.cost);
        this.#DrawBuilding(Building.WORKPLACE, 1, Building.workData.cost);
        this.#DrawBuilding(Building.INTERSECTION, 2, Building.intersectionData.cost);

        // Draw the roads (roads cost nothing)
        this.#DrawBuilding(Building.ROAD, 3, -1);

        // Draw the description
        if (SettingsModal.values.buildDescription.checked) {
            Graphics.DrawText(this.descriptionText, Graphics.canvas.width - Graphics.c.measureText(this.descriptionText).width - 50, Graphics.canvas.height - 130, {
                fontSize: 32
            });
        }
    }

    // Draw a building button
    static #DrawBuilding(type, position, cost) {
        // Check if we are a selected road, or if we are a selected building
        if (type == Building.ROAD && BuildingManager.buildingRoad || (this.buildType == this.CLICKS && BuildingManager.building == type)) {
            Graphics.DrawRect(10 + (BUILDING_SIZE + BUILDING_OFFSET) * position, Graphics.GetHeight() - 230, BUILDING_SIZE, BUILDING_SIZE, "green", {
                opacity: 0.8
            });
        }
        
        if (Game.money < cost) {
            Graphics.DrawRect(10 + (BUILDING_SIZE + BUILDING_OFFSET) * position, Graphics.GetHeight() - 230, BUILDING_SIZE, BUILDING_SIZE, "black", {
                opacity: 0.8
            });
        }

        // Only draw the building if we are click click OR we are not building this (and doing drag drop)
        if (BuildingManager.building !== type || this.buildType == this.CLICKS) {
            Building.DrawBuilding(10 + (BUILDING_SIZE + BUILDING_OFFSET) * position, Graphics.GetHeight() - 230, type);
        }

        if (cost != -1) {
            Graphics.DrawText("$" + cost, 10 + (BUILDING_SIZE + BUILDING_OFFSET) * position, Graphics.GetHeight() - 130, {
                fontSize: 32
            });
        }
    }

    // Check if a point is in a building
    static PointInside(position, x, y) {
        // Get the points of the rectangle
        const x1 = 10 + (BUILDING_SIZE + BUILDING_OFFSET) * position;
        const y1 = Graphics.GetHeight() - 230;
        const x2 = 10 + (BUILDING_SIZE + BUILDING_OFFSET) * position + BUILDING_SIZE;
        const y2 = Graphics.GetHeight() - 230 + BUILDING_SIZE;

        return (x > x1 && x < x2 && y > y1 && y < y2);
    } 

    static MouseDown(x, y) {
        // Check if the settings modal is shown
        if (SettingsModal.isShown) return;

        // Check if we want to build something
        if (this.PointInside(0, x, y) && Game.money >= Building.houseData.cost) {
            BuildingManager.building = Building.HOUSE;
            BuildingManager.buildingRoad = false;
            BuildingManager.selectedBuilding = null;
            this.clickedButton = 0;
        }

        if (this.PointInside(1, x, y) && Game.money >= Building.workData.cost) {
            BuildingManager.building = Building.WORKPLACE;
            BuildingManager.buildingRoad = false;
            BuildingManager.selectedBuilding = null;
            this.clickedButton = 1;
        }

        if (this.PointInside(2, x, y) && Game.money >= Building.intersectionData.cost) {
            BuildingManager.building = Building.INTERSECTION;
            BuildingManager.buildingRoad = false;
            BuildingManager.selectedBuilding = null;
            this.clickedButton = 2;
        }

        // Check if we want to do road
        if (this.PointInside(3, x, y)) {
            BuildingManager.buildingRoad = !BuildingManager.buildingRoad;
            BuildingManager.building = Building.NOTHING;
            BuildingManager.selectedBuilding = null;
            this.clickedButton = 3;
        }
    }

    static MouseMove(x, y) {
        // Set the description
        if (this.PointInside(0, x, y)) {
            this.descriptionText = Building.houseData.description;
        } else if (this.PointInside(1, x, y)) {
            this.descriptionText = Building.workData.description;
        } else if (this.PointInside(2, x, y)) {
            this.descriptionText = Building.intersectionData.description;
        } else if (this.PointInside(3, x, y)) {
            this.descriptionText = Building.roadData.description;
        } else {
            this.descriptionText = "Hover a building to see what it is!";
        }
    }
}
