// Agent sub class, holds properties and state of mobile simulation agent

// constants for action states of an agent
const stateID = {wander:0, explore:1, settle:2};

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
