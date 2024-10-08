import Building from "./building.js";

export default class House extends Building {
    constructor(x, y, name) {
        super(x, y, name,  Building.HOUSE);
    }

    Draw() {
        // Draw the building
        Building.DrawBuilding(this.x, this.y, this.type);
    }
}
