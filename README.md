# PocketCiv
Minimal Civilsation-like game. Made a pathfinder and wanting to use it in a project :)

current status 28/2/2017:

Protoyping minimal gameplay loop without art assets.

Prototype is now playable! Have a gander here:
https://cdn.rawgit.com/AlexMulkerrin/PocketCiv/2697b1a69e7ad1ef5a094e4b20c7c8e80ebc68bb/Prototype.html

![What your empire will hopefully look like](https://github.com/AlexMulkerrin/PocketCiv/blob/master/Screenshots/turn%20100%20auspicious%20start.png)



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
