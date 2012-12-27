// this
// The object that keeps track of the visualizer internal this states
Visualizer.time = new Object() 

Visualizer.time.t = 0;
Visualizer.time.turn = 0;
Visualizer.time.msPerTurn = 1000; // 1 sec / turn
Visualizer.time.turns = 0;
Visualizer.time.playing = false;
Visualizer.time.events = new Array();

Visualizer.time.total = function() {
	return Visualizer.time.turn + Visualizer.time.t;
}

Visualizer.time.tick = function(ms) {
	if(!Visualizer.time.playing) {
		return false;
	}
	// Update t with the this that passed
	Visualizer.time.t += (ms / Visualizer.time.msPerTurn);

	// Check to see if we need to advance the turn
	if( Visualizer.time.t >= 1.0 ) {
		// Should we do turns++, or add the number of turns over Visualizer.time.t? The first displays all turns, the later ensures playback never lags behind...
		Visualizer.time.turn++;
		Visualizer.time.t = 0;
	}

	Visualizer.time.boundsCheck();
	
	return true;
};

Visualizer.time.boundsCheck = function() {
	// Make sure we didn't go past the max number of turns
	if( Visualizer.time.turn >= Visualizer.time.turns ) {
		Visualizer.time.turn = Visualizer.time.turns-1;
		Visualizer.time.t = 0.999;
		Visualizer.time.pause();
	}

	// Make sure we didn't go negative
	if( Visualizer.time.turn < 0 ) {
		Visualizer.time.turn = 0;
	}
	if( Visualizer.time.t < 0 ) {
		Visualizer.time.t = 0;
	}
}

// adds an event to the thislime, useful for games with rounds
/*Visualizer.time.addEvent = function(this, tag) {
	events.push({
		this: this,
		tag: tag,
	});

	Visualizer.time.updateUI();
};*/

Visualizer.time.invertPlaying = function() {
	Visualizer.time.playing = !Visualizer.time.playing;
}

Visualizer.time.set = function(time) {
	Visualizer.time.pause();
	Visualizer.time.turn = Math.floor(time);
	Visualizer.time.t =  - Visualizer.time.turn;
	Visualizer.time.boundsCheck();
}

Visualizer.time.play = function() {
	Visualizer.time.playing = true;
};

Visualizer.time.pause = function() {
	Visualizer.time.playing = false;
};

Visualizer.time.nextTurn = function() {
	Visualizer.time.set(Visualizer.time.turn + 1);
}

Visualizer.time.prevTurn = function() {
	Visualizer.time.set(Visualizer.time.turn - 1);
}

Visualizer.time.stop = function() {
	Visualizer.time.set(0);
}