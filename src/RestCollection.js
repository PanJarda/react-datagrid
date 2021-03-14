class AsyncCollection {
	constructor(itemCtor) {
		this.itemCtor = itemCtor;
		this.items = [];
	}

	add(msg, sender) {
		var o = Object.create(this.itemCtor.prototype);
		var args = Array.prototype.slice.call(arguments, 2);
		this.itemCtor.apply(o, args);
		this.items.push(o);
		msg.call(sender, o);
	}

	as(ctor, msg, sender, options) {
		var o = Object.create(ctor.prototype);
		var res = ctor.apply(o, this.items);
		msg.call(sender, res);
	}
	
	size(msg, sender) {
		msg.call(sender, this.items.length);
	}
}

apples = new AsyncCollection(Apple);
apples.as(Array, apples => apples.forEach(), sender, options)

class RestCollection {
	constructor(apiUrl, itemCtor) {
		super(itemCtor);
		this.apiUrl = apiUrl;
	}

	as(sender, msg, ctor, opts) {
		
	}

	size(ctor) {

	}
}