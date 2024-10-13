import Building from "../buildings/building.js";
import Road from "../buildings/road.js";
import { BUILDING_SIZE, CAT_SIZE } from "../constants.js";
import Graphics from "../graphics/graphics.js";
import CatImages from "../media/images/catimages.js";
import CatStatus from "./catstatus.js";
import Maths from "../maths.js";

// Kitizen, Kitty, Feline friend - take your pick
export default class Cat {
    // The cats to be drawn
    static cats = [];

    constructor(resides, image, name = "Kitizen") {
        // Where does the cat live?
        this.resides = resides;

        // The name of the cat
        this.name = name;

        // The image of the cat
        this.image = image;

        // The status of the cat
        this.status = new CatStatus(resides);
    }

    // Update a cat
    Update(dt) {
        // Add to the time accumulator
        this.status.accumulator += dt;

        switch (this.status.state) {
            case CatStatus.REST:
                // Are we done sleeping?
                if (this.status.accumulator >= this.status.sleepTime) {
                    this.walkingGoal = CatStatus.WORK;
                    this.status.state = CatStatus.WAIT;
                    this.AttemptWalking();
                }
                break;
            case CatStatus.WORK:
                // Are we done working?
                if (this.status.accumulator >= this.status.workTime) {
                    this.status.walkingGoal = CatStatus.REST;
                    this.SwitchToWaiting();
                    this.AttemptWalking();
                }
                break;
            case CatStatus.WAIT:
                // This is sad...
                this.AttemptWalking();
                break;
            case CatStatus.WALK:
                // Add some percent of the road
                this.status.walked += this.status.speed / this.status.walkingRoad.length;

                // Are we done walking?
                if (this.status.walked >= 1) {
                    this.location = this.destination;
                    this.SwitchToNextTask();
                }
                break;
        }
    }

    // Switch to the next task (after walking)
    SwitchToNextTask() {
        // Check if you are ready to fufill your goal
        if (this.status.location.type === Building.WORKPLACE && this.status.walkingGoal === CatStatus.WORK) {
            this.status.state = CatStatus.WORK;
        } else if (this.status.location === this.resides && this.status.walkingGoal === CatStatus.REST) {
            this.status.state = CatStatus.REST;
        } else {
            this.status.state = CatStatus.WAIT;
            this.AttemptWalking();
        }
    }

    // Try to switch to walking
    AttemptWalking() {
        // Find where you want to go
        const where = this.status.walkingGoal === CatStatus.WORK ? Building.WORKPLACE :
                      this.status.walkingGoal === CatStatus.REST ? Building.HOUSE :
                      Building.INTERSECTION;

        // Try to find a road
        const road = this.FindRoad(this.status.location, where);

        // Do we have a road?
        if (!road) return;

        // We can FINALLY switch to walking!
        this.status.state = CatStatus.WALK;
        this.status.walked = 0;
        this.status.walkingRoad = road;
    }

    // Find a road to get you from point A to point B
    // If to is Building.HOUSE we mean go to this.resides
    FindRoad(to) {
        // The roads we can use
        const roads = Road.FindRoads(this.status.location);

        // For now, just return a random road
        return roads[Math.floor(Math.random() * roads.length)];
    }

    // Add a cat
    static AddCat(house) {
        // Generate a random image
        const image = CatImages.images[Math.floor(CatImages.COUNT * Math.random())];

        // Create the cat
        const cat = new Cat(house, image);

        // Add it
        this.cats.push(cat);
    }

    // Draw ALL of the cats
    static DrawCats() {
        this.cats.forEach(a=>Cat.DrawCat(a));
    }

    // Update ALL of the cats
    static Update(dt) {
        this.cats.forEach(a=>a.Update(dt));
    }

    // Draw a cat
    static DrawCat(cat) {
        // Find the position of the cat
        let catX, catY;
        switch (cat.status.state) {
            case CatStatus.REST:
            case CatStatus.WORK:
            case CatStatus.WAIT:
                catX = cat.status.location.x;
                catY = cat.status.location.y;
                break;
            case CatStatus.WALK:
                catX = Maths.Lerp(cat.status.walkingRoad.one.x, cat.status.walkingRoad.two.x, cat.status.walked);
                catY = Maths.Lerp(cat.status.walkingRoad.one.y, cat.status.walkingRoad.two.y, cat.status.walked);
                break;
        }

        // Add the offset of the cat size vs building size to center the cat
        catX += (BUILDING_SIZE - CAT_SIZE ) / 2;
        catY += (BUILDING_SIZE - CAT_SIZE ) / 2;

        Graphics.DrawImage(cat.image, catX , catY, {
            width: CAT_SIZE ,
            height: CAT_SIZE
        });
    }
}
