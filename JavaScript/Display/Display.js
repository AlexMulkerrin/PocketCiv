// Display class, root of display module

//
const interfaceColours = {background:"#444444", text:"#ffffff"};

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

	this.canvas = document.getElementById("pocketCivCanvas");
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;

	this.ctx = this.canvas.getContext("2d");
	this.ctx.font = "bold "+this.fontSize+"px Arial";

	var t = this;
	window.onresize = function(){t.resizeCanvas();};
}
Display.prototype.resizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.refresh();
}
Display.prototype.refresh = function() {
	this.ctx.fillStyle = interfaceColours.background;
	this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);

	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText("Generation: "+this.targetSim.generation, this.fontSize, this.fontSize);

}
