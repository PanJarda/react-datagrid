export function AsyncCollection(itemCtor) {
	this.itemCtor = itemCtor;
	this.items = [];
}

AsyncCollection.prototype.add = function(item, success, failure, sender) {
	// jakym zpusobem se bude serializovat item je na nem a ne na kolekci
	this.items.push(item.serialize());
};

AsyncCollection.prototype.delete = function(item, success, failure, sender) {

};

AsyncCollection.prototype.as = function(ctor, success, failure, sender, opts) {
	var proto = Object.create(ctor);
	// sort filter offset
	setTimeout(() => msg.call(sender, ctor.apply(proto, this.items.map(item => new this.itemCtor(item)))), 0);
};

AsyncCollection.prototype.size = function(msg, sender, opts) {
	
};

/* Rest Collection */

export function RestCollection(apiUrl, itemCtor) {
	this.apiUrl = apiUrl;
	this.itemCtor = itemCtor;
}

RestCollection.prototype._handleAsResponse = function() {
	var xhr = this;

	if (xhr.readyState == 4) {
		if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
			var res =  JSON.parse(xhr.responseText, xhr).map(
				item => new this.itemCtor(item));

			var proto = Object.create(xhr.ctor);
			xhr.msg.call(xhr.sender, xhr.ctor.apply(proto, res));
		}
		// TODO handle failure
	}
};

RestCollection.prototype._handleAddResponse = function(){
	//
};

RestCollection.prototype.add = function(props, msg, sender) {
	// xhr.send(props);
};

RestCollection.prototype.as = function(ctor, msg, sender, opts) {
	var xhr = new XMLHttpRequest();
	xhr.ctor = ctor;
	xhr.itemCtor = this.itemCtor;
	xhr.msg = msg;
	xhr.sender = sender;
	xhr.onreadystatechange = this._handleAsResponse;

	var query = new URLSearchParams();
	if (opts) {
		if (opts.filter) {
			var filter = opts.filter
			Object.keys(filter).map(key => query.append(key, filter[key]));
		}

		if (opts.limit !== undefined) {
			query.set('l', opts.limit);
		}

		if (opts.offset !== undefined) {
			query.set('offset',opts.offset)
		}

		if (opts.order) {
			query.set('order', opts.order);
		}
	}

	xhr.open('GET', this.apiUrl + '?' + query.toString(), true);
	xhr.send();
};

RestCollection.prototype.size = function(msg, sender, opts) {
	// TODO
};


export function SortedCollection(origin, key) {
	this.origin = origin;
	this.key = key;
}

SortedCollection.prototype.add = function(props, msg, sender) {
	this.origin.add(props, msg, sender);
};

SortedCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.order = this.key;
	this.origin.as(ctor, msg, sender, opts);
};

SortedCollection.prototype.size = function(msg, sender, opts) {

};

export function FilteredCollection(origin, key, value) {
	this.origin = origin;
	this.key = key;
	this.value = value;
}

FilteredCollection.prototype.add = function(props, msg, sender) {
	this.origin.add(props, msg, sender);
};

FilteredCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.filter = opts.filter || {};
	opts.filter[this.key] = this.value;
	this.origin.as(ctor, msg, sender, opts);
};

FilteredCollection.prototype.size = function(msg, sender, opts) {

};

export function SubCollection(origin, start, end) {
	this.origin = origin;
	this.start = start || 0;
	this.end = end;
}

SubCollection.prototype.add = function(props, msg, sender) {
	this.origin.add(props, msg, sender);
};

SubCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.offset = this.start;
	opts.limit = this.end - this.start;
	this.origin.as(ctor, msg, sender, opts);
};

SubCollection.prototype.size = function(msg, sender, opts) {

};

/*
var apples = new SubCollection(
	new SortedCollection(
		new FilteredCollection(
			new AsyncCollection(RestApple),
			'color',
			'red'
		),
		'size'
	),
	0,
	10
);

apples.as(Array, console.log, console);


apples.filter('color', 'red')
	.filter('size[gte]', 5)
	.sort('size', 'asc')
	.as(Array, console.log, console);

apples.size(console.log, console);*/