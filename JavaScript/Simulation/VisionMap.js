// Vision Map class, similar to Terrain class, holds a single faction's knowledge of the world

// constants for state of vision on an individual tile
const visionID = {unseen:0, seen:1, visible:2};

// Class tracks what knowledge a faction has gained about the world
// Contains:
// * an array of Tile instances with additional properties
//
// Constructor takes desired dimensions of new visibility map
function VisionMap(inWidth, inHeight) {

}