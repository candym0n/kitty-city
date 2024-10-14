import CatStatus from "../cats/catstatus.js";
import Building from "./building.js";

// Connects buildings with roads
export default class RoadProfit {
    // The directions that you could go
    static A_TO_B = 0;
    static B_TO_A = 1;

    constructor(direction, building, length) {
        // Which direction do you have to go?
        this.direction = direction;

        // Which building will you get to?
        this.building = building;

        // What is the length it will take to get there?
        this.length = length;
    }

    // Find the profit of a road for a cat
    static FindProfit(road, cat) {
        let result = [];
        
        // Find the direction that the cat is going
        let direction = cat.status.location == road.one ? this.A_TO_B : this.B_TO_A;

        // Find the buildings
        let buildings = this.FindBuildings(cat.status.location, [road]);

        // Check what we want to do and calculuate profability accordingly
        if (cat.status.walkingGoal === CatStatus.REST) {
            const candidates = buildings.filter(a=>a.building === cat.resides);

            // Check if we have any candidates
            if (candidates.length === 0) return 0;

            // Find the path with the least length
            const best = candidates.reduce((lowest, current) => (current.length < lowest.length ? current : lowest));

            // Calculuate the profitability
            const profatibility = 1 / best.length;

            return profatibility;

        } else if (cat.status.walkingGoal === CatStatus.WORK) {
            const candidates = buildings.filter(a=>a.building.type === Building.WORKPLACE);

            // Check if we have any candidates
            if (candidates.length === 0) return 0;

            // Find the path with the least length
            const best = candidates.reduce((lowest, current) => (current.length < lowest.length ? current : lowest));

            // Calculate the profitability (profit / distance)
            const profitability = best.building.profit / best.length;

            return profitability;
        }
    }

    // Find all of the buildings that a building leads to via recursion
    static FindBuildings(building, roads=building.roads, accumulatedLength=0, alreadyFoundRoad=[]) {
        let result = [];

        // Repeat for every building connected via roads
        roads.forEach(road => {
            // Ignore this road if it is it's origin
            if (alreadyFoundRoad.includes(road)) return;

            // The length accumulated from roads
            let length = accumulatedLength;

            // Find the building
            const other = road.one === building ? road.two : road.one;

            // Add to the length
            length += road.length;

            // Is that building special, and it is not the original building?
            if ((other.type === Building.WORKPLACE || other.type === Building.HOUSE)) {
                result.push(new RoadProfit(road.one === building ? RoadProfit.A_TO_B : RoadProfit.B_TO_A, other, length));
            }

            // Add it to the already found road list
            alreadyFoundRoad.push(road);

            // Add all of the buildings connected to that, RECURSION BABY
            const profits = RoadProfit.FindBuildings(other, other.roads, length, alreadyFoundRoad);
            result = result.concat(profits);
        });

        return result;
    }
}
