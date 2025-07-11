import Graphics from "../graphics/graphics.js";

// DO NOT USE FOR LOADING
export default class EventHandler {
    // name -> callback functions map
    static events = {
        "mousedown": [],
        "mouseup": [],
        "mousemove": [],
        "keydown": [],
        "keyup": [],
        "contextmenu": []
    };

    // Add a callback function
    static AddCallback(event, func) {
        this.events[event].push(func);
    }

    // Trigger an event
    static TriggerEvent(eventName, argumentList) {
        if (this.events[eventName]) {
            this.events[eventName].forEach(a=>a(...argumentList));
        }
    }

    static #handleMouse(event, e) {
        // Take into account that GOD DAMN HEADER
        let y = e.clientY;
        if (y < 0) return;
    
        // Check if we are out of bounds
        if (e.clientY > Graphics.canvas.height) return;
        
        EventHandler.TriggerEvent(event, [e.clientX, y]);
    }

    static Init() {
        document.addEventListener("mousedown", function(e) {
            // Abort if it is not a left click
            if (e.button !== 0) return;

            EventHandler.#handleMouse("mousedown", e);
        });
        
        document.addEventListener("mouseup", function(e) {
            if (e.button !== 0) return;

            EventHandler.#handleMouse("mouseup", e);
        });
        
        document.addEventListener("mousemove", function(e) {
            EventHandler.#handleMouse("mousemove", e);
        });
        
        document.addEventListener("touchstart", function(e) {
            EventHandler.#handleMouse("mousedown", e);
        });
        
        document.addEventListener("touchmove", function(e) {
            EventHandler.#handleMouse("mousemove", e);
        });
        
        document.addEventListener("touchcancel", function(e) {
            EventHandler.#handleMouse("mouseup", e);
        });
        
        document.addEventListener("touchend", function(e) {
            EventHandler.#handleMouse("mouseup", e);
        });
        
        document.addEventListener("keydown", function(e) {
            //e.preventDefault();
            EventHandler.TriggerEvent("keydown", [e.key]);
        });

        document.addEventListener("keyup", function(e) {
            EventHandler.TriggerEvent("keyup", [e.key]);
        });

        document.addEventListener("contextmenu", function(e) {
            e.preventDefault();
            EventHandler.TriggerEvent("contextmenu", [e.clientX, e.clientY]);
        });
    }
}
