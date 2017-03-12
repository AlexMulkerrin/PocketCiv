// TODO header commentary
const commandID = {	move:0, settle:1, skip:2, fortify:3,
					goto:4, cycle:5, disband:6, deselect:7};

function Control(inProgram) {
	this.targetProgram = inProgram;
	this.createKeyboardEventHandlers();
}
Control.prototype.createKeyboardEventHandlers = function() {
	var t = this;
	document.onkeydown = function(event) {
		var keyCode;
		if (event === null) {
			keyCode = window.event.keyCode;
		} else {
			keyCode = event.keyCode;
		}
		switch (keyCode) {
			case 65:
			case 37: // 'a' or left arrow
				console.log("TODO command: move left");
				t.sendMove(0, -1);
				break;

			case 87:
			case 38: // 'w' or up arrow
				console.log("TODO command: move up");
				t.sendMove(-1, 0);
				break;

			case 68:
			case 39: // 'd' or right arrow
				console.log("TODO command: move right");
				t.sendMove(0, 1);
				break;

			case 83:
			case 40: // 's' or down arrow
				console.log("TODO command: move down");
				t.sendMove(1, 0);
				break;

			case 66: // 'b' key
				console.log("TODO command: build city");
				t.sendSettle();
				break;

			case 32: // spacebar
				console.log("TODO command: wait");
				t.sendSkip();
				break;

			case 13: // enter key
				console.log("TODO command: end turn");
				break;

			case 82: // 'r' key
				console.log("TODO command: reset sim");
				t.resetSim();
				break;

			case 999: // 'p' key
				console.log("TODO command: toggle auto-end turn");
				break;

			case 67: // 'c' key
				console.log("TODO command: toggle debug mode");
				t.toggleDebugMode();
				break;

			case 27: // escape key
				console.log("TODO command: retire");
				t.retire();
				break;

			default:
				console.log("TODO command: no effect");
		}
	}
}
Control.prototype.sendMove = function(dx, dy) {
	this.targetProgram.simulation.currentPlayerInput = [commandID.move, dx, dy];
}
Control.prototype.sendSettle = function() {
	this.targetProgram.simulation.currentPlayerInput = [commandID.settle];
}
Control.prototype.sendSkip = function() {
	this.targetProgram.simulation.currentPlayerInput = [commandID.move, 0, 0];
}
Control.prototype.toggleDebugMode = function() {
	this.targetProgram.toggleDebugMode();
}
Control.prototype.resetSim = function() {
	this.targetProgram.createNewProgram();
}
Control.prototype.retire = function() {
	var sim = this.targetProgram.simulation;
	sim.faction[sim.playerFaction].isPlayerControlled = false
}
