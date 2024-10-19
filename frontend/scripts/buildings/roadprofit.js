import CatStatus from "../cats/catstatus.js";
import Building from "./building.js";
import Road from "./road.js";

export default class RoadProfit {
    constructor(building, length) {
        // Which building will you get to?
        this.building = building;

        // What is the length it will take to get there?
        this.length = length;
    }
    
    // Find the profit of a road for a cat
    static FindProfit(road, cat) {
        // Find the buildings
        let buildings = road.distances;

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

    // Find R* (immediate important buildings) for a road
    static FindImmediateBuildings(road) {
        // Check building one
        if (road.one.isSpecial) road.distances.push(new RoadProfit(road.one, road.length));

        // Check building two
        if (road.two.isSpecial) road.distances.push(new RoadProfit(road.two, road.length));
    }

    // Run the formula R = R + (L(R) + R') on two roads R and R'
    static RoadFormula(one, two, oneLength) {
        // Find the road profits with the length of the first road added to it
        const plusLength = two.map(profit => new RoadProfit(profit.building, profit.length + oneLength));

        // Add the two lists together (overlapping buildings will just be minimum length)
        const finalList = this.#AddLists(one, plusLength);

        // Here it is!
        return finalList;
    }

    // Add two profit lists together (concat, any overlaps will just keep the one with minimum length)
    static #AddLists(one, two) {
        // The map to store buildings and length
        const map = new Map();

        // Iterate through one and add buildings to the map
        for (const item of one) {
            // Get the building
            const { building } = item;

            // Check if there is already one like this
            const existingEntry = map.get(building);
            if (!existingEntry || item.length < existingEntry?.length) {
                map.set(building, item);
            }
        }

        // Iterate through two and add buildings to the map
        for (const item of two) {
            // Get the building
            const { building } = item;

            // Check if there is already one like this
            const existingEntry = map.get(building);
            if (!existingEntry || item.length < existingEntry?.length) {
                map.set(building, item);
            }
        }

        // Convert it to an array
        return Array.from(map.values());
    }

    // Function ran whenever a road is built
    static RoadOnBuild(road) {
        // Find the immediate buildings
        this.FindImmediateBuildings(road);

        // Update the distances
        let connectedRoads = road.connectedRoads;
        
        // Find the distances for this road
        for (const connectedRoad of connectedRoads) {
            // Run the road formula on the road
            road.distances = this.RoadFormula(road.distances, connectedRoad.distances, road.length);
        }

        // Update distances for other roads
        for (const connectedRoad of connectedRoads) {
            this.UpdateConnectedRoad(road, connectedRoad);
        }
    }
    
    // Update roads connnected to another road using the road formula (and recursion!)
    static UpdateConnectedRoad(originRoad, toUpdate, alreadyFound=[], accumulatedLength=originRoad.length, buildingsFound=[]) {
        // Update this road
        toUpdate.distances = this.RoadFormula(toUpdate.distances, originRoad.distances, accumulatedLength);

        // Update each buildings' road connected to this one
        const connectedRoads = toUpdate.connectedRoads;
        for (const connected of connectedRoads) {
            // Check if we already updated this one
            if (alreadyFound.includes(connected)) continue;

            // Did we already check it?
            if (buildingsFound.includes(connected.one)) continue;

            // Add it!
            buildingsFound.push(connected.one);

            // Update it!
            this.UpdateConnectedRoad(originRoad, connected, [...alreadyFound, toUpdate], accumulatedLength + connected.length);
        }
    }
}
