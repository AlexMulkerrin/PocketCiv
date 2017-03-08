// Display class, root of display module

//
const interfaceColours = {background:"#444444", text:"#ffffff", land:"#89A050", water:"#5897B7"};

// Class handles all rendering operations to screen
// Takes information from the following modules to display:
//	* Simulation
//	* Control
//
// Constructor takes Simulation module to reference it on refreshes
function Display(inSimulation) {
	this.targetSim = inSimulation;
	this.sqSize = 16;
	this.fontSize = 16;
	this.scale = 1;
	this.sidebarWidth = 160;

	this.tileset = new Image();
	// location from where index.html is, not the script file...
	this.tileset.src = "Resources/Images/Tileset0.png"

	this.canvas = document.getElementById("pocketCivCanvas");
	this.ctx = this.canvas.getContext("2d");
	this.resizeCanvas();



	var t = this;
	window.onresize = function(){t.resizeCanvas();};
}
Display.prototype.resizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx.font = "bold "+this.fontSize+"px Arial";

	var widthScale = (this.canvas.width- this.sidebarWidth)/this.targetSim.terrain.width ;
	var heightScale = this.canvas.height/this.targetSim.terrain.height;
	maxScale = Math.floor(Math.min(widthScale, heightScale));
	this.sqSize = maxScale;

	this.refresh();
}
Display.prototype.refresh = function() {
	this.clearScreen();
	this.drawMainMap();
	if (this.targetSim.isDebugMode) this.showDebugInfo();
}
Display.prototype.clearScreen = function() {
	this.ctx.fillStyle = interfaceColours.background;
	this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
}
Display.prototype.drawMainMap = function() {
	var terrain = this.targetSim.terrain;
	for (var i=0; i<terrain.width; i++) {
		for (var j=0; j<terrain.height; j++) {
			if (terrain.tile[i][j].type == terrainID.grass) {
				switch (terrain.tile[i][j].desirability) {
					case ratingID.perfect:
						this.drawTile(i*this.sqSize,j*this.sqSize, 3);
						break;

					case ratingID.good:
						this.drawTile(i*this.sqSize,j*this.sqSize, 2);
						break;

					case ratingID.poor:
					default:
						this.drawTile(i*this.sqSize,j*this.sqSize, 1);
						break;
				}
			} else if (terrain.tile[i][j].type == terrainID.water) {
				if (terrain.tile[i][j].isCoast) {
					this.drawCoastTile(i*this.sqSize,j*this.sqSize, terrain.tile[i][j]);
				} else {
					this.drawTile(i*this.sqSize,j*this.sqSize, 0);
				}
			}

		}
	}

}
Display.prototype.showDebugInfo = function() {
	var offsetX = this.targetSim.terrain.width*this.sqSize+5;
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText("Generation: "+this.targetSim.generation, offsetX, this.fontSize);
	this.ctx.fillText("Window: "+this.canvas.width+" by "+this.canvas.height, offsetX, this.fontSize*2);
	this.ctx.fillText("SqSize: "+this.sqSize, offsetX, this.fontSize*3);


	for (var i=0; i<this.targetSim.terrain.regionDetails.length; i++) {
		var output = this.targetSim.terrain.regionDetails[i].name;
		//output += "size: " + this.targetSim.terrain.islandStats[i];
		output += " " + this.targetSim.terrain.regionDetails[i].sizeClass;
		output += " (" + this.targetSim.terrain.regionDetails[i].size+")";
		this.ctx.fillText(output,offsetX,this.fontSize*(i+4));
	}

	this.ctx.drawImage(this.tileset,offsetX,this.canvas.height-this.tileset.height);
}
Display.prototype.drawCoastTile = function(x, y, tile) {
	var index = 19;
	var adjIndexes = [ [0,1,2], [4,3,2], [4,5,6], [0,7,6] ];

	// use names for the tileset indicies
	var tileName = {none:0, endHoriz:12, endVert:13, sideHoriz:16, sideVert:17, full:18, corner:19, strait:21};
	var tileChoices = [	tileName.none, tileName.endHoriz, tileName.corner,
						tileName.sideHoriz, tileName.endVert , tileName.strait,
						tileName.sideVert, tileName.full
					];

	for (var e=0; e<adjIndexes.length; e++) {
		var choiceIndex = 0;
		var hasAdjVert = tile.adjacentCoast[adjIndexes[e][0]];
		var hasAdjCorner = tile.adjacentCoast[adjIndexes[e][1]];
		var hasAdjHoriz = tile.adjacentCoast[adjIndexes[e][2]];

		if (hasAdjVert) choiceIndex += 1;
		if (hasAdjCorner) choiceIndex += 2;
		if (hasAdjHoriz) choiceIndex += 4;

		index = tileChoices[choiceIndex];
		this.drawQuarterTile(x, y, index, e);
	}
}
Display.prototype.drawQuarterTile = function(x, y, index, quarterID) {
	var quarterPos = [ [8,0], [8,8], [0,8], [0,0] ];
	var sx = (index % 4)*17 + quarterPos[quarterID][0];
	var sy = Math.floor(index/4)*17 + quarterPos[quarterID][1];
	var qx = x + quarterPos[quarterID][0];
	var qy = y + quarterPos[quarterID][1];
	this.ctx.drawImage(this.tileset, sx, sy, 8, 8, qx, qy, 8*this.scale, 8*this.scale);
}
Display.prototype.drawTile = function(x, y, index) {
	var sx = (index % 4)*17;
	var sy = Math.floor(index/4)*17;
	this.ctx.drawImage(this.tileset, sx, sy, 16, 16, x, y, 16*this.scale, 16*this.scale);
}
