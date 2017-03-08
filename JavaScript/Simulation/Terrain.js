// Terrain sub class, holds information on the world's terrain

// Class handles the actual terrain data of the simulation
// Contains:
// * array of Tile instances
//
// Constructor takes desired dimensions of new world terrain
function Terrain(inWidth, inHeight) {
	this.width = inWidth || 80;
	this.height = inHeight || this.width/2;

	this.border = 2;
	this.totalLand = 0;
	this.landRatio = 0.5;

	this.tile = [];
	for (var i=0; i<this.width; i++) {
		this.tile[i] = [];
		for (var j=0; j<this.height; j++) {
			this.tile[i][j] = new Tile(terrainID.water);
		}
	}
	this.generateLandmass();

	this.regionDetails = [];
	this.identifyIslands();
	this.identifyCoast();
	this.setGlobalDesirability();
}
// TODO commentary
Terrain.prototype.generateLandmass = function() {
	var stencil = [], sx, sy, direc;
	var stamp = [[0,0], [1,0], [0,1], [-1,0], [0,-1]];
	var adj = [[1,0], [0,1], [-1,0], [0,-1]];
	var desiredLand = (this.width-2*this.border)*(this.height-2*this.border)*this.landRatio;
	while (this.totalLand < desiredLand) {
		stencil = create2DArray(this.width, this.height, 0);
		sx = randomInteger(this.width - 2*this.border) + this.border;
		sy = randomInteger(this.height - 2*this.border) + this.border;
		for (var i = randomInteger(63)+1; i>0 && this.isWithinBorders(sx,sy); i--) {
			for (var e=0; e<stamp.length; e++) {
				stencil[sx+stamp[e][0]][sy+stamp[e][1]] = 1;
			}
			direc = randomChoice(adj);
			sx += direc[0];
			sy += direc[1];
		}
		for (var i=0; i<this.width; i++) {
			for (var j=0; j<this.height; j++) {
				if (stencil[i][j]>0 && this.tile[i][j].type == terrainID.water) {
					this.tile[i][j].type = terrainID.grass;
					this.totalLand++;
				}
			}
		}
	}
}
Terrain.prototype.identifyCoast = function() {
	var adj = [ [0,-1], [1,-1], [1,0], [1,1], [0,1], [-1,1], [-1,0], [-1,-1] ];
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.tile[i][j].type == terrainID.water) {
				for (var e=0; e<adj.length; e++) {
					var nx = i + adj[e][0];
					var ny = j + adj[e][1];
					if (this.isInBounds(nx,ny) && this.tile[nx][ny].type == terrainID.grass) {
						this.tile[i][j].isCoast = true;
						this.tile[i][j].adjacentCoast[e] = true;
					} else {
						this.tile[i][j].adjacentCoast[e] = false;
					}
				}
			}
		}
	}
}
Terrain.prototype.identifyIslands = function() {
	var adj = [ [-1,0],[0,-1], [1,0], [0,1] ];
	var islandStats = [];
	var currentIslandID = 0;
	var foundAll = false;
	var checklist=[], nextCheck=[];
	var found = false;
	var i=0, j=0;
	while (foundAll == false) {
		checklist=[];
		nextCheck=[];
		found = false;
		i=0;
		j=0;
		// find unassigned island tile
		while (found == false && j<this.height) {
			if (this.tile[i][j].type == terrainID.grass
				&& this.tile[i][j].islandID == NONE) {
				found = true;
				checklist = [[i, j]];
				islandStats[currentIslandID] = 0;
			}
			i++;
			if (i>=this.width) {
				j++;
				i=0;
			}
		}
		if (found == false) {
			foundAll = true;
		}
		// floodfill island ids
		while (checklist.length>0) {
			for (var x=0; x<checklist.length; x++) {
				for (var y=0; y<adj.length; y++) {
					var nx = checklist[x][0] + adj[y][0];
					var ny = checklist[x][1] + adj[y][1];
					if (this.isInBounds(nx,ny)
						&& this.tile[nx][ny].type == terrainID.grass
						&& this.tile[nx][ny].islandID == NONE ){
						this.tile[nx][ny].islandID = currentIslandID;
						islandStats[currentIslandID]++;
						nextCheck.push( [nx, ny] );
					}
				}
			}
			checklist = nextCheck;
			nextCheck = [];
		}
		if (foundAll == false) {
			this.regionDetails.push(new RegionDetails(islandStats[currentIslandID]));
		}
		currentIslandID++;
	}
}
Terrain.prototype.setGlobalDesirability = function() {
	var fatCross = [
		[0,0],[-1,0],[0,-1],[1,0],[0,1],[-2,0],[0,-2],[2,0],[0,2],
		[-1,-1],[1,-1],[1,1],[-1,1],[-2,1],[1,-2],[2,1],[1,2],
		[-2,-1],[-1,-2],[2,-1],[-1,2]
	];
	var nx, ny, total;
	for (var i=0; i<this.width; i++) {
		for (var j=0; j<this.height; j++) {
			if (this.tile[i][j].type == terrainID.grass) {
				total = 0;
				for (var e=0; e<fatCross.length; e++) {
					nx = i + fatCross[e][0];
					ny = j + fatCross[e][1];
					if (this.isInBounds(nx,ny)) {
						if (this.tile[nx][ny].type == terrainID.grass) {
							total++;
						}
					}
				}
				if (total == fatCross.length) {
					this.tile[i][j].desirability = ratingID.perfect;
				} else if (total > REQUIRED_DESIRABILITY) {
					this.tile[i][j].desirability = ratingID.good;
				}
			}
		}
	}
}
Terrain.prototype.isInBounds = function(x, y) {
	if (x>=0 && x<this.width && y>=0 && y<this.height) {
		return true;
	}
	return false;
}
Terrain.prototype.isWithinBorders = function(x, y) {
	if (x>this.border && x<(this.width-this.border)-1 && y>this.border && y<(this.height-this.border)-1 ) {
		return true;
	}
	return false;
}
Terrain.prototype.getValidPosition = function() {
	var nx=0, ny=0, found=false, tile;
	while (found==false) {
			nx = randomInteger(this.width);
			ny = randomInteger(this.height);
			tile = this.tile[nx][ny];
			if (tile.type == terrainID.grass && tile.occupiers.length == 0 && tile.cityPresent == NONE) {
				found = true;
			}
		}
	return {x:nx, y:ny};
}
