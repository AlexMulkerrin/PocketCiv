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
	this.generateStartingFactions(16, 1, 1);
	this.updateFactionDetails();
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
		for (var j=0; j<numCities; j++) {
			var pos = this.terrain.getValidPosition();
			var newCity = new Structure(j, pos.x, pos.y, newFaction);
			this.terrain.tile[pos.x][pos.y].cityPresent = newCity;

			this.foundCity(newCity);
			this.city.push(newCity);
			this.showVision(newCity, true);
			
		}
	}
}
Simulation.prototype.updateFactionDetails = function() {;
	var unitTotal, cityTotal, areaTotal, prodTotal, nextBuild, landmass;
	for (var i=0; i<this.faction.length; i++) {
		unitTotal = 0;
		cityTotal = 0;
		areaTotal = 0;
		prodTotal = 0;
		nextBuild = NONE;
		landmass = [];
		for (var j=0; j<this.terrain.regionDetails.length; j++) {
			landmass[j] = 0;
		}
		
		for (var j=0; j<this.agent.length; j++) {
			if (this.agent[j].faction.id == i) {
				unitTotal++;
			}
		}
		for (var j=0; j<this.city.length; j++) {
			if (this.city[j].faction.id == i) {
				cityTotal++;
				var prod = this.city[i].getYield();
				var timeToBuild = Math.ceil((UNIT_COST-this.city[i].stored)/prod);
				this.city[j].timeToBuild = timeToBuild;
				prodTotal += prod;
				
				var x = this.city[j].x;
				var y = this.city[j].y;
				var landmassID = this.terrain.tile[x][y].islandID;
				landmass[landmassID] += prod;
				
				if (nextBuild == NONE) {
					nextBuild = timeToBuild;
				} else if (timeToBuild < nextBuild) {
					nextBuild = timeToBuild
				}
			}
		}
		this.faction[i].unitTotal = unitTotal;
		this.faction[i].cityTotal = cityTotal;
		this.faction[i].areaTotal = prodTotal; // same as production at the moment...
		this.faction[i].prodTotal = prodTotal;
		this.faction[i].nextBuild = nextBuild;
		this.faction[i].landmassLocation = landmass;
	}
}
Simulation.prototype.showVision = function(agent, isStructure) {
	var x,y,factionVision;
	var adj = [];
	if (isStructure) {
		adj = cityCross;
	} else {
		adj = standardVisionMatrix;
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
Simulation.prototype.foundCity = function(city) {
	var nx, ny;
	for (var i=0; i<cityCross.length; i++) {
		nx = city.x + cityCross[i][0];
		ny = city.y + cityCross[i][1];
		if (this.terrain.isInBounds(nx, ny)
			&& this.terrain.tile[nx][ny].cityTerritory == NONE
			&& this.terrain.tile[nx][ny].type == terrainID.grass) {
			this.terrain.tile[nx][ny].cityTerritory = city;
			this.faction[city.faction.id].visionMap.tile[nx][ny].cityTerritory = city.id;
		}
	}
}
Simulation.prototype.getDate = function() {
	return 4000 - this.generation*20;
}
