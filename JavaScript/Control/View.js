function View() {
	// plans for this module are that it has an offset in world coords
	this.offsetX = 0;
	this.offsetY = 0;
	// which will be set to currently active unit (perhaps only changing if unit
	// isn't currently visible?)

	// then a measure of the span of the view; how many tiles there are from
	// the center to the corners of the main view

	this.borderLeft = 7;
	this.borderTop = 5;

	// lastly a zoom value by which the tile sprites should be scaled, this
	// will be an integer for clean lines
	this.zoom = 3;

	// these values will change when the window is resized, experiement with
	// having multiple event listeners on window.onresize
	this.cornerX = this.offsetX - this.borderLeft;
	this.cornerY = this.offsetY - this.borderTop;
}
View.prototype.update = function(focusX, focusY) {
	this.offsetX = focusX;
	this.offsetY = focusY;

	this.cornerX = this.offsetX - this.borderLeft;
	this.cornerY = this.offsetY - this.borderTop;

	this.width = this.borderLeft*2+1;
	this.height = this.borderTop*2+1;
	//TODO handle player changing the zoom level and update the span accordingly
}
