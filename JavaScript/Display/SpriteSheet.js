
const customHue = 300;

function SpriteSheet(inTileset, inPalette) {
	this.tileset = inTileset;
	this.palette = inPalette
	this.tempCanvas = document.createElement('canvas');
	this.output = document.createElement('canvas');
	this.createSpriteSheet();
}
SpriteSheet.prototype.createSpriteSheet = function() {
	var sqSize = 16;
	var spriteIndex = [4, 5, 6, 7, 11];
	this.output.width = sqSize * spriteIndex.length;
	this.output.height = sqSize * this.palette.length;
	var ctx = this.output.getContext("2d");
	
	this.tempCanvas.width = sqSize * spriteIndex.length;
	this.tempCanvas.height = sqSize;
	var tempCtx = this.tempCanvas.getContext("2d");
	// populate tempCanvas with sprites from tileset
	for (var i=0; i<spriteIndex.length; i++) {
		this.drawTile(i*sqSize,0,spriteIndex[i]);
	}
	// create set of sprites for each colour in palette
	for (var p=0; p<this.palette.length; p++) {
		var spriteset = tempCtx.getImageData(0, 0, this.tempCanvas.width, this.tempCanvas.height);
		var data = spriteset.data;
		var colour = colourComponents(this.palette[p]);
		
		for (var j=0; j<data.length; j += 4) { // iterate over rgba data values
			var oldRed = data[j];
			var oldGreen = data[j+1];
			var oldBlue = data[j+2];
			
			var hue = RGBtoHSL(oldRed, oldGreen, oldBlue).hue;
			if ( hue*360 == customHue) {
				var monochrome = ((oldRed + oldGreen + oldBlue)/3)*2; // double to brighten
				var red = (colour.r * monochrome) / 255;
				var green = (colour.g * monochrome) / 255;
				var blue = (colour.b * monochrome) / 255;
				data[j] = Math.floor(red);
				data[j+1] = Math.floor(green);
				data[j+2] = Math.floor(blue);
			}
		}
		ctx.putImageData(spriteset, 0, p*sqSize);
	}
	
}
// draw sprite from tileset onto tempCanvas
SpriteSheet.prototype.drawTile = function(x, y, index) {
	var sx = (index % 4)*17;
	var sy = Math.floor(index/4)*17;
	var tempCtx = this.tempCanvas.getContext("2d");
	tempCtx.drawImage(this.tileset, sx, sy, 16, 16, x, y, 16, 16);
}