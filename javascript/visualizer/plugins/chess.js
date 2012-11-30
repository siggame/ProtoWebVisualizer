// Chess Visualizer Plugin
// Requires the visualizer core to work

Plugins["Chess"] = function() {
	
	this.drawnBackground = false;

	this.initialize = function(gamelog, renderer) {
		// initialize stuff here, good ideas:
		// * set the dimensions of the renderer (map width and height)
		// * add the layers you'll want in the renderer, in order
		// * initialize your data structures

		// setup the dimensions of the renderer to be 8 x 8
		renderer.setDimensions(8,8);

		// give us 2 layers, the background and units layer
		renderer.addLayer("background");
		renderer.addLayer("pieces");
	};

	// the textures this plugin will use
	this.textures = function() {
		return [
			"plants",
			"grass",
			"dirt"
		];
	}

	this.parse = function(gamelog) {
		// here you will want to iterate through the gamelog and build data structures by parsing the gamelog
	};

	this.draw = function(time, renderer) {
		// Do drawing here
		
		// on the first turn draw
		if(!this.drawnBackground) {
			for(int x = 0; x < 8; x++) {
				for(int y = 0; y < 8; y++) {
					renderer.drawTexture
				}
			}
		}
	};

}

