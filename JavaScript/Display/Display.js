// Display class, root of display module

//
const interfaceColours = {
	background:"#444444", text:"#ffffff", land:"#89A050",
	water:"#5897B7", unseen:"#000000"
};

// Class handles all rendering operations to screen
// Takes information from the following modules to display:
//	* Simulation
//	* Control
//
// Constructor takes Simulation module to reference it on refreshes
function Display(inSimulation) {
	this.targetSim = inSimulation;
	this.sqSize = 16;
	this.fontSize = 16;
	this.scale = 1;
	this.sidebarWidth = 160;

	this.tileset = new Image();
	// location from where index.html is, not the script file...
	this.tileset.src = "Resources/Images/Tileset0.png"

	this.canvas = document.getElementById("pocketCivCanvas");
	this.ctx = this.canvas.getContext("2d");
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
	this.sqSize = maxScale;

	this.refresh();
}
Display.prototype.refresh = function() {
	this.clearScreen();
	this.drawMainMap();
	this.drawBorders();
	this.drawFogOfWar();
	this.drawStructures();
	this.drawAgents();
	if (this.targetSim.isDebugMode) this.showDebugInfo();
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
	var x, y;
	var city = this.targetSim.city;
	for (var i=0; i<city.length; i++) {
		x = city[i].x;
		y = city[i].y;
		if (map.tile[x][y].state == visionID.seen) {
			this.drawTile(x*this.sqSize,y*this.sqSize, 5);
		}
	}
}
Display.prototype.drawBorders = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	for (var i=0; i<map.width; i++) {
		for (var j=0; j<map.height; j++) {
			if (map.tile[i][j].cityTerritory !== NONE) {
				var cityID = map.tile[i][j].cityTerritory;
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
					this.drawBorderEdge(x, y, 0);
					if (adj[2]) {
						this.drawBorderCorner(x, y, 0);
					}
					if (!adj[2]) {
						this.drawBorderEdge(x, y, 0, 1);
					}
					if (!adj[6]) {
						this.drawBorderEdge(x, y, 0, 4);
					}
				}
				if (adj[2]) {
					this.drawBorderEdge(x, y, 1);
					if (adj[4]) {
						this.drawBorderCorner(x, y, 1);
					}
					if (!adj[0]) {
						this.drawBorderEdge(x, y, 1, 1);
					}
					if (!adj[4]) {
						this.drawBorderEdge(x, y, 1, 2);
					}
				}
				if (adj[4]) {
					this.drawBorderEdge(x, y, 2);
					if (adj[6]) {
						this.drawBorderCorner(x, y, 2);
					}
					if (!adj[2]) {
						this.drawBorderEdge(x, y, 2, 2);
					}
					if (!adj[6]) {
						this.drawBorderEdge(x, y, 2, 3);
					}
				}
				if (adj[6]) {
					this.drawBorderEdge(x, y, 3);
					if (adj[0]) {
						this.drawBorderCorner(x, y, 3);
					}
					if (!adj[4]) {
						this.drawBorderEdge(x, y, 3, 3);
					}
					if (!adj[0]) {
						this.drawBorderEdge(x, y, 3, 4);
					}
				}

				// inner corners
				if (!adj[0] && adj[1] && !adj[2]) this.drawBorderCorner(x, y, 0, true);
				if (!adj[2] && adj[3] && !adj[4]) this.drawBorderCorner(x, y, 1, true);
				if (!adj[4] && adj[5] && !adj[6]) this.drawBorderCorner(x, y, 2, true);
				if (!adj[6] && adj[7] && !adj[0]) this.drawBorderCorner(x, y, 3, true);


			}
		}
	}
}
Display.prototype.drawAgents = function() {
	var map = this.targetSim.faction[this.targetSim.playerFaction].visionMap;
	var x, y, factionID;
	var agent = this.targetSim.agent;
	for (var i=0; i<agent.length; i++) {
		if (agent[i].isAlive) {
			x = agent[i].x;
			y = agent[i].y;
			if (map.tile[x][y].state == visionID.seen) {
				this.drawTile(x*this.sqSize,y*this.sqSize, 4);
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
					this.drawAdjacentFog(i, j, map);
				} else {
					this.ctx.fillRect( i*this.sqSize, j*this.sqSize, this.sqSize, this.sqSize);
				}
			}
		}
	}
	this.ctx.globalAlpha=1;
}
Display.prototype.drawAdjacentFog = function(x, y, visionMap) {
	var adj = [ [0,-1],[0,1], [-1,0], [1,0] ];
	for (var e=0; e<adj.length; e++) {
		var nx = x + adj[e][0];
		var ny = y + adj[e][1];
		if (visionMap.isInBounds(nx,ny) && visionMap.tile[nx][ny].state == visionID.unseen){
			if (e>1) {
				this.drawHalfTile(x*this.sqSize,y*this.sqSize, 15, e);
			} else {
				this.drawHalfTile(x*this.sqSize,y*this.sqSize, 14, e);
			}
		}
	}
}
Display.prototype.showDebugInfo = function() {
	var offsetX = this.targetSim.terrain.width*this.sqSize+5;
	this.ctx.fillStyle = interfaceColours.text;
	this.ctx.fillText("Generation: "+this.targetSim.generation, offsetX, this.fontSize);
	this.ctx.fillText("Window: "+this.canvas.width+" by "+this.canvas.height, offsetX, this.fontSize*2);
	this.ctx.fillText("SqSize: "+this.sqSize, offsetX, this.fontSize*3);

	for (var i=0; i<this.targetSim.terrain.regionDetails.length; i++) {
		var output = this.targetSim.terrain.regionDetails[i].name;
		//output += "size: " + this.targetSim.terrain.islandStats[i];
		output += " " + this.targetSim.terrain.regionDetails[i].sizeClass;
		output += " (" + this.targetSim.terrain.regionDetails[i].size+")";
		this.ctx.fillText(output,offsetX,this.fontSize*(i+4));
	}
	this.ctx.drawImage(this.tileset,offsetX,this.canvas.height-this.tileset.height);
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
Display.prototype.drawBorderEdge = function(x, y, edgeID, isCornerEdge) {
	var edgePos = [[4,0], [12,4], [4,12], [0,4]];
	var cornerPos = [[12,0], [12,12], [0,12], [0,0]];
	var edgeDim = [[8,4], [4,8], [8,4], [4,8]];
	var index = 11;
	var sx = (index % 4)*17 + edgePos[edgeID][0];
	var sy = Math.floor(index/4)*17 + edgePos[edgeID][1];

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
	this.ctx.drawImage(this.tileset, sx, sy, dx, dy, qx, qy, dx*this.scale, dy*this.scale);
}
Display.prototype.drawBorderCorner = function(x, y, cornerID, isInner) {
	var cornerPos = [[12,0], [12,12], [0,12], [0,0]];
	var innerCornerPos = [[4,8], [4,4], [8,4], [8,8]];
	var index = 11;
	var sx, sy;
	if (isInner) {
		sx = (index % 4)*17 + innerCornerPos[cornerID][0];
		sy = Math.floor(index/4)*17 + innerCornerPos[cornerID][1];
	} else {
		sx = (index % 4)*17 + cornerPos[cornerID][0];
		sy = Math.floor(index/4)*17 + cornerPos[cornerID][1];
	}
	var qx = x + cornerPos[cornerID][0];
	var qy = y + cornerPos[cornerID][1];
	this.ctx.drawImage(this.tileset, sx, sy, 4, 4, qx, qy, 4*this.scale, 4*this.scale);
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
