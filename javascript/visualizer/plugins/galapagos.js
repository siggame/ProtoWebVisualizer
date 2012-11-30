// Galapagos Visualizer Plugin
// Require the visualizer core to work
$(document).ready(function() {
	Plugins["Galapagos"] = new function() {
		
		this.drawnBackground = false;
		this.name = "Galapagos";
		this.renderableCreatures;
		this.renderablePlants;

		this.initialize = function(gamelog, renderer) {
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

		// the textures this plugin will use
		this.textures = [
			"plant",
			"grass",
			"dirt",
			"pacman"
		];

		this.parse = function(gamelog) {
			// here you will want to iterate through the gamelog and build data structures by parsing the gamelog
			// initialize the renderables for creatures with the template of the first creature we find
			this.renderableCreatures = new Renderables(gamelog.turns[0].Creatures[0]);
			this.renderablePlants = new Renderables(gamelog.turns[0].Plants[0]);

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
								this.renderableCreatures.addTurn(creature.id, turn.turnNumber, {
									x: animation.fromX,
									y: animation.fromY
								});
							}

							this.renderableCreatures.addTurn(creature.id, turn.turnNumber, {
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
					this.renderableCreatures.addTurn(creature.id, turn.turnNumber, creature);
				}

				// for each plant in the turn
				for(var p in turn.Plants) {
					var plant = turn.Plants[p];

					this.renderablePlants.addTurn(plant.id, turn.turnNumber, plant);
				}
			}
		}

		this.draw = function(renderer, time) {
			// Do drawing here

			// draw the background once
			if(!this.drawnBackground) {
				for(var x = 0; x < renderer.width; x++) {
					for(var y = 0; y < renderer.height; y++) {
						renderer.drawTexture("grass", "background", x, y, 1, 1);
					}
				}

				this.drawnBackground = true;
			}

			// draw creatures based on the renderablesCreatures
			renderer.clearLayer("units");
			
			var creatures = this.renderableCreatures.at(time.turn, time.t);
			for(var i in creatures) {
				var creature = creatures[i];

				renderer.drawQuad("units", creature.x, creature.y, 1, 1, creature.owner == 0 ? 255: 32, 32, creature.owner == 0 ? 32 : 255, 255);
				renderer.drawTexture("pacman", "units", creature.x, creature.y, 1, 1);
			}

			var plants = this.renderablePlants.at(time.turn, time.t);
			for(var p in plants) {
				var plant = plants[p];

				renderer.drawTexture("plant", "units", plant.x, plant.y, 1, 1);
			}
		}
	}
});

