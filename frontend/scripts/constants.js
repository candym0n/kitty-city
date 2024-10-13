// Do you want to demo the game to someone?
const DEMO_GAME = false;

// How many distinct cat images are there?
const NUM_CATS = 13;

// The delay before the game starts
const GAME_DELAY = DEMO_GAME ? 500 : 0;

// The width and height of a building
const BUILDING_SIZE = 50;

// The width and height of a cat
const CAT_SIZE = 40;

// The width of a road
const ROAD_WIDTH = 20;

// The minimum loading time
const MIN_LOAD = DEMO_GAME ? 1000 : 0;

// The time it takes to fade
const FADE_TIME = DEMO_GAME ? 1000 : 0;

// The size of a road helper
const ROAD_HELPER_SIZE = 10;

export { NUM_CATS, GAME_DELAY, BUILDING_SIZE, ROAD_WIDTH, MIN_LOAD, FADE_TIME, ROAD_HELPER_SIZE, CAT_SIZE };
