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

	this.terrain = new Terrain(width, height);
}
// TODO commentary
Simulation.prototype.update = function() {
	if (this.isRunning) {
		this.generation++;
	}
}
