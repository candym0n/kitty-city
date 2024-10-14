import { CAT_SPEED } from "../constants.js";

// The status of a cat
export default class CatStatus {
    // You are sleeping in your house
    static REST = 0;

    // You are walking somewhere on a road
    static WALK = 1;

    // You are working at ANY workplace
    static WORK = 2;

    // You are idle, waiting to walk somewhere on ANY building
    static WAIT = 3;

    // A time accumulator for sleeping working, and others?
    accumulator = 0;

    // The % walked from building A to building B
    walked = 0;

    // The road that the cat is walking on
    walkingRoad = null;

    // What is your goal; what do you want to do?
    walkingGoal;

    // Are you walking backwards? (two -> one instead of one -> two)
    backwards = false;

    // Your previous location (so that you don't repeat yourself)
    prevLocation = null;

    constructor(home) {
        // The state of the cat
        this.state = CatStatus.REST;
        
        // The different needs of the cat
        this.sleepTime = Math.random() * 1000 + 1000;
        this.workTime = Math.random() * 1000 + 1000;

        // The speed of the cat (in pixels / frame)
        this.speed = Math.random() * CAT_SPEED * 2  + CAT_SPEED;

        // Where the cat is currently
        this.location = home;
    }
}
