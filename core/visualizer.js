var Visualizer = new Object();

Visualizer.plugins = new Array();
Visualizer.options = [];
Visualizer.currentPlugin = undefined;
Visualizer.gamelog = undefined;

// Components of the visualizer core
Visualizer.loader = undefined;
Visualizer.ui = undefined;
Visualizer.renderer = undefined;
Visualizer.time = undefined;
Visualizer.input = undefined;

Visualizer.initialize = function() {
	

	Visualizer.ui.initialize(Visualizer.time);
	Visualizer.loader.initialize(Visualizer.gamelogLoaded);

	Visualizer.addOptions("Main", Visualizer.defaultOptions);

	Visualizer.mainLoop();
};

Visualizer.mainLoop = function() {
	var firstloop = true;

	// the 60 fps loop
	(function (window) {
		function gameLoop() {
			if(Visualizer.currentPlugin && Visualizer.renderer.ready() && Visualizer.gamelog) {
				if(firstloop) {
					Visualizer.currentPlugin.initialDraw(Visualizer.renderer);
					Visualizer.ui.elements.playpauseButton.click();  // TODO: I don't like this
					firstloop = false;
				}
				else {
					Visualizer.time.tick(1000 /60);  // TODO: measure time elapsed
					Visualizer.ui.updateTime(Visualizer.time.total());
					Visualizer.currentPlugin.draw(Visualizer.renderer, Visualizer.time);
				}
			}
		}
		window.setInterval(gameLoop, 1000 / 60); // 60fps
	} (window));
};

Visualizer.addOptions = function(title, options) {
	Visualizer.options[title] = [];
	Visualizer.ui.addOptionSection(title);

	for(var i in options) {
		Visualizer.options[title].push(options[i]);
		Visualizer.ui.addOption(title, options[i]);
	}
};

Visualizer.gamelogLoaded = function(gamelog) {
	Visualizer.gamelog = gamelog;
	
	Visualizer.ui.finishLoading(Visualizer.gamelog);
	Visualizer.time.turns = Visualizer.gamelog.turns.length;

	Visualizer.loadPlugin(gamelog.gameName);
};

Visualizer.loadPlugin = function(pluginName) {
	// look through all our plugins to see if any can load this gamelog
	for(var key in Visualizer.plugins) {
		if(Visualizer.currentPlugin == undefined) {
			for(var i in Visualizer.plugins[key].loads) {
				if(Visualizer.plugins[key].loads[i] == Visualizer.gamelog.gameName) {
					Visualizer.currentPlugin = Visualizer.plugins[key];
					break;
				}
			}
		}
	}

	// if the plugin was not found
	if(Visualizer.currentPlugin == undefined) {
		console.log('Error: Plugin for the gamelog of "' + Visualizer.gamelog.gameName + '" could not be found.');
		return;
	}

	// Load the textures for the plugin
	Visualizer.renderer.addTextures(Visualizer.currentPlugin.textures, Visualizer.currentPlugin.name.toLowerCase());

	// add the options of the plugin to the core
	Visualizer.addOptions(Visualizer.currentPlugin.name, Visualizer.currentPlugin.options);

	// initialize and parse the current gamelog
	Visualizer.currentPlugin.initialize(Visualizer.gamelog, Visualizer.renderer);
	Visualizer.currentPlugin.parse(Visualizer.gamelog);

	// build the events in this gamelog
	Visualizer.addEvents(Visualizer.currentPlugin.events);
};

Visualizer.addEvents = function(events) {
	for(var i in events) {
		var event = events[i];

		Visualizer.ui.addEvent(event);
	}
}