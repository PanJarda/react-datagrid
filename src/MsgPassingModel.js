var handler = {
	get: function(target, prop, receiver) {
		if (Object.prototype.hasOwnProperty.call(target, prop)) {
			return target[prop];
		} else if (prop in target) {
			return target._enqueue(prop);
		} else {
			return function() {
				throw 'MessageDoesNotUnderstood';
			};
		}
	}
};

function Actor() {
	this.emptyQueue = true;
	this.queue = [];
	return new Proxy(this, handler);
}

Actor.prototype._enqueue = function(method) {
	var self = this;
	return function() {
		self.queue.push({method, arguments});
		if (self.emptyQueue) {
			self.emptyQueue = false;
			setTimeout(self._processQueue.bind(self), 0);
		}
	};
}

Actor.prototype._processQueue = function() {
	this.queue.forEach(({method, arguments}) => {
		this[method].apply(this, arguments)
	});
	this.queue = [];
	this.emptyQueue = true;
};


function Point(x, y) {
	var o = Object.create(Point.prototype);
	o.x = x;
	o.y = y;
	return Actor.call(o);
}

Point.prototype = Object.create(Actor.prototype);

Point.prototype.getX = function(msg, sender) {
	msg.call(sender, this.x);
};

Point.prototype.getY = function(msg, sender) {
	msg.call(sender, this.y);
};

var point = Point(1,2);

point.getX(console.log, console);
 
//===
