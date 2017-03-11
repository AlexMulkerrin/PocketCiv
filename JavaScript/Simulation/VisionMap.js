// Vision Map class, similar to Terrain class, holds a single faction's knowledge of the world

// constants for state of vision on an individual tile
const visionID = {unseen:0, seen:1, visible:2};
const ratingName = ["invalid", "rubbish", "poor", "fine", "good", "perfect"];
const ratingCutoff = [0, 1, 10, 14, 17, 21]

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
VisionMap.prototype.isUnexplored = function(cx, cy) {
	//TODO
}
VisionMap.prototype.checkDesirability = function(x, y) {
	if (this.tile[x][y].cityTerritory !== NONE) {
		return {valid:false, rating:ratingName[i]};
	}
	var unknownTotal = 0, grassTotal = 0;
	var nx, ny, currentTile;
	for (var i=0; i<cityCross.length; i++) {
		nx = x + cityCross[i][0];
		ny = y + cityCross[i][1];
		if (this.isInBounds(nx, ny)) {
			currentTile = this.tile[nx][ny];
			if (currentTile.type == terrainID.unknown) {
				unknownTotal++;
			} else if (currentTile.type == terrainID.grass
					   && currentTile.cityTerritory == NONE) {
				grassTotal++;
			}
		}
	}
	var name = "error";
	for (var i=0; i<ratingName.length; i++) {
		if (grassTotal >= ratingCutoff[i]) name = ratingName[i];
	}
	return {valid:true, unknown:unknownTotal, grass:grassTotal, rating:name};
}
