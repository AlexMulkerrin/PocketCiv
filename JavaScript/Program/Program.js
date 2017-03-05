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
	this.timer = 0;
}
// main update method, fires on every animation frame (60fps unless browser tab loses focus)
Program.prototype.update = function() {
	this.timer++;
	console.log(this.timer);
	var t = this;
	window.requestAnimationFrame( function(){t.update();} );
}
