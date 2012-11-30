var Plugins = new Array(); // plugins should add themselves to this through a different file
var plugin = null;

$(document).ready(function() {
	//Loader.getGamelog("2.json", initializeSystems);

	// the 60 fps loop
	(function (window) {
		function gameLoop() {
			if(plugin && Renderer.ready() && Gamelog != null) {
				Time.tick(1000 /60);  // todo: measure time elapsed
				plugin.draw(Renderer, Time);
			}
		}
		window.setInterval(gameLoop, 1000 / 60); // 60fps
	} (window));
});

function gamelogLoaded() {
	// find the plugin
	plugin = Plugins[Gamelog.gameName];

	// if the plugin was not found
	if(!plugin) {
		Log('Error: Plugin for the gamelog of "' + Gamelog.gameName + '" could not be found.');
		return;
	}

	// Load the textures for the plugin
	Renderer.addTextures(plugin.textures, plugin.name.toLowerCase());

	plugin.initialize(Gamelog, Renderer);
	plugin.parse(Gamelog);

	UI.setTurns(Gamelog.turns.length);
	Time.turns = Gamelog.turns.length;
	Time.play();
}



