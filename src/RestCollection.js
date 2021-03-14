function RestCollection(apiUrl, itemCtor) {
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
			query.set('limit', opts.limit);
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


function SortedCollection(origin, key) {
	this.origin = origin;
	this.key = key;
}

SortedCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.order = this.key;
	this.origin.as(ctor, msg, sender, opts);
};

function FilteredCollection(origin, key, value) {
	this.origin = origin;
	this.key = key;
	this.value = value;
}

FilteredCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.filter = opts.filter || {};
	opts.filter[key] = value;
	this.origin.as(ctor, msg, sender, opts);
};

function SubCollection(origin, start, end) {
	this.origin = origin;
	this.start = start || 0;
	this.end = end;
}

SubCollection.prototype.as = function(ctor, msg, sender, opts) {
	var opts = opts || {};
	opts.offset = this.start;
	opts.limit = this.end - this.start;
	this.origin.as(ctor, msg, sender, opts);
};

function RestApple(props) {
	Object.assign(this, props);
}

var apples = new SubCollection(
	new SortedCollection(
		new FilteredCollection(
			new RestCollection('/api/apples', RestApple),
			'color',
			'red'
		),
		'size'
	),
	0,
	10
);

apples.as(Array, console.log, console);