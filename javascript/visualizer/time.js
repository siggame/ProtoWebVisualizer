// Time
// The object that keeps track of the visualizer internal time states

var Time = function() {};

Time.t = 0;
Time.turn = 0;
Time.msPerTurn = 1000; // 1 sec / turn
Time.turns = 0;
Time.playing = false;

Time.tick = function(ms) {
	if(!Time.playing) {
		return false;
	}
	// Update t with the time that passed
	Time.t += (ms / Time.msPerTurn);

	// Check to see if we need to advance the turn
	if( Time.t >= 1.0 ) {
		// Should we do turns++, or add the number of turns over Time.t? The first displays all turns, the later ensures playback never lags behind...
		Time.turn++;
		Time.t = 0;
	}

	Time.boundsCheck();

	Time.updateUI();
	return true;
};

Time.boundsCheck = function() {
	// Make sure we didn't go past the max number of turns
	if( Time.turn >= Time.turns ) {
		Time.turn = Time.turns-1;
		Time.t = 0.999;
		Time.pause();
	}

	// Make sure we didn't go negative
	if( Time.turn < 0 ) {
		Time.turn = 0;
	}
	if( Time.t < 0 ) {
		Time.t = 0;
	}
}

Time.invertPlaying = function() {
	Time.playing = !Time.playing;
}

Time.set = function(time) {
	Time.pause();
	Time.turn = Math.floor(time);
	Time.t = time - Time.turn;
	Time.boundsCheck();
	Time.updateUI()
}

Time.play = function() {
	Time.playing = true;
};

Time.pause = function() {
	Time.playing = false;
};

Time.nextTurn = function() {
	Time.set(Time.turn + 1);
}

Time.prevTurn = function() {
	Time.set(Time.turn - 1);
}

Time.stop = function() {
	Time.set(0);
}

Time.updateUI = function() {
	UI.updateTime(Time.turn + Time.t);
}