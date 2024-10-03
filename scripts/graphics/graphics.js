export default class Graphics {
    // The canvas that is used for all graphics
    static canvas = document.querySelector("#canvas");
    static c = this.canvas.getContext("2d");

    // The height of the header and footer combined
    static HEADER_HEIGHT =  document.querySelector("header").getBoundingClientRect().height;
    static FOOTER_HEIGHT = document.querySelector("footer").getBoundingClientRect().height;

    // Init the graphics
    static Init() {
        // Resize the canvas
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight - this.HEADER_HEIGHT - this.FOOTER_HEIGHT;
    }

    // Draw a single image
    static DrawImage(image, x, y, options = {}) {
        this.c.save();
        this.c.globalAlpha = options.opacity || 1;
        let width = options.width || image.width || 50;
        let height = options.height || image.height || 50;
        let angle = options.rotation?(options.inRadians ? options.rotation : options.rotation*Math.PI/180) : 0;
        this.c.translate((x || 0) + width / 2, (y || 0) + height / 2);
        this.c.rotate(angle);
        this.c.drawImage(image, -width/2, -height/2, width, height);
        this.c.restore();
    }

    // Clear the canvas
    static Clear() {
        this.c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
