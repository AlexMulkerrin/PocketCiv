// TODO commentary
function Mouse(parentControl) {
	this.targetCanvas = document.getElementById("pocketCivCanvas");
	this.targetControl = parentControl;

	this.x = 0;
	this.y = 0;
	this.isPressed = false;
	this.buttonPressed = 0;

	this.createCanvasEventHandlers();
}
Mouse.prototype.createCanvasEventHandlers = function() {
	var t = this;
	this.targetCanvas.onmousemove = function (event) {t.mouseUpdateCoords(event);};
	this.targetCanvas.onmousedown = function (event) {t.mousePressed(event);};
    this.targetCanvas.onmouseup = function (event) {t.mouseReleased(event);};
}
Mouse.prototype.mouseUpdateCoords = function(event) {
	var rect = this.targetCanvas.getBoundingClientRect();
    this.x = event.clientX - rect.left;
    this.y = event.clientY - rect.top;
}
Mouse.prototype.mousePressed = function (event) {
    this.buttonPressed = event.which;
    this.isPressed = true;
}
Mouse.prototype.mouseReleased = function (event) {
    this.isPressed = false;
}
