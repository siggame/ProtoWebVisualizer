// Loader
// Loads gameslogs from any and every source

var Loader = function() {};

var Gamelog = null;

$(document).ready(function() {

	/*$("element(s)").fileReader( {
		id: "visualizer-loader",
		filereader: "./javascript/libraries/filereader.swf",
		expressInstall: "./javascript/libraries/expressInstall.swf",
		debugMode: false,
		callback: function() {
			alert("Filereader callback");
		}
	});*/

	if (window.File && window.FileReader && window.FileList && window.Blob) {
  		document.getElementById('visualizer-loader-files').addEventListener('change', handleFiles, false);
	} else {
		Log('The File APIs are not fully supported in this browser.');
	}
});

Loader.getGamelog = function(file, successCallback) {
	$.ajax({
		url: 'http://sig-game-dev.jacobfischer.me/gamelogs/' + file,
		dataType: "json",
		success: function(data) {
			Gamelog = data;
			Log("success getting gamelog: " + file);
			successCallback();
		},
		error: function() {
			Log("Error getting gamelog: " + file);
		}
	});
}

function handleFiles(evt) {
	var files = evt.target.files;

	for (i = 0; i < files.length; i++) {
		var file = files[i];
		var reader = new FileReader();

		reader.onload = function(e) {
			var str = e.target.result;

			Gamelog = makeGamelogFromString(str);
			gamelogLoaded();
		}
		reader.onerror = function(stuff) {
			console.log("error", stuff)
			console.log (stuff.getMessage())
		}

		reader.readAsText(file);
	}
}

function makeGamelogFromString(str) {
	return $.parseJSON(str);
}
  

