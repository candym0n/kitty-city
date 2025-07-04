import { BUILDING_SIZE, ROAD_WIDTH } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import Maths from "../maths.js";
import Building from "./building.js";
import CatStatus from "../cats/catstatus.js";

// Remember, all a road is is a connection of two buildings
export default class Road {
    // Order should not and does not matter
    constructor(one, two) {
        // The buildings that the road connects
        this.one = one;
        this.two = two;

        // The length of the road
        this.length = Math.hypot(this.one.x - this.two.x, this.one.y - this.two.y);

        // The type. It is a road. DUH.
        this.type = Building.ROAD;

        // Has the road updated since the last RoadProfit calculation?
        this.cacheIsDirtyOne = true; // For this.one
        this.cacheIsDirtyTwo = true; // For this.two
        this.connectedBuildingsCacheOne = []; // For this.one
        this.connectedBuildingsCacheTwo = []; // For this.two

        // Dirty the cache
        this.DirtyCache();
    }

    // Draw the road
    Draw() {
        Road.DrawRoad(this.one.x + BUILDING_SIZE / 2, this.one.y + BUILDING_SIZE / 2, this.two.x + BUILDING_SIZE / 2, this.two.y + BUILDING_SIZE / 2);
    }

    // Determine whether a point lies in the road
    ContainsPoint(x, y) {
        return Maths.IsPointOnLine(this.one.x, this.one.y, this.two.x, this.two.y, x, y, ROAD_WIDTH);
    }

    // Dirty the cache and all connected roads' caches
    DirtyCache(roadsToIgnore = new Set()) {
        // Dirty the cache
        this.cacheIsDirtyOne = true;
        this.cacheIsDirtyTwo = true;

        // Don't cause stack overflow
        roadsToIgnore.add(this);

        // Dirty all of the connected roads' caches
        this.one.roads.forEach(road => roadsToIgnore.has(road) || road.DirtyCache(roadsToIgnore));
        this.two.roads.forEach(road => roadsToIgnore.has(road) || road.DirtyCache(roadsToIgnore));
    }

    // Find the profit of this road for a cat
    FindProfit(cat) {
        // Update the cache if it is dirty
        if (this.cacheIsDirtyOne && this.one === cat.status.location) {
            this.connectedBuildingsCacheOne = this.#FindBuildings(this.one, [this]);
            this.cacheIsDirtyOne = false;
        }

        if (this.cacheIsDirtyTwo && this.two === cat.status.location) {
            this.connectedBuildingsCacheTwo = this.#FindBuildings(this.two, [this]);
            this.cacheIsDirtyTwo = false;
        }

        // Get the cache for the building that the cat is currently at
        const connectedBuildings =
            this.one === cat.status.location ? this.connectedBuildingsCacheOne :
                this.two === cat.status.location ? this.connectedBuildingsCacheTwo : [];

        // Check what we want to do and calculuate profability accordingly
        let candidates =
            cat.status.walkingGoal === CatStatus.REST ? connectedBuildings.filter(a => a[0] === cat.resides) :
                cat.status.walkingGoal === CatStatus.WORK ? connectedBuildings.filter(a => a[0].type === Building.WORKPLACE) :
                    connectedBuildings;

        // Check if we have no candidates
        if (candidates.length === 0) return -Infinity;

        // Find the path with the least length
        const best = candidates.reduce((lowest, current) => (current[1] < lowest[1] ? current : lowest));

        return 1 / best[1];
    }

    // Find all of the buildings that a building leads to via recursion (list of arrays [Building, length])
    #FindBuildings(building, roads = building.roads, accumulatedLength = 0, alreadyFoundRoad = [], foundBuildings = new Map()) {
        let result = [];

        // Repeat for every building connected via roads
        roads.forEach(road => {
            // Ignore this road if it has already been searched
            if (alreadyFoundRoad.includes(road)) return;

            // Find the building
            const other = road.one === building ? road.two : road.one;

            // Calculate the new accumulated length (don't modify the original)
            const newAccumulatedLength = accumulatedLength + road.length;

            // Is that building special, is it not the original building?
            if ((other.type === Building.WORKPLACE || other.type === Building.HOUSE) && other !== building) {
                // Check if we've found this building before
                if (!foundBuildings.has(other) || foundBuildings.get(other) > newAccumulatedLength) {
                    // Either haven't found it before, or found a shorter path
                    foundBuildings.set(other, newAccumulatedLength);

                    // Remove any existing entry for this building in result
                    result = result.filter(([resultBuilding, _]) => resultBuilding !== other);

                    // Add the new shortest path
                    result.push([other, newAccumulatedLength]);
                }
            }

            // Add it to the already found road list
            alreadyFoundRoad.push(road);

            // Add all of the buildings connected to that, RECURSION BABY
            const profits = this.#FindBuildings(other, other.roads, newAccumulatedLength, [...alreadyFoundRoad], foundBuildings);
            result = result.concat(profits);
        });

        const buildingMap = new Map();

        // Process each building entry
        result.forEach(([building, length]) => {
            // If building not seen before, or current path is shorter, update the map
            if (!buildingMap.has(building) || buildingMap.get(building) > length) {
                buildingMap.set(building, length);
            }
        });

        // Convert map back to array format
        return Array.from(buildingMap.entries());
    }


    // Draw a road
    static DrawRoad(x1, y1, x2, y2) {
        // Draw the black thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH, "black");

        // Draw the white thing
        Graphics.DrawLine(x1, y1, x2, y2, ROAD_WIDTH / 4, "white", {
            lineDash: [3, 5],
        });
    }
}
