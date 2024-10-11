export default class SettingsModal {
    // The elements in the modal
    static element = document.querySelector("#settingsModal");
    static modal = new bootstrap.Modal(this.element, {});
    static closeButton = document.querySelector("#close-settings");

    // A psudo-json for the settings
    static values = {
        backgroundVolume: document.querySelector("#background-volume"),
        clickAndClick: document.querySelector("#click"),
        dragAndDrag: document.querySelector("#drag")
    }

    // Is the modal shown?
    static get isShown() {
        return this.element.classList.contains("show");
    }

    // Add a callback for when one of the setting values changes
    static AddCallback(element, callback, event="change") {
        element.addEventListener(event, function() {
            callback(element.value, element);
        });
    }

    // Setup some event listeners
    static Init() {
        // The close button
        this.closeButton.addEventListener("click", () => {
            SettingsModal.Display(false);
        });
    }

    // Hide or show the modal
    static Display(show) {
        if (show) {
            this.modal.show();
        } else {
            this.modal.hide();
        }
    }
}
