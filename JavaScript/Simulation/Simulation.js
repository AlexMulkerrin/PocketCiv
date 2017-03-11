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
	this.currentFaction = 0;
	this.turnStart = true;
	this.currentFactionDone = false;
	this.currentAgent = 0;

	this.playerFaction = 0;

	this.terrain = new Terrain(); //new Terrain(width, height);
	this.faction = [];
	this.agent = [];
	this.city = [];
	this.generateStartingFactions(8, 1, 1);
	this.updateFactionDetails();
}
// TODO commentary
// main update cycle
Simulation.prototype.update = function() {
	if (this.isRunning) {
		this.progressFactionTurn();

		if (this.currentFactionDone) {
			this.progressGeneration();

			if (this.currentFaction >= this.faction.length) {
				this.generation++;
				this.updateFactionDetails();
				this.currentFaction = 0;
			}
		}
	}
}
Simulation.prototype.progressGeneration = function() {
	this.currentFaction++;
	this.currentFactionDone = false;
	this.turnStart = true;
	this.currentAgent = 0;
}
Simulation.prototype.progressFactionTurn = function() {
	if (this.turnStart) {
		this.updateFactionCities();
		this.turnStart = false;
	}
	// AI factions don't wait for user input!
	if (this.faction[this.currentFaction].isPlayerControlled == false) {
		while (this.currentFactionDone == false) {
			// get next agent of faction
			while (	this.currentAgent < this.agent.length
					&& this.agent[this.currentAgent].faction.id !== this.currentFaction ) {
				this.currentAgent++;
			}
			// if valid agent resolve movement
			if (this.currentAgent < this.agent.length) {
				this.progressComputerAgent();
			} else {
				this.endFactionTurn();
			}
		}
	} else {
		this.endFactionTurn();
	}
}
Simulation.prototype.updateFactionCities = function() {
	for (var i=0; i<this.city.length; i++) { // production from cities
		city = this.city[i];
		if (city.faction.id == this.currentFaction) {
			city.productionRate = city.getYield();
			city.stored += city.productionRate;

			if (city.stored > UNIT_COST ) {
				city.stored -= UNIT_COST;
				this.agent.push(new Agent(city.x, city.y, city.faction));
			}
		}
	}
}
Simulation.prototype.endFactionTurn = function() {
	var newAgentList = [];
	for (var i=0; i<this.agent.length; i++) { // remove dead agents and get agent vision
		if (this.agent[i].isAlive) {
			this.showVision(this.agent[i]);
			// if not settled continue to be an agent.
			// why checked again? AI can settle on checking vision, BUG!
			if (this.agent[i].isAlive) {
				newAgentList.push(this.agent[i]);
			}
		}
	}
	this.agent = newAgentList;

	for (var i=0; i<this.city.length; i++) { // get city vision
		this.showVision(this.city[i], true);
	}
	this.currentFactionDone = true;
}
Simulation.prototype.progressComputerAgent = function() {
	var agent = this.agent[this.currentAgent];
	this.showVision(agent);
	if (agent.isAlive) {
		this.randomWalk(agent);
	}
	// get new vision and check for settling
	if (agent.isAlive) {
		this.showVision(agent);
		//this.checkSettling(agent);
	}
	this.currentAgent++;
}
// agent movement and fights
Simulation.prototype.randomWalk = function(agent) {
	var adj = [[0,1],[0,-1],[1,0],[-1,0]];
	var choice = randomInteger(4);
	var nx = agent.x + adj[choice][0];
	var ny = agent.y + adj[choice][1];
	if (this.terrain.isInBounds(nx,ny) && this.terrain.tile[nx][ny].type == terrainID.grass) {
		//this.resolveAgentOccupations(agent, nx, ny);
		agent.x = nx;
		agent.y = ny;
	}
}
// general functions
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

	for (var i=0; i<this.agent.length; i++) { // make sure vision maps up to date!
		this.showVision(this.agent[i]);
	}
	for (var i=0; i<this.city.length; i++) { // get city vision
		this.showVision(this.city[i], true);
	}

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
				var prod = this.city[j].getYield();
				var timeToBuild = Math.ceil((UNIT_COST-this.city[j].stored)/prod);
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
