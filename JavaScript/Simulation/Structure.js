// Structure sub class, holds properties of state simulation structure

const cityCross = [[0,0],[-1,0],[0,-1],[1,0],[0,1],[-2,0],[0,-2],[2,0],[0,2],[-1,-1],[1,-1],
				[1,1],[-1,1],[-2,1],[1,-2],[2,1],[1,2],[-2,-1],[-1,-2],[2,-1],[-1,2]];

// Class acts as store of all the information pertaining to an indivdual structure within the simulation
//
// Constructor takes index within array of structures, desired location within the simulation world and owning faction reference
function Structure(index, inX, inY, inFaction) {
	this.id = index;
	this.name = randomName();
	this.x = inX;
	this.y = inY;
	this.faction = inFaction;
	this.stored = 0;
	this.productionRate = 0;
}
Structure.prototype.getYield = function() {
	var map = this.faction.visionMap;
	var grassTotal = 0;
	var nx, ny;
	for (var i=0; i<cityCross.length; i++) {
		nx = this.x + cityCross[i][0];
		ny = this.y + cityCross[i][1];
		if (map.isInBounds(nx, ny)) {
			var currentTile = map.tile[nx][ny];
			if (currentTile.type = terrainID.grass
				&& currentTile.cityTerritory == this.id) {
				grassTotal++;
			}
		}
	}
	return grassTotal;
}
