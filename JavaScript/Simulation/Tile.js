// Tile sub class, holds properties of individual terrain tiles

// constants for valid terrain types and marker for missing references
const terrainID = {unknown:0, water:1, grass:2};
const ratingID = {poor:0, good:1, perfect:2};
const NONE = -1;

// Class acts as reference to information about a tile's terrain type and its contents
//
// Constructor instantiates Tile object with input terrain type and null references to content
function Tile(inTerrainID) {
	this.type = inTerrainID || terrainID.unknown;
	this.occupiers = [];
	this.cityPresent = NONE;
	this.desirability = ratingID.poor;
	this.cityTerritory = NONE;
	this.islandID = NONE;
	this.isCoast = false;
	this.adjacentCoast = [];
}
