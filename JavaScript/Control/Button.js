function Button(x, y, width, height, icon, hotkey, func, funcArgs) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;

	this.icon = icon;
	this.hotkey = hotkey;

	this.function = func;
	this.functionArguments = funcArgs;

	this.isHovered = false;
    this.isSelected = false;
    this.isClicked = false;
}

Button.prototype.isInBounds = function(x, y) {
	if (x >= this.x && x <= this.x+this.width &&
		y >= this.y && y <= this.y+this.height) {
			return true;
		} else {
			return false;
		}
}
