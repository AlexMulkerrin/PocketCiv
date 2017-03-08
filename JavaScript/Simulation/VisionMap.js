// Vision Map class, similar to Terrain class, holds a single faction's knowledge of the world

// constants for state of vision on an individual tile
const visionID = {unseen:0, seen:1, visible:2};

// Class tracks what knowledge a faction has gained about the world
// Contains:
// * an array of Tile instances with additional properties
//
// Constructor takes desired dimensions of new visibility map
function VisionMap(inWidth, inHeight) {
	this.width = inWidth;
	this.height = inHeight;
	this.tile = []
	for (var i=0; i<this.width ; i++) {
		this.tile[i] = [];
		for (var j=0; j<this.height ; j++) {
			this.tile[i][j] = new Tile();
			this.tile[i][j].state = visionID.unseen;
			this.tile[i][j].lastSeen= NONE;
		}
	}
}
VisionMap.prototype.isInBounds = function(x, y) {
	if (x>=0 && x<this.width && y>=0 && y<this.height) {
		return true;
	}
	return false;
}
