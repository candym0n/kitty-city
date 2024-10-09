import Building from "./building.js";

export default class Intersection extends Building {
    constructor(x, y, name) {
        super(x, y, name,  Building.INTERSECTION);
    }

    Draw() {
        // Draw the building
        Building.DrawBuilding(this.x, this.y, this.type);
    }
}
