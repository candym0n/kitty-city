export default class BuildModal {
    static element = document.querySelector("#buildModal");
    static modal = new bootstrap.Modal(this.element, {});
    static closeButton = document.querySelector("#close-build");

    // Setup some event listeners
    static Init() {
        // The close button
        this.closeButton.addEventListener("click", function() {
            BuildModal.Display(false);
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
