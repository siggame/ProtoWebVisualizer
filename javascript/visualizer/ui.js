// UI
// User Interface, basic HTML interfaces for things like player talk

var UI = function() {};

UI.elements = new Object();

$(document).ready(function(){
	
	UI.elements.canvases = $("#visualizer-canvases");
	UI.elements.visualAlert = $('div#visualizer-visual-alert');
	UI.elements.screen = $('div#visualizer-screen');

	UI.elements.timebar = $( "#visualizer-time-bar" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 1,
		step: 0.001,
		slide: function( event, ui ) {
			Time.set(ui.value);
			$( "#visualizer-current-time" ).val( "Turn: " + ui.value );
		}
	});

	UI.elements.speedbar = $( "#visualizer-speed-bar" ).slider({
		range: "min",
		value: 9001,
		min: 1,
		max: 10000,
		step: 10,
		slide: function( event, ui ) {
			Time.msPerTurn = 10001-ui.value;
		}
	});

	UI.elements.playpauseButton = $('#visualizer-play-pause').click(function() {
		Time.invertPlaying();
		if(Time.playing) {
			$(this).removeClass("visualizer-play").addClass('visualizer-pause');
			UI.visualAlert("play");
		}
		else {
			$(this).removeClass("visualizer-pause").addClass('visualizer-play');
			UI.visualAlert("pause");
		}
	});

	UI.elements.nextturnButton = $('#visualizer-next-turn').click(function() {
		Time.nextTurn();
		UI.visualAlert("nextturn");
	});

	UI.elements.prevturnButton = $('#visualizer-prev-turn').click(function() {
		Time.prevTurn();
		UI.visualAlert("prevturn");
	});

	UI.elements.stopButton = $('#visualizer-stop').click(function() {
		Time.stop();
		UI.visualAlert("stop");
	});

	UI.elements.fullscreen = $('#visualizer-fullscreen').click(function() {
		UI.goFullscreen();
	});

	UI.elements.canvases = $("#visualizer-canvases");

	// Keypresses
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {  // ESC
			
		}
		
		switch(e.keyCode) {
			case 27: // ESC
				UI.exitFullscreen();
				break;
			case 32:  // Space
			case 179: // Play Puase keyboard shortcut
				UI.elements.playpauseButton.click();
				break;
			case 37:  // Left Arrow
			case 177: // Prev Track keyboard shortcut
				UI.elements.prevturnButton.click();
				break;
			case 39:  // Right Arrow
			case 176: // Next Track keyboard shortcut
				UI.elements.nextturnButton.click();
				break;
			case 40: // Down Arrow
				UI.elements.stopButton.click()
				break;
		}
	});
});

UI.visualAlert = function(s) {
	UI.elements.visualAlert
		.stop(true, true)
		.hide()
		.removeClass()
		.addClass("visualizer-ui-" + s)
		.show()
		.fadeOut(500);

} 

UI.setTurns = function(turns) {
	UI.elements.timebar.slider('option', 'max', turns);
	UI.elements.timebar.slider('value', UI.elements.timebar.val());
}

UI.updateTime = function(time) {
	UI.elements.timebar.slider('value', time);
	$( "#visualizer-current-time" ).val( "Turn: " + time );
}

UI.goFullscreen = function() {
	var fullscreenWidth = window.innerWidth;
	var fullscreenHeight = window.innerHeight;

	UI.elements.screen
		.css("position","absolute")
		.css("left", "0")
		.css("top", "0")
		.css("width", fullscreenWidth+"px")
		.css("height", fullscreenHeight+"px")
		.addClass("fullscreen");

	$("canvas.visualizer-layer").each(function() {
		UI.elementGoFullscreen($(this));
	});

	UI.elementGoFullscreen(UI.elements.visualAlert);

	UI.elements.visualAlert.focus();
}

UI.elementGoFullscreen = function(element) {
	var fullscreenWidth = window.innerWidth;
	var fullscreenHeight = window.innerHeight;

	var scale = (fullscreenWidth / Renderer.pxWidth());
	if (Renderer.pxHeight() * scale > fullscreenHeight) {
		scale = fullscreenHeight / Renderer.pxHeight();
 	}

	element
		.css("width", Renderer.pxWidth()*scale + "px")
		.css("height", Renderer.pxHeight()*scale + "px")
		.css("top", (fullscreenHeight - (Renderer.pxHeight()*scale))/2 + "px")
		.css("left", (fullscreenWidth - (Renderer.pxWidth()*scale))/2 + "px");
};

UI.exitFullscreen = function() {
	UI.elements.screen
		.css("position","relative")
		.css("width", "auto")
		.css("height", "auto")
		.removeClass("fullscreen");

	$("canvas.visualizer-layer").each(function() {
		UI.elementExitFullscreen($(this));
	});

	UI.elementExitFullscreen(UI.elements.visualAlert);
}

UI.elementExitFullscreen = function(element) {
	var w, h;
	if(element.attr("width") == undefined) {
		w = $("canvas.visualizer-layer").attr("width");
		h = $("canvas.visualizer-layer").attr("height");
	}
	else {
		w = element.attr("width");
		h = element.attr("height");
	}

	element
		.css("width", w + "px")
		.css("height", h + "px")
		.css("top", "0px")
		.css("left", "0px");
};

UI.setScreenDimensions = function(w, h) {
	UI.elements.visualAlert
		.css("width", w + "px")
		.css("height", h + "px");
	UI.elements.screen
		.css("width", w + "px")
		.css("height", h + "px")
		.css("background-image", "none");
};

UI.startLoading = function() {
	UI.elements.screen.css("background-image", "url('../images/ui/loading.gif')")
}