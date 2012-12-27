// Renderables
// A collection of Renderable objects, A Renderable makes it easy to draw objects that change from turn to turn
function Renderables(masterTemplate) {
	this.renderables = new Array();
	this.template = masterTemplate;

	this.addTurn = function(id, turn, template) {
		// if the id is not in the renderables array already, add it
		if(!this.renderables[id]) {
			this.renderables[id] = new Renderable(id, this.template);
		}

		this.renderables[id].addTurn(turn, template);
	}

	this.at = function(turn, t) {
		var objs = new Array();
		for(var i in this.renderables) {
			var renderable = this.renderables[i];
			
			if(renderable.existsDuring(turn)) {
				objs.push(renderable.at(turn, t));
			}
		}
		return objs;
	}
}


function Renderable(id, masterTemplate) {
	this.id = id;
	this.changes = new Array();
	this.template = masterTemplate;
	this.firstTurn = -1;
	this.lastTurn = -1;

	for(var property in this.template) {
		this.changes[property] = new Array();
	}

	this.addTurn = function(turn, template) {
		for(var property in template) {
			// if we've yet to see this property for this turn, make the new array for it
			if(!this.changes[property][turn]) {
				this.changes[property][turn] = new Array();
			}

			this.changes[property][turn].push(template[property]);
		}

		if(this.lastTurn < turn) {
			this.lastTurn = turn;
		}
		if(this.firstTurn == -1) {
			this.firstTurn = turn;
		} 
	}

	this.at = function(turn, t) {
		var obj = {};
		for(var property in this.template) {
			// if there were no changes in that property that turn
			if(this.changes[property][turn].length == 1) {
				obj[property] = this.changes[property][turn][0];
			}
			else { // else we need to find the value between two points
				var indexA = Math.floor(t * (this.changes[property][turn].length - 1));
				var indexB = indexA + 1;
				var subT = (t * (this.changes[property][turn].length - 1)) - indexA;
				obj[property] = this.changes[property][turn][indexA] + subT * (this.changes[property][turn][indexB] - this.changes[property][turn][indexA]);
			}
		}

		return obj;
	}

	this.existsDuring = function(turn) {
		return turn >= this.firstTurn && turn <= this.lastTurn;
	}
}