// Galapagos Visualizer Plugin
// Requires the visualizer core to work
Visualizer.plugins["Galapagos"] = new Object();
var plugin = Visualizer.plugins["Galapagos"];
		
plugin.name = "Galapagos";

// Renderables for our main game objects
plugin.renderableCreatures;
plugin.renderablePlants;

plugin.initialize = function(gamelog, renderer) {
	// initialize stuff here, good ideas:
	// * set the dimensions of the renderer (map width and height)
	// * add the layers you'll want in the renderer, in order
	// * initialize your data structures

	// setup the dimensions of the renderer to be 8 x 8
	renderer.setDimensions(gamelog.turns[0].mapWidth, gamelog.turns[0].mapHeight);

	// give us 2 layers, the background and units layer
	renderer.addLayer("background");
	renderer.addLayer("units");
}

plugin.parse = function(gamelog) {
	// here you will want to iterate through the gamelog and build data structures by parsing the gamelog
	// initialize the renderables for creatures with the template of the first creature we find
	plugin.renderableCreatures = new Renderables(gamelog.turns[0].Creatures[0]);
	plugin.renderablePlants = new Renderables(gamelog.turns[0].Plants[0]);

	// for each turn in the gamelog
	for(var i in gamelog.turns) {
		var turn = gamelog.turns[i];

		// for each creature in the current turn
		for(var j in turn.Creatures) {
			var creature = turn.Creatures[j];

			var sawMoveAnimation = false;
			for(var a in turn.animations) {
				var animation = turn.animations[a];

				if(animation.type == "move" && animation.actingID == creature.id) {
					if( !sawMoveAnimation ) {
						plugin.renderableCreatures.addTurn(creature.id, turn.turnNumber, {
							x: animation.fromX,
							y: animation.fromY
						});
					}

					plugin.renderableCreatures.addTurn(creature.id, turn.turnNumber, {
						x: animation.toX,
						y: animation.toY
					});

					sawMoveAnimation = true;
				}
			}

			if(sawMoveAnimation) {
				delete creature.x;
				delete creature.y;
			}
			plugin.renderableCreatures.addTurn(creature.id, turn.turnNumber, creature);
		}

		// for each plant in the turn
		for(var p in turn.Plants) {
			var plant = turn.Plants[p];

			plugin.renderablePlants.addTurn(plant.id, turn.turnNumber, plant);
		}
	}
}

// Called the first time the plugin is to be drawn, and never more.
// Useful for drawing backgrounds and hud elements that will never need to be redawn on layers.
plugin.initialDraw = function(renderer) {
	// draw all the background tiles
	for(var x = 0; x < renderer.width; x++) {
		for(var y = 0; y < renderer.height; y++) {
			renderer.drawTexture("grass", "background", x, y, 1, 1);
		}
	}
}


// Called around 60 times a second. Used for drawing!
//    time: has a t and turn variable. t represents 0.0 - 1.0 in the current turn, turn is the turn number to render
//    renderer: the object that can render graphics to the layers of the visualizer
plugin.draw = function(renderer, time) {
	// Do drawing here

	// draw creatures based on the renderablesCreatures
	renderer.clearLayer("units");
	
	var creatures = plugin.renderableCreatures.at(time.turn, time.t);
	for(var i in creatures) {
		var creature = creatures[i];

		renderer.drawQuad("units", creature.x, creature.y, 1, 1, creature.owner == 0 ? 255: 32, 32, creature.owner == 0 ? 32 : 255, 255);
		renderer.drawTexture("pacman", "units", creature.x, creature.y, 1, 1);
	}

	var plants = plugin.renderablePlants.at(time.turn, time.t);
	for(var p in plants) {
		var plant = plants[p];

		renderer.drawTexture("plant", "units", plant.x, plant.y, 1, 1);
	}
}