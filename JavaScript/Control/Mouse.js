// TODO commentary
function Mouse(parentControl) {
	this.targetCanvas = document.getElementById("pocketCivCanvas");
	this.targetControl = parentControl;

	this.x = 0;
	this.y = 0;
	this.isPressed = false;
	this.buttonPressed = 0;
	this.isReleased = false;
	this.isOverButton = false;

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
	this.checkHover();
}

Mouse.prototype.checkHover = function(button) {
	var buttons = this.targetControl.buttons;
	this.isOverButton = false;
	for (var i=0; i<buttons.length; i++) {
		var button = buttons[i];
		button.isHovered = false;
		button.isClicked = false;
		if (button.isInBounds(this.x, this.y)) {
			if (this.isReleased) {
				this.newSelected = i;
				this.targetControl[button.function](button.functionArguments);
				this.isReleased = false;
			} else if (this.isPressed) {
				button.isClicked = true;
			} else {
				button.isHovered = true;
			}
		}
	}
}

Mouse.prototype.mousePressed = function (event) {
    this.buttonPressed = event.which;
    this.isPressed = true;
	this.checkHover();
}
Mouse.prototype.mouseReleased = function (event) {
    this.isPressed = false;
	this.isReleased = true;
	this.checkHover();
}
