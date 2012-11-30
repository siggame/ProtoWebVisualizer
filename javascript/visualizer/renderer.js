var Renderer = function() {};

Renderer.pixelsPerUnit = 32;
Renderer.width = 0;
Renderer.height = 0;
Renderer.textures = new Array();
Renderer.imagesLoading = new Array();
Renderer.layers = new Array();

Renderer.setDimensions = function(w, h) {
	Renderer.width = w;
	Renderer.height = h;
};

Renderer.addLayer = function(key) {
	Renderer.layers[key] = new Layer( UI.elements.canvases, key, Renderer.width, Renderer.height );
};

Renderer.addTexture = function(key, pluginName) {
	var img = new Image();
	Renderer.imagesLoading.push(key);
	img.src = "./textures/" + pluginName + "/" + key + ".png";	// TODO not hard code png

	img.onload = function() {
		Renderer.textures[key] = img;
		//Renderer.imagesLoading.remove(key);
		Renderer.imagesLoading.splice($.inArray(key, Renderer.imagesLoading), 1);
	};
};

Renderer.addTextures = function(keys, pluginName) {
	for(i in keys) {
		Renderer.addTexture(keys[i], pluginName);
		console.log("added texture " + keys[i]);
	}
}

Renderer.ready = function() {
	return Renderer.imagesLoading.length == 0;
}

Renderer.drawTexture = function() {
	return( Renderer.drawTexture[arguments.length].apply( this, arguments ) );
}

Renderer.drawTexture[10] = function(imageKey, layer, x, y, w, h, subX, subY, subW, subH) {
	var image = Renderer.textures[imageKey];
	var p = Renderer.pixelsPerUnit;
	Renderer.layers[layer].context.drawImage(image, subX * image.width, subY * image.height, subW * image.width, subH * image.height, x*p, y*p, w*p, h*p);
}

Renderer.drawTexture[7] = function(imageKey, layer, x, y, w, h, frame) {
	var image = Renderer.textures[imageKey];
	var cols = image.width/Renderer.pixelsPerUnit;
	var row = Math.floor(frame / cols);
	var col = frame % cols;
	Renderer.drawTexture(imageKey, layer, x, y, w, h, col/cols, row/cols, 1/cols, 1/cols);
}

Renderer.drawTexture[6] = function(imageKey, layer, x, y, w, h) {
	Renderer.drawTexture(imageKey, layer, x, y, w, h, 0, 0, 1, 1);
}

Renderer.drawQuad = function(layer, x, y, w, h, r, g, b, a)  {
	var p = Renderer.pixelsPerUnit;
	if(r <= 1 && g <= 1 && b <= 1 && a <= 1) {
		r = Math.round(r*255);
		g = Math.round(g*255);
		b = Math.round(b*255);
		a = Math.round(a*255);
	}
	Renderer.layers[layer].context.fillStyle = "rgba("+r+","+g+","+b+","+a+")";
	Renderer.layers[layer].context.fillRect(x*p, y*p, w*p, h*p);
}

Renderer.clearLayer = function(layer) {
	Renderer.layers[layer].context.clearRect(0, 0, Renderer.width*Renderer.pixelsPerUnit, Renderer.height*Renderer.pixelsPerUnit);
}



// A Layer is essentially a canvas on the DOM that we draw to
function Layer(element, key, width, height) {
	var newCanvas = $('<canvas/>',
		{'class':'visualizer-layer',
		'id':'visualizer-layer-' + key})
		.attr("width", width * Renderer.pixelsPerUnit)
		.attr("height", height * Renderer.pixelsPerUnit)
		.width(width * Renderer.pixelsPerUnit)
		.height(height * Renderer.pixelsPerUnit);
	element.append(newCanvas);

	this.context = document.getElementById("visualizer-layer-"+key).getContext("2d");

	// TODO: this should probably be moved somewhere it makes more sense
	$("#visualizer-canvases")
		.width(width * Renderer.pixelsPerUnit)
		.height(height * Renderer.pixelsPerUnit);
}