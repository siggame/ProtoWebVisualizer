Visualizer.renderer = new Object();

Visualizer.renderer.pixelsPerUnit = 32; // TODO: should be settable by plugins
Visualizer.renderer.width = 0;
Visualizer.renderer.height = 0;
Visualizer.renderer.textures = new Array();
Visualizer.renderer.imagesLoading = new Array();
Visualizer.renderer.layers = new Array();

Visualizer.renderer.setDimensions = function(w, h) {
	Visualizer.renderer.width = w;
	Visualizer.renderer.height = h;
	Visualizer.ui.setScreenDimensions(Visualizer.renderer.pxWidth(), Visualizer.renderer.pxHeight()); // DISLIKE
};

Visualizer.renderer.pxWidth = function() {
	return Visualizer.renderer.width * Visualizer.renderer.pixelsPerUnit;
};

Visualizer.renderer.pxHeight = function() {
	return Visualizer.renderer.height * Visualizer.renderer.pixelsPerUnit;
};

Visualizer.renderer.addLayer = function(key) {
	Visualizer.renderer.layers[key] = new Layer( Visualizer.ui.elements.canvases, key, Visualizer.renderer.pxWidth(), Visualizer.renderer.pxHeight() );  // DISLIKE
};

Visualizer.renderer.addTexture = function(key, path, pluginName) {
	var img = new Image();
	Visualizer.renderer.imagesLoading.push(key);
	img.src = "./plugins/" + pluginName + "/textures/" + key + ".png";	// TODO not hard code png

	img.onload = function() {
		Visualizer.renderer.textures[key] = img;
		// below is basically: Visualizer.renderer.imagesLoading.remove(key);
		Visualizer.renderer.imagesLoading.splice($.inArray(key, Visualizer.renderer.imagesLoading), 1);
	};
};

Visualizer.renderer.addTextures = function(textures, pluginName) {
	for(i in textures) {
		Visualizer.renderer.addTexture(textures[i][0], textures[i][1], pluginName);
	}
}

Visualizer.renderer.ready = function() {
	return Visualizer.renderer.imagesLoading.length == 0;
}

Visualizer.renderer.drawTexture = function() {
	return( Visualizer.renderer.drawTexture[arguments.length].apply( this, arguments ) );
}

Visualizer.renderer.drawTexture[10] = function(imageKey, layer, x, y, w, h, subX, subY, subW, subH) {
	var image = Visualizer.renderer.textures[imageKey];
	var p = Visualizer.renderer.pixelsPerUnit;
	Visualizer.renderer.layers[layer].context.drawImage(image, subX * image.width, subY * image.height, subW * image.width, subH * image.height, x*p, y*p, w*p, h*p);
}

Visualizer.renderer.drawTexture[7] = function(imageKey, layer, x, y, w, h, frame) {
	var image = Visualizer.renderer.textures[imageKey];
	var cols = image.width/Visualizer.renderer.pixelsPerUnit;
	var row = Math.floor(frame / cols);
	var col = frame % cols;
	Visualizer.renderer.drawTexture(imageKey, layer, x, y, w, h, col/cols, row/cols, 1/cols, 1/cols);
}

Visualizer.renderer.drawTexture[6] = function(imageKey, layer, x, y, w, h) {
	Visualizer.renderer.drawTexture(imageKey, layer, x, y, w, h, 0, 0, 1, 1);
}

Visualizer.renderer.drawQuad = function(layer, x, y, w, h, r, g, b, a)  {
	var p = Visualizer.renderer.pixelsPerUnit;
	if(r <= 1 && g <= 1 && b <= 1 && a <= 1) {
		r = Math.round(r*255);
		g = Math.round(g*255);
		b = Math.round(b*255);
		a = Math.round(a*255);
	}
	Visualizer.renderer.layers[layer].context.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
	Visualizer.renderer.layers[layer].context.fillRect(x*p, y*p, w*p, h*p);
}

Visualizer.renderer.clearLayer = function(layer) {
	Visualizer.renderer.layers[layer].context.clearRect(0, 0, Visualizer.renderer.pxWidth(), Visualizer.renderer.pxHeight());
}

// A Layer is essentially a canvas on the DOM that we draw to
function Layer(element, key, width, height) {
	var newCanvas = $('<canvas/>',
		{'class':'visualizer-layer',
		'id':'visualizer-layer-' + key})
		.attr("width", width)
		.attr("height", height)
		.width(width)
		.height(height);
	element.append(newCanvas);

	this.context = document.getElementById("visualizer-layer-"+key).getContext("2d");

	// TODO: this should probably be moved somewhere it makes more sense
	$("#visualizer-canvases")
		.width(width)
		.height(height);
}