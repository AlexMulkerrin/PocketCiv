function loadProgram() {
	var program = new Program();
	window.requestAnimationFrame( function(){program.update();});
}
function Program() {
	this.timer = 0;
}
Program.prototype.update = function() {
	this.timer++;
	console.log(this.timer);
	var t = this;
	window.requestAnimationFrame( function(){t.update();} );
}
