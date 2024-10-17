import Building from "../../buildings/building.js";

export default class BuildingInfoModal {
    // The elements in the modal
    static element = document.querySelector("#buildingInfoModal");
    static modal = new bootstrap.Modal(this.element, {});
    static closeButton = document.querySelector("#close-info");

    // Information elements
    static buildingName = document.querySelector("#info-building-name");
    static buildingType = document.querySelector("#info-building-type");

    // The currently selected building
    static currentBuilding = null;

    // Is the modal shown?
    static get isShown() {
        return this.element.classList.contains("show");
    }

    // Setup some event listeners
    static Init() {
        // The close button
        this.closeButton.addEventListener("click", () => {
            BuildingInfoModal.Display(false);
        });
    }

    // Set the name of the current building
    static #SetName() {
        BuildingInfoModal.currentBuilding.name = this.value;
    }

    // Open it up for a building
    static ViewBuilding(building) {
        // Open it up
        this.Display(true);

        // Set the basic building info
        this.currentBuilding = building;
        this.buildingName.value = building.name;
        this.buildingType.innerHTML = 
            building.type == Building.HOUSE ? "House" :
            building.type == Building.WORKPLACE ? "Workplace" :
            building.type == Building.INTERSECTION ? "Intersection" : "Unknown";

        // Setup the event listeners
        this.buildingName.addEventListener("input", this.#SetName);
    }

    // Hide or show the modal
    static Display(show) {
        if (show) {
            this.modal.show();
        } else {
            this.modal.hide();

            // Stop the event listenrs
            this.buildingName.removeEventListener("input", this.#SetName);
        }
    }
}
