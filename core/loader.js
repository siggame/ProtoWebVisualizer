// Loader
// Loads gameslogs from any and every source

Visualizer.loader = new Object();

Visualizer.loader.finishedLoadingCallback = undefined;

Visualizer.loader.initialize = function(callback) {
	
	Visualizer.loader.finishedLoadingCallback = callback; //the callback will be called after loading a gamelog, and the only parameter will be the gamelog deserialized

	if (window.File && window.FileReader && window.FileList && window.Blob) {
  		document.getElementById('visualizer-loader-files').addEventListener('change', Visualizer.loader.handleFiles, false);
	} else {
		Log('The File APIs are not fully supported in this browser.');
	}

	// Check to see if there is a URL parameter for the remote gamelog
	var remoteGamelog = getURLParameter("gamelog");
	if(remoteGamelog != null) {
		Log("url param gamelog: " + remoteGamelog);
		Visualizer.loader.getRemoteGamelog(remoteGamelog);
	}
};

Visualizer.loader.startLoading = function() {
	//UI.startLoading();
};

Visualizer.loader.getRemoteGamelog = function(url) {
	Visualizer.loader.startLoading();
	url  = "http://" + url;

	$.ajax({
		url: url,
		dataType: "json",
		success: function(data) {
			Log("success getting gamelog at: " + url);
			Visualizer.loader.finishedLoadingCallback(data);
		},
		error: function() {
			Log("Error getting gamelog at: " + url);
		}
	});
}

Visualizer.loader.handleFiles = function(evt) {
	Visualizer.loader.startLoading();
	var files = evt.target.files;

	for (i = 0; i < files.length; i++) {
		var file = files[i];
		var reader = new FileReader();

		reader.onload = function(e) {
			Visualizer.loader.finishedLoadingCallback($.parseJSON(e.target.result));
		}
		reader.onerror = function(stuff) {
			console.log("error", stuff);
			console.log (stuff.getMessage());
		}

		reader.readAsText(file);
	}
}