import Building from "../buildings/building.js";
import Game from "../scenes/game.js";

export default class BuildModal {
    // The actual modal
    static element = document.querySelector("#buildModal");
    static modal = new bootstrap.Modal(this.element, {});
    
    // The close button for the modal
    static closeButton = document.querySelector("#close-build");

    // The indivisual buildings
    static products = document.querySelectorAll(".build-item");

    // The display for the currently selected building
    static buildingName = document.querySelector("#building-name");
    static buildingDescription = document.querySelector("#building-description");
    static buildingImage = document.querySelector("#building-image");
    static buildingCost = document.querySelector("#building-cost");

    // The form for buying a building
    static form = document.querySelector("#buyForm");
    static count = document.querySelector("#buildBuyCount");
    static submit = document.querySelector("#buyForm>button");

    // The current product
    static currentProduct = document.querySelector(".build-item[aria-label='house']");

    // The current cost
    static currentCost = 100;

    // Setup some event listeners
    static Init() {
        // The close button
        this.closeButton.addEventListener("click", function() {
            BuildModal.Display(false);
        });

        // The form
        this.form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            // Some info gathered from the form
            const count = BuildModal.count.value;
            const toBuy = BuildModal.currentProduct;
            const cost = BuildModal.currentCost * count;

            // More error checking
            if (cost > Game.money) {
                alert("You don't have enough money!");
                return void BuildModal.submit.setAttribute("disabled", true);
            }

            // Take away the money
            Game.money -= cost;

            // Set the game into a "building" state
            Game.building = toBuy.ariaLabel == "house" ? Building.HOUSE :
                            toBuy.ariaLabel == "work" ? Building.WORKPLACE :
                            Building.INTERSECTION;
            Game.buildCount += count;
        });

        // Make sure you have enough money
        this.count.addEventListener("keydown", function(e) {
            const key = e.key.toLowerCase();

            const newValue = !isNaN(key) ? Number(this.value + key) : key == "backspace" ? Math.floor(this.value / 10) : null;
            if (newValue == null) return;

            if (newValue * BuildModal.currentCost > Game.money) {
                BuildModal.submit.setAttribute("disabled", true);
            } else {
                BuildModal.submit.removeAttribute("disabled");
            }
        });

        // Make sure there is actually input
        this.count.addEventListener("change", function(e) {
            if (this.value == "") {
                this.value = 1;
            }
        })

        // The products
        this.products.forEach(function(building) {
            building.addEventListener("click", async function() {
                // Switch the current product to THIS one
                BuildModal.currentProduct.classList.remove("select");
                BuildModal.currentProduct = this;
                this.classList.add("select");

                // Get the building that was clicked
                const buildingName = this.ariaLabel;

                // Fetch the data from the server
                const data = await fetch("http://localhost:3000/get-building?name=" + buildingName).then(a=>a.json());
                
                // Check for errors
                if (data.error) {
                    return void alert(data.error);
                }

                // Set the building display
                BuildModal.buildingName.innerHTML = data.name;
                BuildModal.buildingDescription.innerHTML = data.description;
                BuildModal.buildingCost.innerHTML = "$" + data.cost;
                BuildModal.buildingImage.src = this.children[0].src;
                BuildModal.currentCost = data.cost;
            });
        });
    }

    // Show or hide the modal
    static Display(show) {
        if (show) {
            this.modal.show();
        } else {
            this.modal.hide();
        }
    }
}
