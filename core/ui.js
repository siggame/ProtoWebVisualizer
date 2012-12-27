// UI
// User Interface, basic HTML interfaces for things like player talk

Visualizer.ui = new Object()

Visualizer.ui.elements = new Object();

Visualizer.ui.initialize = function(time) {
	
	Visualizer.ui.elements.canvases = $("#visualizer-canvases");
	Visualizer.ui.elements.visualAlert = $('div#visualizer-visual-alert');
	Visualizer.ui.elements.screen = $('div#visualizer-screen');
	Visualizer.ui.elements.currentTime = $('#visualizer-current-time');
	Visualizer.ui.elements.maxTurns = $('#visualizer-max-turns');
	Visualizer.ui.elements.optionsListSection = new Array();

	Visualizer.ui.elements.timebar = $( "#visualizer-time-bar" ).slider({
		range: "min",
		value: 0,
		min: 0,
		max: 1,
		step: 0.001,
		slide: function( event, ui ) {
			time.set(Visualizer.ui.value);
		}
	});

	Visualizer.ui.elements.speedbar = $( "#visualizer-speed-bar" ).slider({
		range: "min",
		value: 9001,
		min: 1,
		max: 10000,
		step: 10,
		slide: function( event, ui ) {
			time.msPerTurn = 10001-Visualizer.ui.value;
		}
	});

	Visualizer.ui.elements.playpauseButton = $('#visualizer-play-pause').click(function() {
		time.invertPlaying();
		if(time.playing) {
			$(this).removeClass("visualizer-play").addClass('visualizer-pause');
			Visualizer.ui.visualAlert("play");
		}
		else {
			$(this).removeClass("visualizer-pause").addClass('visualizer-play');
			Visualizer.ui.visualAlert("pause");
		}
	});

	Visualizer.ui.elements.nextturnButton = $('#visualizer-next-turn').click(function() {
		time.nextTurn();
		Visualizer.ui.visualAlert("nextturn");
	});

	Visualizer.ui.elements.prevturnButton = $('#visualizer-prev-turn').click(function() {
		time.prevTurn();
		Visualizer.ui.visualAlert("prevturn");
	});

	Visualizer.ui.elements.stopButton = $('#visualizer-stop').click(function() {
		time.stop();
		Visualizer.ui.visualAlert("stop");
	});

	Visualizer.ui.elements.fullscreen = $('#visualizer-fullscreen').click(function() {
		Visualizer.ui.goFullscreen();
	});

	Visualizer.ui.elements.canvases = $("#visualizer-canvases");

	// Keypresses
	$(document).keyup(function(e) {
		if (e.keyCode == 27) {  // ESC
			
		}
		
		switch(e.keyCode) {
			case 27: // ESC
				Visualizer.ui.exitFullscreen();
				break;
			case 32:  // Space
			case 179: // Play Puase keyboard shortcut
				Visualizer.ui.elements.playpauseButton.click();
				break;
			case 37:  // Left Arrow
			case 177: // Prev Track keyboard shortcut
				Visualizer.ui.elements.prevturnButton.click();
				break;
			case 39:  // Right Arrow
			case 176: // Next Track keyboard shortcut
				Visualizer.ui.elements.nextturnButton.click();
				break;
			case 40: // Down Arrow
				Visualizer.ui.elements.stopButton.click()
				break;
		}
	});

	Visualizer.ui.elements.optionsDialog = $('#visualizer-options-dialog').dialog({
		modal: true,
		autoOpen: false,
		show: "fade",
		hide: "fade",
	});

	Visualizer.ui.elements.optionsButton = $("#visualizer-options").click(function() {
		Visualizer.ui.elements.optionsDialog.dialog("open");
	});

	Visualizer.ui.elements.optionList = $('ul#visualizer-option-list');
};



Visualizer.ui.visualAlert = function(s) {
	Visualizer.ui.elements.visualAlert
		.stop(true, true)
		.hide()
		.removeClass()
		.addClass("visualizer-ui-" + s)
		.show()
		.fadeOut(500);

} 

Visualizer.ui.updateTime = function(time) {
	Visualizer.ui.elements.timebar.slider('value', time);
	Visualizer.ui.elements.currentTime.html( Math.round(time*100)/100);
}

Visualizer.ui.goFullscreen = function() {
	var fullscreenWidth = window.innerWidth;
	var fullscreenHeight = window.innerHeight;

	Visualizer.ui.elements.screen
		.css("position","absolute")
		.css("left", "0")
		.css("top", "0")
		.css("width", fullscreenWidth+"px")
		.css("height", fullscreenHeight+"px")
		.addClass("fullscreen");

	$("canvas.visualizer-layer").each(function() {
		Visualizer.ui.elementGoFullscreen($(this));
	});

	Visualizer.ui.elementGoFullscreen(Visualizer.ui.elements.visualAlert);

	Visualizer.ui.elements.visualAlert.focus();
}

Visualizer.ui.elementGoFullscreen = function(element) {
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

Visualizer.ui.exitFullscreen = function() {
	Visualizer.ui.elements.screen
		.css("position","relative")
		.css("width", "auto")
		.css("height", "auto")
		.removeClass("fullscreen");

	$("canvas.visualizer-layer").each(function() {
		Visualizer.ui.elementExitFullscreen($(this));
	});

	Visualizer.ui.elementExitFullscreen(Visualizer.ui.elements.visualAlert);
}

Visualizer.ui.elementExitFullscreen = function(element) {
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

Visualizer.ui.setScreenDimensions = function(w, h) {
	Visualizer.ui.elements.visualAlert
		.css("width", w + "px")
		.css("height", h + "px");
	Visualizer.ui.elements.screen
		.css("width", w + "px")
		.css("height", h + "px")
		.css("background-image", "none");
};

Visualizer.ui.startLoading = function() {
	Visualizer.ui.elements.screen.css("background-image", "url('../images/ui/loading.gif')")
}

Visualizer.ui.finishLoading = function(gamelog) {
	Visualizer.ui.elements.maxTurns.html("/ " + gamelog.turns.length);
	Visualizer.ui.elements.timebar.slider('option', 'max', gamelog.turns.length);
	Visualizer.ui.elements.timebar.slider('value', Visualizer.ui.elements.timebar.val());
}


// The Options UI

Visualizer.ui.addOptionSection = function(title) {
	Visualizer.ui.elements.optionList.append(
		$("<li>").append(title).append(
			$("<ul>").attr("id", "visualizer-option-section-" + title)
		)
	);

	Visualizer.ui.elements.optionsListSection[title] = $("#visualizer-option-section-" + title);
};

Visualizer.ui.addOption = function(title, option) {
	var optionElement = $("<li>");
	// key without whitespace
	var keyless = option.key.replace(/\s+/g, '');

	switch(option.type) {
		case "checkbox":
			var checkbox = $('<input>')
				.attr('type',"checkbox")
				.attr('id',"visualizer-option-" + keyless)
				.change(function() {
					option.value = this.checked;
				});

			if(option.value) {
				checkbox.attr("checked", "checked");
			}

			var label = $('<label>').attr('for', "visualizer-option-" + keyless).html(option.key);

			optionElement.append(checkbox).append(label);
			break;
		case "select":
			var select = $("<select>")
				.attr('id',"visualizer-option-" + keyless)
				.change(function() {
					option.value = $(this).val();
				});

			for(var i in option.values) {
				var selectOption = $("<option>").attr("value", option.values[i]).html(option.values[i]);
				if(option.value == option.values[i]) {
					selectOption.attr("selected", "selected");
				}
				select.append(selectOption);
			}

			var label = $('<label>').attr('for', "visualizer-option-" + keyless).html(option.key + ": ");

			optionElement.append(label).append(select);
			break;
		case "slider":
			var slider = $('<div>').slider({			
				range: "min",
				value: option.value,
				min: option.range[0],
				max: option.range[1],
				step: option.step ? option.step : 0.01,
				slide: function(event, ui) {
					option.value = ui.value;
				}
			});

			optionElement.append(option.key + ": ").append(slider);
			break;
	}

	Visualizer.ui.elements.optionsListSection[title].append(optionElement);
};