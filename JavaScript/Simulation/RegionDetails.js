// TODO comments

const islandClasses = [	["pangea",1000], ["continent",500], ["sub continent",250],
 						["island",100], ["islet",20], ["atoll",0] ];

function RegionDetails(inSize, inType) {
	this.type = inType || terrainID.grass;
	this.size = inSize || 0;
	this.name = randomName();
	this.sizeClass = "NONE";
	var i=0;
	while (this.sizeClass == "NONE") {
		if (this.size >= islandClasses[i][1]) {
			this.sizeClass = islandClasses[i][0]
		}
		i++;
	}
	this.occupiers = [];
	this.centerX = 0;
	this.centerY = 0;
}
RegionDetails.prototype.updateOccupiers = function(faction) {
	
}