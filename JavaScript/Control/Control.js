// TODO header commentary
const commandID = {	move:0, settle:1, skip:2, fortify:3,
					goto:4, cycle:5, disband:6, deselect:7};

function Control(inProgram) {
	this.targetProgram = inProgram;
	this.createKeyboardEventHandlers();

	this.mouse = new Mouse(this);
	this.buttons = [];
	this.createButtons();
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
			//	console.log("TODO command: move left");
				t.sendMove(-1, 0);
				break;

			case 87:
			case 38: // 'w' or up arrow
			//	console.log("TODO command: move up");
				t.sendMove(0, -1);
				break;

			case 68:
			case 39: // 'd' or right arrow
			//	console.log("TODO command: move right");
				t.sendMove(1, 0);
				break;

			case 83:
			case 40: // 's' or down arrow
			//	console.log("TODO command: move down");
				t.sendMove(0, 1);
				break;

			case 66: // 'b' key
			//	console.log("TODO command: build city");
				t.sendSettle();
				break;

			case 32: // spacebar
			//	console.log("TODO command: wait");
				t.sendSkip();
				break;

			case 13: // enter key
				console.log("TODO command: end turn");
				break;

			case 82: // 'r' key
			//	console.log("TODO command: reset sim");
				t.resetSim();
				break;

			case 79: // 'o' key
				console.log("TODO command: switch tileset");
				t.switchTileset();
				break;

			case 80: // 'p' key
			//	console.log("TODO command: toggle auto-end turn");
				t.toggleAutoEndTurn();
				break;

			case 67: // 'c' key
			//	console.log("TODO command: toggle debug mode");
				t.toggleDebugMode();
				break;

			case 27: // escape key
			//	console.log("TODO command: retire");
				t.retire();
				break;

			default:
				console.log("TODO command: no effect");
		}
	}
}

Control.prototype.createButtons = function() {
	var w = window.innerWidth;
	var h = window.innerHeight;
	// Button(x, y, width, height, icon, hotkey, func, funcArgs)
	this.buttons.push( new Button(w-64, h-64, 64, 64, null, "B", "sendSettle"));
	this.buttons.push( new Button(w-32, h-104, 32, 32, null, "F", "notImplemented"));
	this.buttons.push( new Button(w-32, h-232, 32, 32, null, "Spacebar", "sendSkip"));

	this.buttons.push( new Button(w-160, h-104, 32, 32, null, "G", "notImplemented"));
	this.buttons.push( new Button(w-144, h-48, 64, 32, null, "Tab", "notImplemented"));
	this.buttons.push( new Button(w-160, h-232, 32, 32, null, "Delete", "notImplemented"));
}

// commands
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
Control.prototype.switchTileset = function() {
	this.targetProgram.display.switchTileset();
}
Control.prototype.resetSim = function() {
	this.targetProgram.createNewProgram();
}
Control.prototype.toggleAutoEndTurn = function() {
	this.targetProgram.simulation.isRunning = !this.targetProgram.simulation.isRunning;
}
Control.prototype.retire = function() {
	var sim = this.targetProgram.simulation;
	sim.faction[sim.playerFaction].isPlayerControlled = false
}
Control.prototype.notImplemented = function() {
	console.log("TODO command: no effect");
}
