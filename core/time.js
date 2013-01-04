// this
// The object that keeps track of the visualizer internal this states
Visualizer.time = {}; 

Visualizer.time.t = 0;
Visualizer.time.turn = 0;
Visualizer.time.msPerTurn = 1000; // 1 sec / turn
Visualizer.time.turns = 0;
Visualizer.time.playing = false;

Visualizer.time.total = function() {
	return Visualizer.time.turn + Visualizer.time.t;
}

Visualizer.time.tick = function(ms) {
	if(!Visualizer.time.playing) {
		return false;
	}
	// Update t with the this that passed
	Visualizer.time.t += (ms / Visualizer.time.msPerTurn);

	Visualizer.time.turn += Math.floor(Visualizer.time.t);
	Visualizer.time.t -= Math.floor(Visualizer.time.t);

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