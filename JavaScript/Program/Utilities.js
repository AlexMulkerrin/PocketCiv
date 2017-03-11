// Utility functions used throughout the code base

// returns one element from the inputed array
function randomChoice(options) {
	var pick = randomInteger(options.length);
	return options[pick];
}
// produces output in corect format for html colour string
function randomRGBString() {
	var colourstring='#';
	for (var i=0; i<6; i++) {
	hexDigit = randomInteger(16);
	hexDigit = hexDigit.toString(16);
	colourstring += hexDigit;
	}
	return colourstring;
}
// wrapper function
function randomBool() {
	if (Math.random()>0.5) {
		return true;
	}
	return false;
}
// wrapper function over the inbuilt library random number generator, deals with integers only
function randomInteger(limit) {
	return Math.floor(Math.random()*limit);
}
// TODO description
function randomName() {
	var vowels = ['a','e','i','o','u'];
	var consonants= ['p','t','k','m','n'];
	var text="";
	var wordLength=randomInteger(6)+4;
	var letterType=randomInteger(2);
	for (var j=0; j<wordLength; j++) {
		if (letterType==0) {
			text +=randomChoice(consonants);
			letterType++;
		} else {
			text +=randomChoice(vowels);
			letterType=0;
		}
		if (j==0) text=text.toUpperCase();
	}
	return text;
}
// helper function to instantiate a 2D array with default value
function create2DArray(width, height, initialValue) {
	result = [];
	for (var i=0; i<width; i++) {
		result[i] = [];
		for (var j=0; j<height; j++) {
				result[i][j] = initialValue;
			}
		}
	return result;
}
// helper function to convert 8bit colour component values into an html colour string
function RGBString(red,green,blue) {
	var colourString='#';
	if (red<16) colourString+='0';
	colourString+=red.toString(16);
	if (green<16) colourString+='0';
	colourString+=green.toString(16);
	if (blue<16) colourString+='0';
	colourString+=blue.toString(16);
	return colourString;
}
// helper function to convert html colour string into 8bit rgb components
function colourComponents(colour) {
	var component=[], string;
	for (var i=0; i<3; i++) {
		// "#rrggbb"
		string = colour[1+i*2]+colour[2+i*2];
		component[i]=parseInt(string,16);
	}
	return {r:component[0], g:component[1], b:component[2]};
}
// helper function to calculate hue, saturation and luminosity from 8bit rgb components
function RGBtoHSL(red, green, blue) {
	var hue, sat, lum;
	red /= 255 , green /= 255, blue /= 255;
	var max = Math.max(red, green, blue);
	var min = Math.min(red, green, blue);
	lum = (max + min) / 2;
	
	if (max == min) { // monochrome
		hue = 0;
		sat = 0;
	} else {
		var delta = max - min;
		if (lum > 0.5) {
			sat = delta / (2 - (max + min));
		} else {
			sat = delta / (max + min);
		}
		switch (max) {
			case red:
				hue = (green - blue) / delta;
				if (green < blue) hue += 6;	
				break;
			case green:
				hue = ((blue - red) / delta) + 2;
				break;
			case blue:
				hue = ((red - green) / delta) + 4;
				break
		}
		 hue /= 6;
	}
	return {"hue":hue, "sat":sat, "lum":lum};
}