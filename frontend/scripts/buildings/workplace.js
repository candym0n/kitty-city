import Building from "./building.js";

export default class Workplace extends Building {
    constructor(x, y, name) {
        super(x, y, name,  Building.WORKPLACE);
    }

    Draw() {
        // Draw the building
        Building.DrawBuilding(this.x, this.y, this.type);
    }
}
