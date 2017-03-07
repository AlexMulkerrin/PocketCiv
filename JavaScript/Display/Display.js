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
	this.sidebarWidth = 160;

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
				this.ctx.fillStyle = interfaceColours.land;
				this.ctx.fillRect(i*this.sqSize,j*this.sqSize,this.sqSize,this.sqSize);

			} else if (terrain.tile[i][j].type == terrainID.water) {
				this.ctx.fillStyle = interfaceColours.water;
				this.ctx.fillRect(i*this.sqSize,j*this.sqSize,this.sqSize,this.sqSize);
			}

		}
	}

}
Display.prototype.showDebugInfo = function() {
	var offsetX = this.targetSim.terrain.width*this.sqSize+5;
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText("Generation: "+this.targetSim.generation, offsetX, this.fontSize);
	this.ctx.fillText("Window: "+this.canvas.width+" by "+this.canvas.height, offsetX, this.fontSize*2);

	for (var i=0; i<this.targetSim.terrain.islandStats.length; i++) {
		var output = "Isle #"+i+": ";
		output += "size: " + this.targetSim.terrain.islandStats[i];
		this.ctx.fillText(output,offsetX,this.fontSize*(i+3));
	}

}
