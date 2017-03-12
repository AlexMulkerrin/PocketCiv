// Agent sub class, holds properties and state of mobile simulation agent

// constants for action states of an agent
const stateID = {wander:0, explore:1, settle:2};
const standardVisionMatrix = [	[-1,-1],[0,-1],[1,-1],
								[-1,0], [0,0], [1,0],
								[-1,1], [0,1], [1,1]
							 ];

// Class acts as store of all the information pertaining to an individual agent within the simulation
// Refers to the following modules within its methods:
// * Faction instance that it belongs to
//
// Constructor takes desired location within the simulation world and owning faction reference
function Agent(inX, inY, inFaction) {
	this.x = inX;
	this.y = inY;
	this.faction = inFaction;

	this.path = [];
	this.hasTarget = false;
	this.state = stateID.explore;
	this.isAlive = true;
}
Agent.prototype.findUnexplored = function() {
	// TODO
	var result = this.populateNavmesh();
	if (result.found) {
		this.path = this.getPath(result.navmesh, result.dist, result.end);
		return true;
	}
	return false;
}
Agent.prototype.populateNavmesh = function() {
	var map = this.faction.visionMap;
	var navmesh = create2DArray(map.width, map.height, NONE);
	var dist = 0, found = false;
	navmesh[this.x][this.y] = dist;
	var adj = [ [-1,0],[0,-1], [1,0], [0,1] ];
	var checklist=[[this.x, this.y]], nextCheck=[];
	var end = [0,0];
	while (checklist.length>0 && found == false) { //TODO make generic floodfill? found = flood(nav)
		dist++;
		for (var i=0; i<checklist.length; i++) {
			for (var j=0; j<adj.length; j++) {
				var nx = checklist[i][0] + adj[j][0];
				var ny = checklist[i][1] + adj[j][1];
				if (map.isInBounds(nx,ny) && map.tile[nx][ny].type == terrainID.grass) {
					if (navmesh[nx][ny] == NONE) {
						navmesh[nx][ny] = dist;
						nextCheck.push( [nx, ny] );
						if (map.isUnexplored(nx,ny)) {
							found = true;
							end = [nx, ny];
						}
					}
				}
			}
		}
		checklist = nextCheck;
		nextCheck = [];
	}
	return {found:found, navmesh:navmesh, end:end, dist:dist};
}
Agent.prototype.getPath = function(navmesh, dist, end) {
	var map = this.faction.visionMap;
	var adj = [ [-1,0],[0,-1], [1,0], [0,1] ];
	var pathPos = [];
	pathPos[0] = end;
	var path = [];
	var i=0;
	while (dist>0) {
		dist--;
		for (var j=0; j<adj.length; j++) {
			var nx = pathPos[i][0] + adj[j][0];
			var ny = pathPos[i][1] + adj[j][1];
			if (map.isInBounds(nx,ny) && map.tile[nx][ny].type == terrainID.grass) {
				if (navmesh[nx][ny] == dist) {
					pathPos[i+1] = [nx, ny];
					var invX = -1*adj[j][0];
					var invY = -1*adj[j][1];
					path[i+1] = [invX, invY];
				}
			}
		}
		i++;
	}
	return path;
}
