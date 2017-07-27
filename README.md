# PocketCiv
Minimal Civilisation-like game. Made a pathfinder and wanting to use it in a project :)

## Update Log
current status 27/07/2017:
- first commits in a long time, been doing some improvements to the interface to get back into coding on this project. Lots of new parts to the interface including buttons, zoom levels and auto-focus. Game should work on any size of browser window now :)

- 14/4/2017 Finally a chance to do some more work on this! I've tweaked the sidebar and added the beginnings of a minimap. Excited to have some free time to spend on this again :D

- 12/3/2017 New code base structure is up! Code migration from prototype is 99% complete and the game has classic Civ Tilesets :D Latest version can be accessed in the link below update log

- 6/3/2017 Been working on documentation and new code base structure, also blog posting about improved art :D 
http://tangentialtopics.blogspot.com/2017/03/pocketciv-prototype.html
 
- 2/3/2017: Prototype is now playable! Have a gander here:
https://cdn.rawgit.com/AlexMulkerrin/PocketCiv/2697b1a69e7ad1ef5a094e4b20c7c8e80ebc68bb/Prototype.html
- 13/2/2017: Protoyping minimal gameplay loop without art assets.

## Link to in Development Version (0.0.99... version 0.1 soon, promise!)
This *might* be crawling with bugs or totally unusable, you have been warned!
https://cdn.rawgit.com/AlexMulkerrin/PocketCiv/6150cd83637dbf30ad2e68f6d928774f1739cb02/index.html

## Controls
* wasd/arrow keys to move selected unit
* spacebar to skip turn
* '**B**' to settle city *note* sidebar will track the quality rating of the terrain tile the selected unit is currently on. When the tile is suitable there is a green prompt :)

* Escape key to abdicate, leaving an AI leader in charge of your empire
* '**+,-**' keys to change zoom level/how big each pixel of sprites will appear.
* '**R**' key to reset game with a new civilisation and world map
* '**C**' key to ??? (debug/cheats)
* '**P**' key to toggle pause (good for AI only games or when turn limit is reached)

## Example Screenshot
![What your empire will hopefully look like](https://github.com/AlexMulkerrin/PocketCiv/blob/master/Screenshots/example%20100%20turns.png)
Turn 100 and the **Utatap** tribe have conquered almost half of the **Memono** sub-continent.


## Project repository layout
Still working on this, not all files/directories present at the moment...

## /JavaScript/ subdirectories
* Program/
  - Program.js main entrypoint
  - Utilities.js used throughout codebase
  - file handling TODO
  - image loader TODO
  - music loader TODO
 
* Simulation/
  - Simulation.js overarching simulation logic
  - Terrain.js handles terrain generation too
  - Tile.js individual terrain tile
  - RegionDetails.js information on landmasses
  - Faction.js has ownership of faction agents and structure
  - VisionMap.js per faction knowledge of the world
  - Agent.js mobile unit in the world
  - Structure.js static unit in the world
 
* Display/
  - Display.js main module for output to screen
  - SpriteSheet.js generates unit sprites from faction colours
  - Sidebar.js gives the player heaps of info along with minimap and buttons
  - renderer TODO
  - minimap TODO
  - interface  TODO

* Control/
  - Control.js handles player input to program
  - Mouse.js handles user mouse controls
  - Button.js class for all onscreen buttons
  - View.js state of the main view screen
  - keyboard TODO

* Audio/ **TODO**
  - sound engine 
  - music player 

## Other directories
* /Resources/
  - Images holds tilesets in various levels of completion
  - sounds TODO
  - music TODO

* /Ruleset/ **TODO**
  - unit types
  - scenarios
  - fixed maps

* /Screenshots/
  - Whole lotta screenshots of development progress, put in directories per version?

## Top level files
* README.md
* Design document
* index.html
* prototype.html
