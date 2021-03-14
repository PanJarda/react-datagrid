/* algebraic approach---- */
class RestCollection {
	sort() {
		new SortedRestCollection;
	}

	filter() {
		new FilteredRestCollection;
	}

	offset(num) {
		new OffsettedRestCollection;
	}

	limit(num) {
		new LimitedRestCollection;
	}

	toArray() {

	}
}

class SortedRestCollection {
	sort() {
		new SortedRestCollection;
	}

	filter(property) {
		new SortedFilteredRestCollection;
	}

	offset() {
		new OffsettedSortedRestCollection;
	}

	limit() {
		new LimitedSortedRestCollection;
	}

	toArray(sender, msg) {

	}
}

class FilteredRestCollection {
	filter(prop) {
		new FilteredRestCollection;
	}

	sort(prop, order) {
		new SortedFilteredRestCollection();
	}

	offset(num) {
		new FilteredOffsettedRestCollection;
	}

	limit(num) {
		new FilteredLimitedRestCollection;
	}
}

class LimitedRestCollection {
	sort() {

	}

	filter() {

	}
}

class OffsettedRestCollection {

}

class SortedFilteredRestCollection {
	sort() {
		new SortedFilteredRestCollection;
	}

	filter() {
		new SortedFilteredRestCollection;
	}

	offset() {
		new SortedFilteredOffsettedLimitedRestCollection;
	}

	limit() {
		new SortedFilteredLimitedRestCollection;
	}
}

class SortedFilteredOffsettedRestCollection {
	limit() {
		new SortedFilteredOffsettedLimitedRestCollection;
	}
}

class SortedFilteredLimitedRestCollection {
	offset(num) {
		new SortedFilteredOffsettedLimitedRestCollection;
	}
}

class SortedFilteredOffsettedLimitedRestCollection {
	toArray(sender, msg) {
		//..
	}
}


var apples = new RestCollection('/api/apples', Apple);

apples
	.sort('size')
	.filter('color', 'red')
	.offset(10)
	.limit(10)
	.toArray(apples =>
		apples.map(apple =>
			<Apple apple={apple} />));

/* ---- */

/* Yegor matrioshka approach: --------------------------*/

list = apples.as(List);

array = apples.as(Array);

setOfApples = apples.as(Set);

/

var apples = new OffsettedCollection(
	new LimitedCollection(
		new FilteredCollection(
			new SortedCollection(
				new RestCollection('/api/apples', Apple),
				'size'
			)
		),
		10
	),
	10
);

list = apples.as(List);

class OffsettedRestCollection {
	constructor(origin, offset) {
		this.origin = origin;
		this.offset = offset;
	}

	as(ctor, sender, msg, options) {
		options.offset = this.offset;
		this.origin.as(Iterable, sender, msg, options);
	}
}

var apples = new RestCollection('/api/apples', Apple);

apples.as(List, this, 'receiveResponse', {
	offset: 10,
	limit: 10,
	filter: {
		color: 'red',
		variety: 'basic'
	},
	sort: 'size'
});