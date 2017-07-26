// Program class, root of whole Application

/* !!! ATTENTION !!!
* The main program object which holds the entire client state is a global!
* this means that you can hack the game in real time :O
* Doing things like:
* "program.simulation.isDebugMode = true" whenever you please :!
* You could do *anything* you please with the client state, it's an open book :D */
var program;

// loader function invoked on page load
function loadProgram() {
	program = new Program();
	window.requestAnimationFrame( function(){program.update();});
}

// Class containing all modules of Application:
//	* Simulation
//	* Control
//	* Display
//
// Constructor deals with instantiating these sub modules and connecting them correctly
function Program() {
	this.updateRate = 2;
	this.control = new Control(this);
	this.createNewProgram();
}
// TODO comment
Program.prototype.createNewProgram = function() {
	this.timer = 0;
	this.simulation = new Simulation(80, 50);
	//enable debug mode for extra stats and info
	//this.simulation.isDebugMode = true;

	this.display = new Display(this.simulation, this.control);
}
// main update method, fires on every animation frame (60fps unless browser tab loses focus)
Program.prototype.update = function() {
	this.timer++;
	if (this.timer % this.updateRate == 0) {
		this.simulation.update();
		if (this.display.tileset.isLoaded) this.display.refresh();
	}
	var t = this;
	window.requestAnimationFrame( function(){t.update();} );
}
Program.prototype.toggleDebugMode = function() {
	this.simulation.isDebugMode = !this.simulation.isDebugMode;
}
