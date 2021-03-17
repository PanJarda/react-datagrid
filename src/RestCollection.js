/* Rest Collection */

export function RestCollection(apiUrl, itemCtor) {
  this.apiUrl = apiUrl;
  this.itemCtor = itemCtor;
}

RestCollection.prototype._handleAsResponse = function () {
  var xhr = this;
  var totalCount;

  if (xhr.readyState == 4) {
    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
      var res = JSON.parse(xhr.responseText, xhr).map(
        (item) => new this.itemCtor(item)
      );
      if (xhr.opts.offset === 0 || xhr.opts.page === 1) {
        totalCount = parseInt(xhr.getResponseHeader('x-total-count'));
      }
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
  var totalCount;

  if (xhr.readyState == 4) {
    if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) {
      totalCount = parseInt(xhr.getResponseHeader('x-total-count'));
      xhr.msg.call(xhr.sender, totalCount);
    }
    // TODO handle failure
  }
};

RestCollection.prototype.add = function () {
  // xhr.send(props);
};

RestCollection.prototype._get = function (opts) {
  var xhr = new XMLHttpRequest();
  xhr.itemCtor = this.itemCtor;
  var query = [];
  if (opts) {
    if (opts.filter) {
      var filter = opts.filter;
      Object.keys(filter).map((key) => query.push(key + '=' + filter[key]));
    }

    if (opts.limit !== undefined) {
      query.push('l=' + opts.limit.toString());
    }

    if (opts.offset !== undefined) {
      if (opts.offset === 0) {
        query.push('page=1');
      } else {
        query.push('offset=' + opts.offset.toString());
      }
    }

    if (opts.page !== undefined) {
      query.push('page=' + opts.page.toString());
    }

    if (opts.order) {
      query.push('order=' + opts.order.toString());
    }
  }

  xhr.open('GET', this.apiUrl + '?' + query.join('&'), true);
  return xhr;
};

RestCollection.prototype.as = function (ctor, msg, sender, opts) {
  var xhr = this._get(opts);
  xhr.ctor = ctor;
  xhr.msg = msg;
  xhr.sender = sender;
  xhr.opts = opts;
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

RestCollection.prototype.sort = function (column, asc) {
  return new SortedCollection(this, column, asc);
};

RestCollection.prototype.filter = function (filters) {
  return new FilteredCollection(this, filters);
};

RestCollection.prototype.inRange = function (start, end) {
  return new SubCollection(this, start, end);
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
  opts = opts || {};
  opts.order = this.key;
  this.origin.as(ctor, msg, sender, opts);
};

SortedCollection.prototype.size = function (msg, sender, opts) {
  this.origin.size(msg, sender, opts);
};

SortedCollection.prototype.filter = function (filters) {
  return new FilteredCollection(this.origin, filters);
};

SortedCollection.prototype.inRange = function (start, end) {
  return new SubCollection(this.origin, start, end);
};

export function FilteredCollection(origin, filters) {
  this.origin = origin;
  this.filters = filters;
}

FilteredCollection.prototype._prepareOpts = function (opts) {
  opts = opts || {};
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

//TODO add multiple sorts
FilteredCollection.prototype.sort = function (column, asc) {
  return new SortedCollection(this.origin, column, asc);
};

FilteredCollection.prototype.inRange = function (start, end) {
  return new SubCollection(this.origin, start, end);
};

export function SubCollection(origin, start, end) {
  this.origin = origin;
  this.start = start || 0;
  this.end = end;
}

SubCollection.prototype._prepareOpts = function (opts) {
  opts = opts || {};
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

SubCollection.prototype.filter = function (filters) {
  return new FilteredCollection(this.origin, filters);
};

SubCollection.prototype.sort = function (column, asc) {
  return new SortedCollection(this.origin, column, asc);
};
