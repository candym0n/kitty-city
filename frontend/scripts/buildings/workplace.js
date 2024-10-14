import Building from "./building.js";
import { DEFAULT_PROFIT } from "../constants.js";

export default class Workplace extends Building {
    // The profit of the workplace
    profit = DEFAULT_PROFIT;

    constructor(x, y, name) {
        super(x, y, name,  Building.WORKPLACE);
    }

    Draw() {
        // Draw the building
        Building.DrawBuilding(this.x, this.y, this.type);
    }
}
