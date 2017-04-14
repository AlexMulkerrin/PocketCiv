// Display class, root of display module

//
const interfaceColours = {
	background:"#444444", text:"#ffffff", land:"#267F00",
	water:"#1A2EC9", unseen:"#000000", highlight:"#00ff00",
	minimap:"#222222"
};

const tilesetNames = ["Tileset0", "Tileset1"]

// Class handles all rendering operations to screen
// Takes information from the following modules to display:
//	* Simulation
//	* Control
//
// Constructor takes Simulation module to reference it on refreshes
function Display(inSimulation, inControl) {
	this.targetSim = inSimulation;
	this.targetControl = inControl;
	this.frame = 0;
	this.lastSimGen = 0;

	this.sqSize = 16;
	this.fontSize = 16;
	this.scale = 1;
	this.sidebarWidth = 240;

	this.spriteSheet = {};
	this.tilesetID = 0;
	this.tileset = new Image();
	this.tileset.crossOrigin = "Anonymous";
	// location relative to where index.html is, not the script file...
	this.tileset.src = "Resources/Images/"+tilesetNames[this.tilesetID]+".png";
	var t = this;
	this.tileset.onload = function() {
		t.spriteSheet = new SpriteSheet(t.tileset, factionColours);
		t.tileset.isLoaded = true;
		t.refresh();
	}

	this.canvas = document.getElementById("pocketCivCanvas");
	this.ctx = this.canvas.getContext("2d");

	this.sidebar = new Sidebar(this.targetSim, this.targetControl);

	this.resizeCanvas();

	var t = this;
	window.onresize = function(){t.resizeCanvas();};
}
Display.prototype.resizeCanvas = function() {
	this.canvas.width = window.innerWidth;
	this.canvas.height = window.innerHeight;
	this.ctx.font = "bold "+this.fontSize+"px Arial";

	var widthScale = (this.canvas.width- this.sidebarWidth)/this.targetSim.terrain.width ;
	var heightScale = this.canvas.height/this.targetSim.terrain.height;
	maxScale = Math.floor(Math.min(widthScale, heightScale));
	this.sqSize = 16;//maxScale;

	this.sidebar.resizeSidebar();

	if (this.tileset.isLoaded) {
		this.refresh();
	} else {
		this.clearScreen();
	}
}
Display.prototype.switchTileset = function() {
	this.tilesetID = (this.tilesetID+1) % tilesetNames.length;
	this.tileset = new Image();
	this.tileset.crossOrigin = "Anonymous";
	// location relative to where index.html is, not the script file...
	this.tileset.src = "Resources/Images/"+tilesetNames[this.tilesetID]+".png";
	var t = this;
	this.tileset.onload = function() {
		t.spriteSheet = new SpriteSheet(t.tileset, factionColours);
		t.tileset.isLoaded = true;
		t.refresh();
	}
}

Display.prototype.refresh = function() {
	if (this.lastSimGen !== this.targetSim.generation) this.frame = 0;
	this.clearScreen();
	this.drawMainMap();
	this.drawBorders();
	this.drawFogOfWar();
	this.drawStructures();
	this.drawAgents();
	this.drawCityDetails();
	this.drawCurrentAgentHighlight();
	//update sidebar contents
	this.sidebar.refreshUserInterface();
	this.ctx.drawImage(this.sidebar.output, this.canvas.width - this.sidebar.width, 0)
	//this.drawUserInterface();
	//this.drawMinimap();
	//if (this.targetSim.isDebugMode) this.showDebugInfo();
	this.frame++;
	this.lastSimGen = this.targetSim.generation;
}
Display.prototype.clearScreen = function() {
	this.ctx.fillStyle = interfaceColours.background;
	this.ctx.fillRect(0,0,this.canvas.width, this.canvas.height);
}
Display.prototype.drawMainMap = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	if (this.targetSim.isDebugMode) {
		map = this.targetSim.terrain;
	}
	this.ctx.fillStyle = interfaceColours.unseen;
	this.ctx.fillRect(0,0,map.width*this.sqSize, map.height*this.sqSize);

	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			if (map.tile[i][j].type == terrainID.grass) {
				switch (map.tile[i][j].desirability) {
					case ratingID.perfect:
						this.drawTile(i*this.sqSize,j*this.sqSize, 3);
						break;

					case ratingID.good:
						this.drawTile(i*this.sqSize,j*this.sqSize, 2);
						break;

					case ratingID.poor:
					default:
						this.drawTile(i*this.sqSize,j*this.sqSize, 1);
						break;
				}
			} else if (map.tile[i][j].type == terrainID.water) {
				if (map.tile[i][j].isCoast) {
					this.drawCoastTile(i*this.sqSize,j*this.sqSize, map.tile[i][j]);
				} else {
					this.drawTile(i*this.sqSize,j*this.sqSize, 0);
				}
			}

		}
	}
}
Display.prototype.drawStructures = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var x, y, paletteID;
	var city = this.targetSim.city;
	for (var i=0; i<city.length; i++) {
		x = city[i].x;
		y = city[i].y;
		paletteID = city[i].faction.paletteID;
		if (map.tile[x][y].state == visionID.seen || this.targetSim.isDebugMode) {
			this.drawSprite(x*this.sqSize,y*this.sqSize, 1, paletteID);
		}
	}
}
Display.prototype.drawBorders = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	if (this.targetSim.isDebugMode) {
		map = this.targetSim.terrain;
	}
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			if (map.tile[i][j].cityTerritory !== NONE) {
				var cityID = map.tile[i][j].cityTerritory;
				var paletteID = this.targetSim.terrain.tile[i][j].cityTerritory.faction.paletteID;
				var adjMatrix = clockwiseAdjMatrix;
				var adj = []
				for (var e=0; e<adjMatrix.length; e++) {
					nx = i + adjMatrix[e][0];
					ny = j + adjMatrix[e][1];
					if (map.isInBounds(nx, ny) && map.tile[nx][ny].cityTerritory != cityID) {
						adj[e]= true;
					} else {
						adj[e] = false;
					}
				}
				// check cases to display subtiles
				var x = i*this.sqSize;
				var y = j*this.sqSize;
				// middle edges
				if (adj[0]) {
					this.drawBorderEdge(x, y, 0, paletteID);
					if (adj[2]) {
						this.drawBorderCorner(x, y, 0, paletteID);
					}
					if (!adj[2]) {
						this.drawBorderEdge(x, y, 0, paletteID, 1);
					}
					if (!adj[6]) {
						this.drawBorderEdge(x, y, 0, paletteID, 4);
					}
				}
				if (adj[2]) {
					this.drawBorderEdge(x, y, 1, paletteID);
					if (adj[4]) {
						this.drawBorderCorner(x, y, 1, paletteID);
					}
					if (!adj[0]) {
						this.drawBorderEdge(x, y, 1, paletteID, 1);
					}
					if (!adj[4]) {
						this.drawBorderEdge(x, y, 1, paletteID, 2);
					}
				}
				if (adj[4]) {
					this.drawBorderEdge(x, y, 2, paletteID);
					if (adj[6]) {
						this.drawBorderCorner(x, y, 2, paletteID);
					}
					if (!adj[2]) {
						this.drawBorderEdge(x, y, 2, paletteID, 2);
					}
					if (!adj[6]) {
						this.drawBorderEdge(x, y, 2, paletteID, 3);
					}
				}
				if (adj[6]) {
					this.drawBorderEdge(x, y, 3, paletteID);
					if (adj[0]) {
						this.drawBorderCorner(x, y, 3, paletteID);
					}
					if (!adj[4]) {
						this.drawBorderEdge(x, y, 3, paletteID, 3);
					}
					if (!adj[0]) {
						this.drawBorderEdge(x, y, 3, paletteID, 4);
					}
				}

				// inner corners
				if (!adj[0] && adj[1] && !adj[2]) this.drawBorderCorner(x, y, 0, paletteID, true);
				if (!adj[2] && adj[3] && !adj[4]) this.drawBorderCorner(x, y, 1, paletteID, true);
				if (!adj[4] && adj[5] && !adj[6]) this.drawBorderCorner(x, y, 2, paletteID, true);
				if (!adj[6] && adj[7] && !adj[0]) this.drawBorderCorner(x, y, 3, paletteID, true);


			}
		}
	}
}
Display.prototype.drawAgents = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var x, y, paletteID;
	var agent = this.targetSim.agent;
	for (var i=0; i<agent.length; i++) {
		if (agent[i].isAlive) {
			x = agent[i].x;
			y = agent[i].y;
			paletteID = agent[i].faction.paletteID;
			if ((map.tile[x][y].state == visionID.seen && map.tile[x][y].lastSeen >= this.targetSim.generation)
				|| this.targetSim.isDebugMode) {
				this.drawSprite(x*this.sqSize,y*this.sqSize, 0, paletteID);
			}
		}
	}
}
Display.prototype.drawFogOfWar = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	// totally unknown
	if (this.targetSim.isDebugMode == false) {
		for (var i=0; i<map.width; i++) {
			for (var j=0; j<map.height; j++) {
				if (map.tile[i][j].state == visionID.seen) {
					this.drawAdjacentFog(i, j, map);
				}
			}
		}
	}
	// previously seen
	this.ctx.globalAlpha=0.5;
	this.ctx.fillStyle = interfaceColours.unseen;
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			if (map.tile[i][j].state == visionID.seen
				|| this.targetSim.isDebugMode) {
				if (map.tile[i][j].lastSeen >= this.targetSim.generation) {
					this.drawAdjacentFog(i, j, map, true);
				} else {
					this.ctx.fillRect( i*this.sqSize, j*this.sqSize, this.sqSize, this.sqSize);
				}
			}
		}
	}
	this.ctx.globalAlpha=1;
}
Display.prototype.drawAdjacentFog = function(x, y, visionMap, isFogofWar) {
	var adj = [ [0,-1],[0,1], [-1,0], [1,0] ];
	for (var e=0; e<adj.length; e++) {
		var nx = x + adj[e][0];
		var ny = y + adj[e][1];
		if (visionMap.isInBounds(nx,ny) ) {
			 if (visionMap.tile[nx][ny].state == visionID.unseen
			 	|| (visionMap.tile[nx][ny].lastSeen < this.targetSim.generation && isFogofWar) ) {
				if (e>1) {
					this.drawHalfTile(x*this.sqSize,y*this.sqSize, 15, e);
				} else {
					this.drawHalfTile(x*this.sqSize,y*this.sqSize, 14, e);
				}
			}
		}
	}
}
Display.prototype.drawCityDetails = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var x, y;
	var fontSize = 2*this.fontSize/3;
	this.ctx.font = "bold "+fontSize+"px Arial";
	var city = this.targetSim.city;
	for (var i=0; i<city.length; i++) {
		x = city[i].x;
		y = city[i].y;
		if (map.tile[x][y].state == visionID.seen || this.targetSim.isDebugMode) {

			var output = city[i].name + " (" + city[i].timeToBuild + ")";
			// drop shadow :P
			this.ctx.fillStyle = interfaceColours.unseen;
			this.ctx.fillText(output, x*this.sqSize-(output.length/5)*fontSize+1, y*this.sqSize+fontSize*3+2);
			this.ctx.fillStyle = interfaceColours.text;
			this.ctx.fillText(output, x*this.sqSize-(output.length/5)*fontSize, y*this.sqSize+fontSize*3);
		}
	}
	this.ctx.font = "bold "+this.fontSize+"px Arial";
}
Display.prototype.drawCurrentAgentHighlight = function() {
	var sim = this.targetSim;
	if (sim.faction[sim.currentFaction].isPlayerControlled && sim.currentAgent<sim.agent.length) {
		var agent = this.targetSim.agent[this.targetSim.currentAgent];
		if (agent.faction.id == sim.playerFaction) {
			var sqSize = this.sqSize;
			this.ctx.fillStyle = interfaceColours.text;
			if (this.frame % 40 < 20) this.ctx.fillStyle = "#00ff00";
			this.ctx.fillRect(agent.x*sqSize, agent.y*sqSize, 1, sqSize);
			this.ctx.fillRect(agent.x*sqSize, agent.y*sqSize, sqSize, 1);
			this.ctx.fillRect(agent.x*sqSize+sqSize-1, agent.y*sqSize, 1, sqSize);
			this.ctx.fillRect(agent.x*sqSize, agent.y*sqSize+sqSize-1, sqSize, 1);
		}
	}
}
// sprites :D
Display.prototype.drawSprite = function(x,y, spriteID, paletteID) {
	var sx = spriteID*16;
	var sy = paletteID*16;
	this.ctx.drawImage(this.spriteSheet.output, sx, sy, 16, 16, x, y, 16*this.scale, 16*this.scale);
}
Display.prototype.drawBorderEdge = function(x, y, edgeID, paletteID, isCornerEdge) {
	var edgePos = [[4,0], [12,4], [4,12], [0,4]];
	var cornerPos = [[12,0], [12,12], [0,12], [0,0]];
	var edgeDim = [[8,4], [4,8], [8,4], [4,8]];
	var index = 4;
	var sx = index*16 + edgePos[edgeID][0];
	var sy = paletteID*16 + edgePos[edgeID][1];

	var qx, qy;
	var dx, dy;
	if (isCornerEdge>0) {
		qx = x + cornerPos[isCornerEdge-1][0];
		qy = y + cornerPos[isCornerEdge-1][1];
		dx = 4;
		dy = 4;
	} else {
		qx = x + edgePos[edgeID][0];
		qy = y + edgePos[edgeID][1];
		dx = edgeDim[edgeID][0];
		dy = edgeDim[edgeID][1];
	}
	this.ctx.drawImage(this.spriteSheet.output, sx, sy, dx, dy, qx, qy, dx*this.scale, dy*this.scale);
}
Display.prototype.drawBorderCorner = function(x, y, cornerID, paletteID, isInner) {
	var cornerPos = [[12,0], [12,12], [0,12], [0,0]];
	var innerCornerPos = [[4,8], [4,4], [8,4], [8,8]];
	var index = 4;
	var sx, sy;
	if (isInner) {
		sx = index*16 + innerCornerPos[cornerID][0];
		sy = paletteID*16 + innerCornerPos[cornerID][1];
	} else {
		sx = index*16 + cornerPos[cornerID][0];
		sy = paletteID*16 + cornerPos[cornerID][1];
	}
	var qx = x + cornerPos[cornerID][0];
	var qy = y + cornerPos[cornerID][1];
	this.ctx.drawImage(this.spriteSheet.output, sx, sy, 4, 4, qx, qy, 4*this.scale, 4*this.scale);
}
// tile manipulation
Display.prototype.drawCoastTile = function(x, y, tile) {
	var index = 19;
	var adjIndexes = [ [0,1,2], [4,3,2], [4,5,6], [0,7,6] ];

	// use names for the tileset indicies
	var tileName = {none:0, endHoriz:12, endVert:13, sideHoriz:16, sideVert:17, full:18, corner:19, strait:21};
	var tileChoices = [	tileName.none, tileName.endHoriz, tileName.corner,
						tileName.sideHoriz, tileName.endVert , tileName.strait,
						tileName.sideVert, tileName.full
					];

	for (var e=0; e<adjIndexes.length; e++) {
		var choiceIndex = 0;
		var hasAdjVert = tile.adjacentCoast[adjIndexes[e][0]];
		var hasAdjCorner = tile.adjacentCoast[adjIndexes[e][1]];
		var hasAdjHoriz = tile.adjacentCoast[adjIndexes[e][2]];

		if (hasAdjVert) choiceIndex += 1;
		if (hasAdjCorner) choiceIndex += 2;
		if (hasAdjHoriz) choiceIndex += 4;

		index = tileChoices[choiceIndex];
		this.drawQuarterTile(x, y, index, e);
	}
}
Display.prototype.drawQuarterTile = function(x, y, index, quarterID) {
	var quarterPos = [ [8,0], [8,8], [0,8], [0,0] ];
	var sx = (index % 4)*17 + quarterPos[quarterID][0];
	var sy = Math.floor(index/4)*17 + quarterPos[quarterID][1];
	var qx = x + quarterPos[quarterID][0];
	var qy = y + quarterPos[quarterID][1];
	this.ctx.drawImage(this.tileset, sx, sy, 8, 8, qx, qy, 8*this.scale, 8*this.scale);
}
Display.prototype.drawHalfTile = function(x, y, index, halfID) {
	var halfPos = [ [0,0], [0,8], [0,0], [8,0] ];
	var sx = (index % 4)*17 + halfPos[halfID][0];
	var sy = Math.floor(index/4)*17 + halfPos[halfID][1];
	var qx = x + halfPos[halfID][0];
	var qy = y + halfPos[halfID][1];
	if (halfID>1) {
		this.ctx.drawImage(this.tileset, sx, sy, 8, 16, qx, qy, 8*this.scale, 16*this.scale);
	} else {
		this.ctx.drawImage(this.tileset, sx, sy, 16, 8, qx, qy, 16*this.scale, 8*this.scale);
	}
}
Display.prototype.drawTile = function(x, y, index) {
	var sx = (index % 4)*17;
	var sy = Math.floor(index/4)*17;
	this.ctx.drawImage(this.tileset, sx, sy, 16, 16, x, y, 16*this.scale, 16*this.scale);
}
