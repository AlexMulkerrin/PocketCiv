# Technical Supplement (is this the readme?)
Repository Contents
Required device capabilities:
* Modern Browser eg. Google Chrome or Firefox of the latest editions.
Tested on IE##, Edge, Safari and Opera. No guarantee of complete compatibility on them or any other browser and/or versions.
* Controlled by any combination of mouse, keyboard and touch screen. Playable with any single one of the above input methods. No, there is not VR support.
* Can Display in browser window ranging from 320*200 to 1920*1080 and above. Adaptive screen layout feature and UI scaling, both of which can be toggled and changed in options menu.
* Storage of option settings and autosaves is done with browser cookie cache. Warning! these will not be preserved between different machines or browsers! Option to save and load games locally to plain text format. Includes inbuilt screenshot savefile format for easy sharing of games. Custom faction details and tilesets can be loaded from local machine (or from URL? :o )
* Important, PocketCiv can be played either from hosted github source or from a local download of the repository. Latter requires browser that allows loading of local resource files. To host multiplayer games will require a server hosting solution eg. XAMPP, apache, nginx and configured ports (node.js?) Possibility of local program to act as server/client independent of web browser...

PocketCiv requires no copyright license agreement. You are free to download and tweak the bits and bytes to your hearts content. < license to share but not take credit for and sell unaltered >

Reference chart for terrain in default tilesets:
Ocean: blue seas :)
Barren Land: desert/arctic/alpine/jungle(?) terrain
Fertile Land: everything else

Features:
Sea Ice: blocks sea movement at poles? (have be land?)
Hills: defense boost
Mountains: high defense boost, not fertile
Grassland: indicates medium quality city locations
Forest: indicates naturally good city locations
River: gives movement bonus like roads

Improvements:
City: most important objects in an empire
Road: connect cities and gives units moving on them a 3x movement bonus
Exploitation: mine/irrigation. gives rough idea of how much production city is using on support
Borders: encircle city's territories, fix at moment of settling (perhaps start small?) will flip to faction owning the city they belong to.
Sea route: abstract indicator showing inter-island connections. Can be disrupted by blockading an endpoint harbour.

Units:
army: restricted to land tiles, movement of 1 tile a turn, has 50% combat odds. Needs supply line or will be in danger of attrition effects. 5 supply upkeep. Sees 1 tile over land, 2 tiles across coastal waters. Options to settle new city or fortify in defense of location. Can embark. Will be routed if defeated in a stack of units outside of a city with defenses.
navy: formed when army embarks from coastal city. Has improved movement rate over ocean tiles (3 move per turn) has vision range of 2 over ocean but only 1 onto land. If moved onto land disembarks and returns to army form, ending it's movement. Double upkeep of 10 supply. Supplied through coastal cities across ocean. Vulnerable in stacks similar to land units. Half combat strength (25%) if attacking a land tile. Can pass into a friendly city tile without disembarking (Panama canal anyone?) land units suffer half combat strength if they attempt to engage a coastal fleet (25%) but the situation is reversed if the ships are inside a coastal city (at port) Lack of supply causes chance of attrition similar to land armies.

# Introduction
* Introduction
* Cities and Civilisations
* Before you start
* Interface Introduction
* Pre-Game Options
Extra Difficulty modes:
Settler is freeform sandbox with cheats enabled
Deity is unreasonably hard!

* The Game Turn
* Ending the Game and Winning

# The World
* The World Map
* The Map Display
Have science indicator denote population progress to next era:
Ancient, Classical, Medieval, Renaissance, Industrial, Atomic, Information.
Symbol of current era plus radial progress bar with approx time.
Increments by number of cities per turn. (global science level too? gives 50% bonus perhaps...) Of course science is purely aesthetic in this :P
* Settlers Soldiers and Diplomats

* Governments
Civil war due to having two large, poorly interconnected territories. Choose which side to back :D
* Advisors/World Reports
top five cities: city territory quality, advancement level and number of city connections.
* Civilopedia
* Planetary Caretaking
climate change possible once 50% of land area is worked globally :o modifier due to technological level too: A1, C1, M1.2, R1.5, I2.5, N2, T1.5, F?0.5
* Diplomacy
* The Space Race
Offworld colony? :3

#Cities
* Cities
Have single city/unit faction act like minor tribes: on first seeing an adjacent unit they may be swayed to join that Civilisation. One off chance on first contact. higher tech level increases this chance.

* The City Display
* City Improvements
Auto constructed at the same time as an army is mustered.
City defenses: constructed over 10 turns so long as city is not in worst production category. Gives defending vaue to city on it's own and shelters stacks of units inside. When a city with defenses is captured it takes 5 turns to rebuild them. a city in revolt loses the effect of it's defenses.
Road and sea trade network. Automatically placed when city is founded. Will connect to any adjacent cities, including those of other factions. Warning a city without an adjacent city of the same faction will be vulnerable to unrest and if only adjacent neighbour is a foreign power can potentially flip allegiances!
Harbour: automatically created for coastal city. Allows embarkation onto ocean from city tile. ocean trade routes pass through these harbours from other coastal cities of the same faction on different land masses. Can be blockaded, stopping the connection.
Connections promote tech growth, inter faction ones especially.

* Wonders of The World
No. Only wonderlike things are records of the top 5 cities and per-game achievements like longest road, best defended, biggest army support.

* Disasters
Mostly caused by lack of supply lines to cities or units. Can cause revolts, desertion, mutiny, faction flipping and piracy D: (Effect depends on specific combination of factors on affected unit/city)

# The Dynamics of PocketCiv
* Introduction
* The Advance of Knowledge

# Additional Notes
* Leaders
Loaded from JSON ruleset, can create new ones with XYZ attributes. Also option for procedural ones.
* Player's Notes
* Designer's Notes
* Further Reading, and Playing :)

Lol, have tech tree at end which is just:
Ancient -> Classical -> Medieval -> Renaissance -> Industrial -> Atomic -> Information -> Future Tech?
Future tech is only a thing you would reach round about when the game is over :P