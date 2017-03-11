// Faction class, holds properties of independent faction and its owned agents and structures

// constants for default colour palettes
const factionColours = ["#798EFF", "#4CFF00", "#FFD800", "#FF0000", "#B200FF", "#FF6A00", "#FFFFFF", "#606060", "#22B14C", "#880015", "#99D9EA", "#202020", "#3F48CC", "#7F6A00", "#FF00FF", "#D4D4D4"];

// Class handles simulation knowledge pertaining to one faction of agents and structures
//
// Constructor takes ID number to refer to this faction within containing array
function Faction(inID) {
	this.id = inID;
	this.paletteID = this.id;
	this.name = randomName();
	this.isPlayerControlled = false;
	if (this.id < factionColours.length) {
		this.colour = factionColours[this.id];
	} else {
		this.colour = randomRGBString();
		this.paletteID = 6;
	}
	this.visionMap = {};
	
	this.isAlive = true;
	this.unitTotal = 0;
	this.cityTotal = 0;
	
	this.areaTotal = 0;
	this.prodTotal = 0;
	this.nextBuild = NONE;
	this.landmassLocation = [];
}
