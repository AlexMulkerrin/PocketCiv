// Program class, root of whole Application

// loader function invoked on page load
function loadProgram() {
	var program = new Program();
	window.requestAnimationFrame( function(){program.update();});
}

// Class containing all modules of Application:
//	* Simulation
//	* Control
//	* Display
//
// Constructor deals with instantiating these sub modules and connecting them correctly
function Program() {
	this.updateRate = 5;
	this.createNewProgram();
}
// to comment
Program.prototype.createNewProgram = function() {
	this.timer = 0;
	this.simulation = new Simulation(80, 50);
	this.control = new Control(this); // will this memory leak? D:
	this.display = new Display(this.simulation);
}
// main update method, fires on every animation frame (60fps unless browser tab loses focus)
Program.prototype.update = function() {
	this.timer++;
	if (this.timer % this.updateRate == 0) {
	//	console.log(this.timer);
		this.simulation.update();
		this.display.refresh();
	}
	var t = this;
	window.requestAnimationFrame( function(){t.update();} );
}
