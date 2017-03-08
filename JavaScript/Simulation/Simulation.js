// Simulation class, root of simulation module

// constants describing gameplay attributes
const UNIT_COST = 420;
const REQUIRED_DESIRABILITY = 14;

// Class handles all updates of the game simulation,
// Separates global simulation from per client state
// Contains:
// * Terrain
// * array of Faction instances
// * array of Agent instances
// * array of Structure instances
//
// Constructor takes dimensions to pass to Terrain sub module
function Simulation(width, height) {
	this.isContested = true;
	this.isRunning = true;
	this.isDebugMode = false;

	this.generation = 0;
	this.playerFaction = 0;

	this.terrain = new Terrain(); //new Terrain(width, height);
	this.faction = [];
	this.agent = [];
	this.city = [];
	this.generateStartingFactions(1, 16, 0);
}
// TODO commentary
Simulation.prototype.update = function() {
	if (this.isRunning) {
		this.generation++;
	}
}
Simulation.prototype.generateStartingFactions = function(numFactions, numAgents, numCities) {
	var x=0, y=0, found = false;
	for (var i=0; i<numFactions; i++) {
		newFaction = new Faction(i);
		newFaction.visionMap = new VisionMap(this.terrain.width, this.terrain.height);
		this.faction.push(newFaction);
		for (var j=0; j<numAgents; j++) {
			var pos = this.terrain.getValidPosition();
			var newAgent = new Agent(pos.x, pos.y, newFaction);

			newAgent.state = stateID.wander;
			this.terrain.tile[pos.x][pos.y].occupiers.push(newAgent);
			this.agent.push(newAgent);
			this.showVision(newAgent);
		}
	}
}
Simulation.prototype.showVision = function(agent, isStructure) {
	var x,y,factionVision;
	var adj = [];
	if (isStructure) {
		adj = [[0,0],[-1,0],[0,-1],[1,0],[0,1],[-2,0],[0,-2],[2,0],[0,2],[-1,-1],
		[1,-1],[1,1],[-1,1],[-2,1],[1,-2],[2,1],[1,2],[-2,-1],[-1,-2],[2,-1],[-1,2]];
	} else {
		adj =[ [0,0],[-1,0], [1,0], [0,-1], [0,1],[-1,-1], [-1,1], [1,-1], [1,1] ];
	}
	for (var i=0; i<adj.length; i++) {
		x = agent.x + adj[i][0];
		y = agent.y + adj[i][1];
		factionVision = agent.faction.visionMap;
		if (this.terrain.isInBounds(x,y)) {
			var sourceTile = this.terrain.tile[x][y];
			factionVision.tile[x][y].state = visionID.seen;
			factionVision.tile[x][y].lastSeen = this.generation;

			// global knowledge each faction can explore to learn.
			factionVision.tile[x][y].type = sourceTile.type;
			factionVision.tile[x][y].desirability = sourceTile.desirability;
			factionVision.tile[x][y].isCoast = sourceTile.isCoast;
			factionVision.tile[x][y].adjacentCoast = sourceTile.adjacentCoast;

			if (sourceTile.cityTerritory !== NONE) {
				factionVision.tile[x][y].cityTerritory = sourceTile.cityTerritory.id;
			}
		}
	}
}
