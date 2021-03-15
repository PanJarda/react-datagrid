/* Rest Collection */

export function RestCollection(apiUrl, itemCtor) {
  this.apiUrl = apiUrl;
  this.itemCtor = itemCtor;
}

RestCollection.prototype._handleAsResponse = function () {
  var xhr = this;

  if (xhr.readyState == 4) {
    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
      var res = JSON.parse(xhr.responseText, xhr).map(
        (item) => new this.itemCtor(item)
      );
      var totalCount = parseInt(xhr.getResponseHeader('x-total-count'));
      var proto = Object.create(xhr.ctor);
      xhr.msg.call(xhr.sender, xhr.ctor.apply(proto, res), totalCount);
    }
    // TODO handle failure
  }
};

RestCollection.prototype._handleAddResponse = function () {
  //
};

RestCollection.prototype._handleSizeResponse = function () {
  var xhr = this;

  if (xhr.readyState == 4) {
    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
      var totalCount = parseInt(xhr.getResponseHeader('x-total-count'));
      xhr.msg.call(xhr.sender, totalCount);
    }
    // TODO handle failure
  }
};

RestCollection.prototype.add = function (props, msg, sender) {
  // xhr.send(props);
};

RestCollection.prototype._get = function (opts) {
  var xhr = new XMLHttpRequest();
  xhr.itemCtor = this.itemCtor;
  var query = new URLSearchParams();
  if (opts) {
    if (opts.filter) {
      var filter = opts.filter;
      Object.keys(filter).map((key) => query.append(key, filter[key]));
    }

    if (opts.limit !== undefined) {
      query.set('l', opts.limit);
    }

    if (opts.offset !== undefined) {
      if (opts.offset === 0) {
        query.set('page', 1);
      } else {
        query.set('offset', opts.offset);
      }
    }

    if (opts.page !== undefined) {
      query.set('page', opts.page);
    }

    if (opts.order) {
      query.set('order', opts.order);
    }
  }

  xhr.open('GET', this.apiUrl + '?' + query.toString(), true);
  return xhr;
};

RestCollection.prototype.as = function (ctor, msg, sender, opts) {
  var xhr = this._get(opts);
  xhr.ctor = ctor;
  xhr.msg = msg;
  xhr.sender = sender;
  xhr.onreadystatechange = this._handleAsResponse;
  xhr.send();
};

RestCollection.prototype.size = function (msg, sender, opts) {
  opts = Object.assign({}, opts || {});
  if ('offset' in opts) delete opts.offset;
  opts.page = 1;
  opts.limit = 1;
  var xhr = this._get(opts);
  xhr.msg = msg;
  xhr.sender = sender;
  xhr.onreadystatechange = this._handleSizeResponse;
  xhr.send();
};

export function SortedCollection(origin, key, order) {
  this.origin = origin;
  this.key = key;
  this.order = order;
}

SortedCollection.prototype.add = function (props, msg, sender) {
  this.origin.add(props, msg, sender);
};

SortedCollection.prototype.as = function (ctor, msg, sender, opts) {
  var opts = opts || {};
  opts.order = this.key;
  this.origin.as(ctor, msg, sender, opts);
};

SortedCollection.prototype.size = function (msg, sender, opts) {
  this.origin.size(msg, sender, opts);
};

export function FilteredCollection(origin, filters) {
  this.origin = origin;
  this.filters = filters;
}

FilteredCollection.prototype._prepareOpts = function (opts) {
  var opts = opts || {};
  opts.filter = opts.filter || {};
  Object.assign(opts.filter, this.filters);
  return opts;
};

FilteredCollection.prototype.add = function (props, msg, sender) {
  this.origin.add(props, msg, sender);
};

FilteredCollection.prototype.as = function (ctor, msg, sender, opts) {
  this.origin.as(ctor, msg, sender, this._prepareOpts(opts));
};

FilteredCollection.prototype.size = function (msg, sender, opts) {
  this.origin.size(msg, sender, this._prepareOpts(opts));
};

export function SubCollection(origin, start, end) {
  this.origin = origin;
  this.start = start || 0;
  this.end = end;
}

SubCollection.prototype._prepareOpts = function (opts) {
  var opts = opts || {};
  opts.offset = this.start;
  opts.limit = this.end - this.start;
  return opts;
};

SubCollection.prototype.add = function (props, msg, sender) {
  this.origin.add(props, msg, sender);
};

SubCollection.prototype.as = function (ctor, msg, sender, opts) {
  this.origin.as(ctor, msg, sender, this._prepareOpts(opts));
};

SubCollection.prototype.size = function (msg, sender, opts) {
  this.origin.size(msg, sender, this._prepareOpts(opts));
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
