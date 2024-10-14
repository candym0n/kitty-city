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

    constructor(home) {
        // The state of the cat
        this.state = CatStatus.REST;
        
        // The different needs of the cat
        this.sleepTime = Math.random() * 1000 + 1000;
        this.workTime = Math.random() * 1000 + 1000;

        // The speed of the cat (in pixels / frame)
        this.speed = Math.random()*2  + 1;

        // Where the cat is currently
        this.location = home;
    }
}
