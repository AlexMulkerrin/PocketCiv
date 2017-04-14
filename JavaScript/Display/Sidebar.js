
function Sidebar(inSimulation, inControl) {
	this.targetSim = inSimulation;
	this.targetControl = inControl;

	this.width = 240;
	this.fontSize = 16;

	this.output =  document.createElement('canvas');
	this.ctx = this.output.getContext("2d");
	this.resizeSidebar();
}
Sidebar.prototype.resizeSidebar = function() {
	this.output.width = this.width;
	this.output.height = window.innerHeight;
	this.ctx.font = "bold "+this.fontSize+"px Arial";
}
// User Interface
Sidebar.prototype.refreshUserInterface = function() {
	this.clearSidebar();
	this.drawMinimap();
	this.showGameDetails();
	this.showLandmassDetails();
	this.showTutorialText();
	var sim = this.targetSim;
	var playerID = sim.playerFaction;
	if (sim.faction[sim.currentFaction].isPlayerControlled
		&& sim.currentAgent<sim.agent.length
		&& sim.agent[sim.currentAgent].faction.id == sim.playerFaction ) {
		this.showSelectionInfo();
	}
	this.showCursorInfo();
}
Sidebar.prototype.clearSidebar = function() {
	this.ctx.fillStyle = interfaceColours.background;
	this.ctx.fillRect(0,0,this.output.width, this.output.height);
}
Sidebar.prototype.showGameDetails = function() {
	var sim = this.targetSim;
	var playerID = sim.playerFaction;
	// put offset with respect to browser window NOT terrain
	var offsetX = 5;

	this.ctx.fillStyle = interfaceColours.text;
	//num cities, num armies
	var output = "Cities: " + sim.faction[playerID].cityTotal;
	output += "\t Units: " + sim.faction[playerID].unitTotal;
	this.ctx.fillText(output, offsetX, this.fontSize);

	//turn num, date
	var output = "Turn: "+sim.generation;
	output += "\t  " + sim.getDate();
	this.ctx.fillText(output, offsetX, this.fontSize*2);

	//owned territory, total production (next construction)
	output = "Area: " + sim.faction[playerID].areaTotal;
	output += "\t Prod: " + sim.faction[playerID].prodTotal;
	output += " (" + sim.faction[playerID].nextBuild + " turns)";
	this.ctx.fillText(output, offsetX, this.fontSize*3);
}
Sidebar.prototype.showLandmassDetails = function() {
	var sim = this.targetSim;
	var playerID = sim.playerFaction;
	var offsetX = 5;

	var percent = 0;
	landmass = sim.faction[playerID].landmassLocation;
	output = "Unknown lands";
	for (var i=0; i<landmass.length; i++) {
		if (landmass[i]>0) {
			output = sim.terrain.regionDetails[i].name;
			output += " " + sim.terrain.regionDetails[i].sizeClass + "\n";
			percent = Math.floor(100*landmass[i]/sim.terrain.regionDetails[i].size);
		}
	}
	this.ctx.fillText(output, offsetX, this.fontSize*5);

	output = "contested? (" + percent + "% of 66%)";
	this.ctx.fillText(output, offsetX, this.fontSize*6);
}
Sidebar.prototype.showTutorialText = function() {
	var offsetX = 5;
	// buttons: wait and settle
	this.ctx.fillText("Move with wasd/arrow keys", offsetX, this.fontSize*16);
	this.ctx.fillText("or skip turn with spacebar", offsetX, this.fontSize*17);
}
Sidebar.prototype.showSelectionInfo = function() {
	// current selection details
	// unit type, faction name
	// movement left, terrain type
	// city territory?
	// settlement suitability
	var agent = this.targetSim.agent[this.targetSim.currentAgent];
	// put offset with respect to browser window NOT terrain
	var offsetX = 5;

	output = agent.faction.name + " Warrior";
	this.ctx.fillText(output, offsetX, this.fontSize*8);
	this.ctx.fillText("Moves: 1/1", offsetX, this.fontSize*9);
	var x = agent.x;
	var y = agent.y;
	var terrain = this.targetSim.terrain.tile[x][y].desirability;
	switch (terrain) {
		case ratingID.poor:
			output = "Plains";
			break;
		case ratingID.good:
			output = "Grassland";
			break;
		case ratingID.perfect:
			output = "Forest";
			break;
		default:
			output = "unknown";
	}
	this.ctx.fillText(output + " ("+x+", "+y+") ", offsetX, this.fontSize*10);
	// settlement rating
	var rating = agent.faction.visionMap.checkDesirability(x, y);
	if (rating.valid == false) {
		this.ctx.fillText("Invalid city location", offsetX, this.fontSize*12);
	} else {
		this.ctx.fillText("Location productivity:", offsetX, this.fontSize*12);
		output = rating.grass;
		if (rating.unknown>0) {
			output += " to " + (rating.unknown+rating.grass);
		}
		if (rating.unknown>10) {
			output += "  (uncertain)";
		} else {
			output += "  (" + rating.rating + ")";
		}
		this.ctx.fillText(output, offsetX, this.fontSize*13);
		if (rating.grass>=14 || terrain == ratingID.perfect) {
			this.ctx.fillStyle = interfaceColours.highlight;
			this.ctx.fillText("Press 'B' to settle", offsetX, this.fontSize*14.5);
			this.ctx.fillStyle = interfaceColours.text;
		}
	}
}
Sidebar.prototype.showCursorInfo = function() { //TODO make method cache the text output to save recalculation each frame
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var offsetX = 5;
	// temporary fix hardcode sqSize
	sqSize = 16;


	var mouse = this.targetControl.mouse;
	this.ctx.fillText("Mouse: "+mouse.x+", "+mouse.y, offsetX, this.fontSize*19);
	var tileX = Math.floor(mouse.x/sqSize);
	var tileY = Math.floor(mouse.y/sqSize);
	this.ctx.fillText("Mouse: "+tileX+", "+tileY, offsetX, this.fontSize*20);
	var output = "-";
	if (map.isInBounds(tileX,tileY)) {
		var terrain = map.tile[tileX][tileY].type;
		switch (terrain) {
			case terrainID.unknown:
				output = "Unexplored";
				break;
			case terrainID.water:
				output = "Ocean";
				break;
			case terrainID.grass:
				var quality = this.targetSim.terrain.tile[tileX][tileY].desirability;
				switch (quality) {
					case ratingID.poor:
						output = "Plains";
						break;
					case ratingID.good:
						output = "Grassland";
						break;
					case ratingID.perfect:
						output = "Forest";
						break;
					default:
						output = "error";
				}
				break;
			default:
				output = "error";
		}

		this.ctx.fillText("Terrain: "+output, offsetX, this.fontSize*21);

		if (map.tile[tileX][tileY].type !== terrainID.unknown || this.targetSim.isDebugMode) {
			// display unit details
			var agent = this.targetSim.agent;
			for (var i=0; i<agent.length; i++) {
				if (tileX == agent[i].x && tileY == agent[i].y
					&& agent[i].isAlive) {
						this.ctx.fillText(agent[i].faction.name+" Warrior", offsetX, this.fontSize*22);
				}
			}
			// display city details
			if (this.targetSim.terrain.tile[tileX][tileY].cityPresent !== NONE) {
				var name = this.targetSim.terrain.tile[tileX][tileY].cityPresent.name;
				var faction = this.targetSim.terrain.tile[tileX][tileY].cityPresent.faction.name;
				this.ctx.fillText(faction+" city of "+name, offsetX, this.fontSize*23);
			}
			// display territory details
			if (this.targetSim.terrain.tile[tileX][tileY].cityTerritory !== NONE) {
				var city = this.targetSim.terrain.tile[tileX][tileY].cityTerritory;
				this.ctx.fillText(city.faction.name+" territory", offsetX, this.fontSize*24);

			}
		}
	}


}
Sidebar.prototype.drawMinimap = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var offsetY = 400;
	var offsetX = 0;
	var sqSize = 3;

	// another hack to fix sqSize code...
	var mainSqSize = 16;

	this.ctx.fillStyle = interfaceColours.minimap;
	this.ctx.fillRect(offsetX,offsetY,this.targetSim.terrain.width*sqSize,this.targetSim.terrain.height*sqSize);

	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			if (map.tile[i][j].type == terrainID.grass) {
				this.ctx.fillStyle = interfaceColours.land;
				this.ctx.fillRect(offsetX+i*sqSize,offsetY+j*sqSize,sqSize,sqSize);
			} else if (map.tile[i][j].type == terrainID.water) {
				this.ctx.fillStyle = interfaceColours.water;
				this.ctx.fillRect(offsetX+i*sqSize,offsetY+j*sqSize,sqSize,sqSize);
			}
		}
	}
	var viewWidth = Math.floor((window.innerWidth-this.width)/mainSqSize);
	if (viewWidth>this.targetSim.terrain.width) viewWidth = this.targetSim.terrain.width;
	viewWidth *= sqSize;
	var viewHeight =  Math.floor(this.output.height/mainSqSize);
	if (viewHeight>this.targetSim.terrain.height) viewHeight = this.targetSim.terrain.height;
	viewHeight *= sqSize;

	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillRect(offsetX, offsetY, 1, viewHeight);
	this.ctx.fillRect(offsetX, offsetY, viewWidth, 1);
	this.ctx.fillRect(offsetX+viewWidth-1, offsetY, 1, viewHeight);
	this.ctx.fillRect(offsetX, offsetY+viewHeight-1, viewWidth, 1);
}
Sidebar.prototype.showDebugInfo = function() {
	// put offset with respect to browser window NOT terrain
	var offsetX = 5;
	this.ctx.fillStyle = interfaceColours.text;

	//this.ctx.fillText("Window: "+this.output.width+" by "+this.output.height, offsetX, this.fontSize*2);
	//this.ctx.fillText("SqSize: "+this.sqSize, offsetX, this.fontSize*3);

	/*for (var i=0; i<this.targetSim.terrain.regionDetails.length; i++) {
		var output = this.targetSim.terrain.regionDetails[i].name;
		//output += "size: " + this.targetSim.terrain.islandStats[i];
		output += " " + this.targetSim.terrain.regionDetails[i].sizeClass;
		output += " (" + this.targetSim.terrain.regionDetails[i].size+")";
		this.ctx.fillText(output,offsetX,this.fontSize*(i+14));
	}*/

	// optional display of tileset graphics	//this.ctx.drawImage(this.spriteSheet.output,offsetX,this.output.height-(this.tileset.height+this.spriteSheet.output.height+this.sqSize));
	//this.ctx.drawImage(this.tileset,offsetX,this.output.height-this.tileset.height);
}
