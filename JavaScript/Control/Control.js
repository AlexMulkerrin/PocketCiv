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
				console.log("TODO command");
				break;

			case 87:
			case 38: // 'w' or up arrow
				console.log("TODO command");
				break;

			case 68:
			case 39: // 'd' or right arrow
				console.log("TODO command");
				break;

			case 83:
			case 40: // 's' or down arrow
				console.log("TODO command");
				break;

			case 66: // 'b' key
				console.log("TODO command");
				break;

			case 32: // spacebar
				console.log("TODO command");
				break;

			case 13: // enter key
				console.log("TODO command");
				break;

			case 82: // 'r' key
				console.log("TODO command");
				break;

			case 999: // 'p' key
				console.log("TODO command");
				break;

			case 27: // escape key
				console.log("TODO command");
				break;

			default:
				console.log("TODO command");
		}
	}
}
