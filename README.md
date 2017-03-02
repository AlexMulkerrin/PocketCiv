# PocketCiv
Minimal Civilisation-like game. Made a pathfinder and wanting to use it in a project :)

current status 2/3/2017:

Protoyping minimal gameplay loop without art assets.

Prototype is now playable! Have a gander here:
https://cdn.rawgit.com/AlexMulkerrin/PocketCiv/2697b1a69e7ad1ef5a094e4b20c7c8e80ebc68bb/Prototype.html


## Controls
* wasd/arrow keys to move selected unit
* spacebar to skip turn
* 'B' to settle city *note* area around the unit must be explored to 2 tiles distance and there must be >14 land tiles (look for tiles with green or dark green terrain)

* Escape key to abdicate, leaving an AI leader in charge of your empire
* 'R' key to reset game with a new civilisation and world map

## Example Screenshot
![What your empire will hopefully look like](https://github.com/AlexMulkerrin/PocketCiv/blob/master/Screenshots/turn%20100%20auspicious%20start.png)
A healthy empire of 4 cities on turn 100. Another faction has been encountered in the east!


## [DRAFT] Project repository layout:
Currently in prototype phase (all in one file right now :P ) so this layout hasn't been implemented yet. Pretty clear idea how I'm going to organise the source code though

## /JavaScript/ subdirectories
*	Program/
 - main entrypoint
 - file handling
 - image loader
 - music loader
 - utilities
 
*	Simulation/
 - terrain
 - terrain generator
 - faction
 - unit
 - pathfinder
 
* Display/
 - renderer
 - minimap
 - interface

* Controls/
 - mouse
 - keyboard

* Audio/
 - sound engine
 - music player

## Other directories
* /Resources/
 - images
 - sounds
 - music	

*	/Ruleset/
 - unit types
 - scenarios
 - fixed maps

*	/Screenshots/

## Top level files
* README.md
* Design document
* index.html
* prototype.html
