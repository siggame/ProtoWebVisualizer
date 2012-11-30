// UI
// User Interface, basic HTML interfaces for things like player talk

var UI = function() {};

UI.elements = new Object();

$(document).ready(function(){
	
	UI.elements.canvases = $("#visualizer-canvases");

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
	});

	UI.elements.nextturnButton = $('#visualizer-next-turn').click(function() {
		Time.nextTurn();
	});

	UI.elements.prevturnButton = $('#visualizer-prev-turn').click(function() {
		Time.prevTurn();
	});

	UI.elements.stopButton = $('#visualizer-stop').click(function() {
		Time.stop();
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

	UI.elements.canvases.css("position","absolute").css("left", "0").css("top", "0");

	$("canvas.visualizer-layer").each(function() {
		$(this).css("width", fullscreenWidth + "px").css("height", fullscreenHeight + "px");
	});
}

UI.exitFullscreen = function() {
	UI.elements.canvases.css("position","relative");

	$("canvas.visualizer-layer").each(function() {
		var layer = $(this);
		layer.css("width", layer.attr("width") + "px").css("height", layer.attr("height") + "px");
	});
}