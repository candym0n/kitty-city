export default class SettingsModal {
    // The elements in the modal
    static element = document.querySelector("#settingsModal");
    static modal = new bootstrap.Modal(this.element, {});
    static closeButton = document.querySelector("#close-settings");

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
